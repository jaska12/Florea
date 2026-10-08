import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import HomeProductCard from './HomeProductCard';
import SectionHeader from './SectionHeader';
import { Product } from '../../types/product/product';
import Link from 'next/link';
import { ProductsInquiry } from '../../types/product/product.input';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';

interface PopularProductsProps {
	initialInput: ProductsInquiry;
}

const PopularProducts = (props: PopularProductsProps) => {
	const { initialInput } = props;
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
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
			setPopularProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/

	if (!popularProducts) return null;

	return (
		<section className={'home-section home-popular tinted'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Popular products'} subtitle={'The products people have looked at the most.'}>
					<Link className={'text-link'} href={'/product'}>
						See all products
					</Link>
					<button type={'button'} className={'nav-btn swiper-popular-prev'} aria-label={'Previous popular products'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-popular-next'} aria-label={'Next popular products'}>
						<EastIcon />
					</button>
				</SectionHeader>
				{popularProducts.length === 0 ? (
					<div className={'empty-state'}>No popular products yet.</div>
				) : (
					<Swiper
						className={'product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={24}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-popular-next',
							prevEl: '.swiper-popular-prev',
						}}
					>
						{popularProducts.map((product: Product) => {
							return (
								<SwiperSlide key={product._id} className={'product-slide'}>
									<HomeProductCard product={product} />
								</SwiperSlide>
							);
						})}
					</Swiper>
				)}
			</div>
		</section>
	);
};

PopularProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProducts;
