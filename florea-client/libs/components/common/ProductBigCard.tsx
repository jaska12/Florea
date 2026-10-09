import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import ProductCardView from './ProductCardView';

interface ProductBigCardProps {
	product: Product;
	likeProductHandler?: any;
}

const ProductBigCard = (props: ProductBigCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const liked = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);

	/** HANDLERS **/
	const goProductDetailPage = (productId: string) => {
		router.push(`/product/detail?id=${productId}`);
	};

	if (device === 'mobile') {
		return <div>PRODUCT BIG CARD</div>;
	} else {
		return (
			<ProductCardView
				className="product-big-card-box"
				product={product}
				liked={liked}
				wholeCardOpens={true}
				onOpen={() => goProductDetailPage(product?._id)}
				onLike={(e: any) => {
					e.stopPropagation();
					likeProductHandler(user, product?._id);
				}}
			/>
		);
	}
};

export default ProductBigCard;
