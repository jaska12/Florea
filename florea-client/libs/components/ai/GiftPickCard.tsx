import React from 'react';
import Link from 'next/link';
import { AiGiftPick } from '../../types/ai/ai';
import { REACT_APP_API_URL } from '../../config';
import { useEnumLabel } from '../../i18n/labels';
import { useFormat } from '../../i18n/format';
import AddToCartButton from '../common/AddToCartButton';

interface GiftPickCardProps {
	pick: AiGiftPick;
}

// One recommendation of the gift assistant as a compact row: photo, title as the seller wrote it, tags, price,
// the assistant's reason in one line, and the cart button. The row opens the product; the button only adds it.
const GiftPickCard = ({ pick }: GiftPickCardProps) => {
	const enumLabel = useEnumLabel();
	const format = useFormat();
	const { product, reason } = pick;
	const photo = product.productImages?.[0];
	const tags = [enumLabel('productOccasion', product.productOccasion), enumLabel('productSize', product.productSize)].filter(Boolean);

	return (
		<li className={'gift-pick'}>
			<Link className={'gift-pick-link'} href={{ pathname: '/product/detail', query: { id: product._id } }}>
				<span className={'gift-pick-photo'} style={photo ? { backgroundImage: `url(${REACT_APP_API_URL}/${photo})` } : undefined} />
				<span className={'gift-pick-body'}>
					<strong className={'gift-pick-title'}>{product.productTitle}</strong>
					<span className={'gift-pick-tags'}>{tags.join(' · ')}</span>
					{reason && <span className={'gift-pick-reason'}>{reason}</span>}
					<span className={'gift-pick-price'}>{format.price(product.productPrice)}</span>
				</span>
			</Link>
			<div className={'gift-pick-cart'}>
				<AddToCartButton product={product} variant={'icon'} />
			</div>
		</li>
	);
};

export default GiftPickCard;
