import { useTranslation } from 'next-i18next';
import React from 'react';
import { useReactiveVar } from '@apollo/client';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import { userVar } from '../../../apollo/store';
import { addToCart, canBuy } from '../../cart';
import { Product } from '../../types/product/product';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface AddToCartButtonProps {
	product: Product;
	/** 'icon' is the round button on a product card, 'full' the wide button on the product page **/
	variant?: 'icon' | 'full';
	quantity?: number;
}

const AddToCartButton = (props: AddToCartButtonProps) => {
	const { t } = useTranslation('common');
	const { product, variant = 'icon', quantity = 1 } = props;
	const user = useReactiveVar(userVar);
	const available = canBuy(product);

	// a florist does not buy from their own shop
	if (!product?._id || (user?._id && user._id === product.memberId)) return null;

	/** HANDLERS **/
	const addHandler = (e: React.MouseEvent) => {
		// on a card the button sits on the photo, which opens the product
		e.stopPropagation();
		const result = addToCart(product, quantity);
		if (result.added) sweetTopSmallSuccessAlert(result.message, 1400).then();
		else sweetMixinErrorAlert(result.message, 2200).then();
	};

	if (variant === 'full') {
		return (
			<button type={'button'} className={'add-to-cart full'} onClick={addHandler} disabled={!available}>
				<AddShoppingCartRoundedIcon />
				{available ? t('addToCart.addToCart') : t('addToCart.outOfStock')}
			</button>
		);
	}

	if (!available) return <span className={'card-soldout'}>{t('addToCart.outOfStock')}</span>;

	return (
		<button
			type={'button'}
			className={'add-to-cart icon'}
			onClick={addHandler}
			aria-label={t('addToCart.addItem', { title: product.productTitle })}
		>
			<AddShoppingCartRoundedIcon />
		</button>
	);
};

export default AddToCartButton;
