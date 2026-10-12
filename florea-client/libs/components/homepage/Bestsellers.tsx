import React, { useState } from 'react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import HomeProductCard from './HomeProductCard';
import SectionHeader from './SectionHeader';
import HomeTabs, { HomeTab } from './HomeTabs';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface BestsellersProps {
	trendInput: ProductsInquiry;
	popularInput: ProductsInquiry;
	topInput: ProductsInquiry;
}

// The three product lists of the homepage (most liked, most viewed, best ranked) behind tabs.
const Bestsellers = (props: BestsellersProps) => {
	const { trendInput, popularInput, topInput } = props;
	const [active, setActive] = useState<string>('trend');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { data: trendData, refetch: trendRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: trendInput },
	});
	const { data: popularData, refetch: popularRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: popularInput },
	});
	const { data: topData, refetch: topRefetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: topInput },
	});

	const lists: Record<string, Product[]> = {
		trend: trendData?.getProducts?.list ?? [],
		popular: popularData?.getProducts?.list ?? [],
		top: topData?.getProducts?.list ?? [],
	};
	const allTabs: HomeTab[] = [
		{ key: 'trend', label: 'Trending' },
		{ key: 'popular', label: 'Most viewed' },
		{ key: 'top', label: 'Top rated' },
	];
	// a tab with no products is not offered; with nothing at all the section is left out
	const tabs = allTabs.filter((tab) => lists[tab.key].length > 0);
	const current = tabs.some((tab) => tab.key === active) ? active : tabs[0]?.key;

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});
			// the same product can be in every tab, so all three lists are read again
			await Promise.all([
				trendRefetch({ input: trendInput }),
				popularRefetch({ input: popularInput }),
				topRefetch({ input: topInput }),
			]);

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!current) return null;

	return (
		<section className={'home-section home-bestsellers tinted'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={'Bestsellers'}
					subtitle={'The bouquets and gifts people like and look at the most.'}
					seeAll={{ href: '/product', label: 'See all products' }}
				>
					<button type={'button'} className={'nav-btn swiper-best-prev'} aria-label={'Previous products'}>
						<WestIcon />
					</button>
					<button type={'button'} className={'nav-btn swiper-best-next'} aria-label={'Next products'}>
						<EastIcon />
					</button>
				</SectionHeader>
				{tabs.length > 1 && (
					<HomeTabs name={'bestsellers'} label={'Bestsellers'} tabs={tabs} active={current} onChange={setActive} />
				)}
				<div
					className={'home-panel'}
					role={tabs.length > 1 ? 'tabpanel' : undefined}
					id={`bestsellers-panel-${current}`}
					aria-labelledby={tabs.length > 1 ? `bestsellers-tab-${current}` : undefined}
					key={current}
				>
					<Swiper
						className={'product-swiper'}
						slidesPerView={'auto'}
						spaceBetween={24}
						modules={[Navigation]}
						navigation={{
							nextEl: '.swiper-best-next',
							prevEl: '.swiper-best-prev',
						}}
					>
						{lists[current].map((product: Product) => {
							return (
								<SwiperSlide key={product._id} className={'product-slide'}>
									<HomeProductCard product={product} likeProductHandler={likeProductHandler} />
								</SwiperSlide>
							);
						})}
					</Swiper>
				</div>
			</div>
		</section>
	);
};

// the inputs the three separate sections used before they were merged
Bestsellers.defaultProps = {
	trendInput: {
		page: 1,
		limit: 8,
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
	popularInput: {
		page: 1,
		limit: 7,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
	topInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default Bestsellers;
