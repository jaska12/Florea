import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ProductCardView from '../common/ProductCardView';

interface ProductCardType {
	product: Product;
	likeProductHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const ProductCard = (props: ProductCardType) => {
	const { product, likeProductHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const liked = Boolean(myFavorites || (product?.meLiked && product?.meLiked[0]?.myFavorite));

	/** HANDLERS **/
	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/product/detail',
			query: { id: product?._id },
		});
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD</div>;
	} else {
		return (
			<ProductCardView
				className="card-config"
				product={product}
				liked={liked}
				onOpen={pushDetailHandler}
				showStats={!recentlyVisited}
				onLike={(e: any) => {
					e.stopPropagation();
					likeProductHandler?.(user, product?._id);
				}}
			/>
		);
	}
};

export default ProductCard;
