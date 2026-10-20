import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useReactiveVar } from '@apollo/client';
import { cartVar } from '../../apollo/store';
import { GET_CART_PRODUCTS } from '../../apollo/user/query';
import { syncCart } from '../cart';
import { CartItem } from '../types/cart/cart';
import { Product } from '../types/product/product';

export interface CartSync {
	// the cart has been compared with the products as they are now (or the check failed and the API will judge)
	checked: boolean;
	// a price in the cart was changed to the current one during this visit
	priceChanged: boolean;
	// compares the cart again (after the API refused an order, for example)
	recheck: () => Promise<void>;
}

/**
 * The cart is a copy kept in the browser, so a price, the stock or a product's status can be out of date.
 * The cart and checkout pages compare it with the products as they are now when they open, and again when a
 * product is added or removed.
 */
export const useCartSync = (): CartSync => {
	const client = useApolloClient();
	const items: CartItem[] = useReactiveVar(cartVar);
	const ids = Array.from(new Set(items.map((item) => item.productId)))
		.sort()
		.join(',');
	const [checkedIds, setCheckedIds] = useState<string | null>(null);
	const [priceChanged, setPriceChanged] = useState<boolean>(false);

	const check = useCallback(
		async (list: string) => {
			if (!list) {
				setCheckedIds(list);
				return;
			}
			try {
				const result = await client.query({
					query: GET_CART_PRODUCTS,
					variables: { input: list.split(',') },
					fetchPolicy: 'network-only',
					context: { silentError: true },
				});
				const products: Product[] = result.data?.getCartProducts ?? [];
				if (syncCart(products).priceChanged) setPriceChanged(true);
			} catch (err) {
				// the cart stays as it is; the API still refuses an order at a price the buyer did not see
			}
			setCheckedIds(list);
		},
		[client],
	);

	useEffect(() => {
		check(ids);
	}, [ids, check]);

	const recheck = useCallback(() => check(ids), [check, ids]);

	return { checked: checkedIds === ids, priceChanged, recheck };
};
