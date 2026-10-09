import React, { useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import HomeProductCard from './HomeProductCard';
import SectionHeader from './SectionHeader';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopProductsProps {
	initialInput: ProductsInquiry;
}

const TopProducts = (props: TopProductsProps) => {
	const { initialInput } = props;
	const [topProducts, setTopProducts] = useState<Product[]>([]);
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
			setTopProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

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

	if (!topProducts) return null;

	return (
		<section className={'home-section home-top'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Top rated'} subtitle={'Ranked by likes and views together.'}>
					<button type={'button'} className={'nav-btn swiper-top-prev'} aria-label={'Previous top products'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-top-next'} aria-label={'Next top products'}>
						<EastIcon />
					</button>
				</SectionHeader>
				{topProducts.length === 0 ? (
					<div className={'empty-state'}>No top products yet.</div>
				) : (
					<Swiper
						className={'product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={24}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-top-next',
							prevEl: '.swiper-top-prev',
						}}
					>
						{topProducts.map((product: Product) => {
							return (
								<SwiperSlide className={'product-slide'} key={product?._id}>
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

TopProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopProducts;
