import { tr } from './i18n/tr';
import { cartVar } from '../apollo/store';
import { deliveryFee, freeDeliveryFrom } from './config';
import { ProductStatus } from './enums/product.enum';
import { CartGroup, CartItem, CartTotals } from './types/cart/cart';
import { Product } from './types/product/product';

// The cart lives in the browser (localStorage) until the order is placed. Components read cartVar.

const STORAGE_KEY = 'floreaCart';
export const MAX_QUANTITY = 50;

const save = (items: CartItem[]) => {
	cartVar(items);
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (err) {
		// the cart still works for this visit when the browser refuses to store it
	}
};

export const loadCart = () => {
	if (typeof window === 'undefined') return;
	try {
		const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
		cartVar(Array.isArray(stored) ? stored.filter((item) => item?.productId && item?.quantity > 0) : []);
	} catch (err) {
		cartVar([]);
	}
};

// the most the buyer may take of one product
const limitOf = (stock: number): number => Math.max(0, Math.min(stock, MAX_QUANTITY));

export const canBuy = (product?: Product | null): boolean =>
	Boolean(product && product.productStatus === ProductStatus.ACTIVE && product.productStock > 0);

/** Adds a product, or raises its quantity. Returns the message to show the buyer. */
export const addToCart = (product: Product, quantity: number = 1): { added: boolean; message: string } => {
	if (!canBuy(product)) return { added: false, message: tr('common:cart.outOfStock', 'This product is out of stock') };

	const items: CartItem[] = cartVar();
	const existing = items.find((item) => item.productId === product._id);
	const limit = limitOf(product.productStock);
	const wanted = (existing?.quantity ?? 0) + quantity;

	if (existing && existing.quantity >= limit) {
		return {
			added: false,
			message: tr('common:cart.allInCart', 'Only {{limit}} available, and all of them are in your cart', { limit }),
		};
	}

	const line: CartItem = {
		productId: product._id,
		productTitle: product.productTitle,
		productPrice: product.productPrice,
		productImage: product.productImages?.[0],
		productStock: product.productStock,
		agentId: product.memberId,
		agentNick: product.memberData?.memberNick ?? existing?.agentNick,
		quantity: Math.min(wanted, limit),
	};
	save(existing ? items.map((item) => (item.productId === product._id ? line : item)) : [...items, line]);

	return {
		added: true,
		message:
			wanted > limit
				? tr('common:cart.cartHasAll', 'Only {{limit}} available; your cart has all of them', { limit })
				: tr('common:cart.added', 'Added to cart'),
	};
};

export const setCartQuantity = (productId: string, quantity: number) => {
	save(
		cartVar().map((item: CartItem) =>
			item.productId === productId
				? { ...item, quantity: Math.max(1, Math.min(quantity, limitOf(item.productStock) || 1)) }
				: item,
		),
	);
};

export const removeFromCart = (productId: string) => {
	save(cartVar().filter((item: CartItem) => item.productId !== productId));
};

export const clearCart = () => save([]);

/** One group for each florist: each becomes its own order with its own delivery. The server does the same sum. */
export const cartGroups = (items: CartItem[]): CartGroup[] => {
	const groups = new Map<string, CartItem[]>();
	for (const item of items) groups.set(item.agentId, [...(groups.get(item.agentId) ?? []), item]);

	return Array.from(groups.entries()).map(([agentId, list]: [string, CartItem[]]) => {
		const subtotal = list.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
		const delivery = subtotal >= freeDeliveryFrom ? 0 : deliveryFee;
		return {
			agentId: agentId,
			agentNick: list.find((item) => item.agentNick)?.agentNick,
			items: list,
			subtotal: subtotal,
			delivery: delivery,
			total: subtotal + delivery,
		};
	});
};

export const cartTotals = (items: CartItem[]): CartTotals => {
	const groups = cartGroups(items);
	return {
		count: items.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: groups.reduce((sum, group) => sum + group.subtotal, 0),
		delivery: groups.reduce((sum, group) => sum + group.delivery, 0),
		total: groups.reduce((sum, group) => sum + group.total, 0),
	};
};
