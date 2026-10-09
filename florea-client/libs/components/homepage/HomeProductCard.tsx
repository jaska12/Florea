import React from 'react';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import ProductCardView from '../common/ProductCardView';

interface HomeProductCardProps {
	product: Product;
	/** when a section has no like action, the heart is shown as a plain count **/
	likeProductHandler?: any;
}

const HomeProductCard = (props: HomeProductCardProps) => {
	const { product, likeProductHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const liked = Boolean(product?.meLiked && product?.meLiked[0]?.myFavorite);

	/** HANDLERS **/
	const pushDetailHandler = async (id: string) => {
		console.log('ID:', id);
		await router.push({
			pathname: '/product/detail',
			query: { id: id },
		});
	};

	return (
		<ProductCardView
			className="home-product-card"
			product={product}
			liked={liked}
			onOpen={() => pushDetailHandler(product._id)}
			onLike={likeProductHandler ? () => likeProductHandler(user, product?._id) : undefined}
		/>
	);
};

export default HomeProductCard;
