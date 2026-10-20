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
			item.productId === productId && !item.unavailable
				? { ...item, quantity: Math.max(1, Math.min(quantity, limitOf(item.productStock) || 1)) }
				: item,
		),
	);
};

/** The lines that can be ordered: the ones the last check did not mark as unavailable. */
export const buyableItems = (items: CartItem[]): CartItem[] => items.filter((item) => !item.unavailable);

/**
 * Brings each line up to date with the product as it is now (`products` from getCartProducts): price, title,
 * picture, stock and florist. A product that did not come back, or can no longer be bought, is marked unavailable.
 * Returns what changed, so the page can tell the buyer.
 */
export const syncCart = (products: Product[]): { priceChanged: boolean; becameUnavailable: boolean } => {
	const byId = new Map(products.map((product) => [String(product._id), product]));
	let priceChanged = false;
	let becameUnavailable = false;

	const items: CartItem[] = cartVar().map((item: CartItem) => {
		const product = byId.get(item.productId);
		if (!product || !canBuy(product)) {
			if (!item.unavailable) becameUnavailable = true;
			return { ...item, unavailable: true };
		}
		if (product.productPrice !== item.productPrice) priceChanged = true;
		const limit = limitOf(product.productStock);
		return {
			...item,
			productTitle: product.productTitle,
			productPrice: product.productPrice,
			productImage: product.productImages?.[0] ?? item.productImage,
			productStock: product.productStock,
			agentId: String(product.memberId),
			agentNick: product.memberData?.memberNick ?? item.agentNick,
			quantity: Math.max(1, Math.min(item.quantity, limit)),
			unavailable: false,
		};
	});

	if (JSON.stringify(items) !== JSON.stringify(cartVar())) save(items);
	return { priceChanged, becameUnavailable };
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
		// a line that can no longer be bought is shown, but not counted
		const buyable = buyableItems(list);
		const subtotal = buyable.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
		const delivery = buyable.length === 0 || subtotal >= freeDeliveryFrom ? 0 : deliveryFee;
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
		count: buyableItems(items).reduce((sum, item) => sum + item.quantity, 0),
		subtotal: groups.reduce((sum, group) => sum + group.subtotal, 0),
		delivery: groups.reduce((sum, group) => sum + group.delivery, 0),
		total: groups.reduce((sum, group) => sum + group.total, 0),
	};
};
