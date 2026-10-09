import React, { useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import HomeProductCard from './HomeProductCard';
import SectionHeader from './SectionHeader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TrendProductsProps {
	initialInput: ProductsInquiry;
}

const TrendProducts = (props: TrendProductsProps) => {
	const { initialInput } = props;
	const [trendProducts, setTrendProducts] = useState<Product[]>([]);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);

			await likeTargetProduct({
				variables: { input: id },
			});
			await getProductsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendProducts) console.log('trendProducts:', trendProducts);
	if (!trendProducts) return null;

	return (
		<section className={'home-section home-trend'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Trending bouquets and gifts'} subtitle={'What people have liked the most this season.'}>
					<button type={'button'} className={'nav-btn swiper-trend-prev'} aria-label={'Previous trending products'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-trend-next'} aria-label={'Next trending products'}>
						<EastIcon />
					</button>
				</SectionHeader>
				{trendProducts.length === 0 ? (
					<div className={'empty-state'}>Nothing is trending yet.</div>
				) : (
					<Swiper
						className={'product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={24}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-trend-next',
							prevEl: '.swiper-trend-prev',
						}}
					>
						{trendProducts.map((product: Product) => {
							return (
								<SwiperSlide key={product._id} className={'product-slide'}>
									<HomeProductCard product={product} likeProductHandler={likeProductHandler} />
								</SwiperSlide>
							);
						})}
					</Swiper>
				)}
			</div>
		</section>
	);
};

TrendProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProducts;
