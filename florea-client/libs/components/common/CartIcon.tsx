import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Badge } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { cartVar } from '../../../apollo/store';
import { cartTotals } from '../../cart';

// the bag in the navbar, with the number of pieces in the cart
const CartIcon = () => {
	const { t } = useTranslation('common');
	const items = useReactiveVar(cartVar);
	const count = cartTotals(items).count;

	return (
		<Link href={'/cart'} className={'nav-cart'} aria-label={count ? t('cartIcon.cartWithCount', { count }) : t('cartIcon.cart')}>
			<Badge className={'notify-badge'} badgeContent={count} max={99}>
				<ShoppingBagOutlinedIcon />
			</Badge>
		</Link>
	);
};

export default CartIcon;
