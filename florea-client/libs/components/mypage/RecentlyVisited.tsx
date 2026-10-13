import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import ProductCard from '../product/ProductCard';
import { Product } from '../../types/product/product';
import { T } from '../../types/common';
import { useQuery } from '@apollo/client';
import { GET_VISITED } from '../../../apollo/user/query';

const RecentlyVisited: NextPage = () => {
	const { t } = useTranslation('mypage');
	const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchVisited, setSearchVisited] = useState<T>({ page: 1, limit: 6 });

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		error: getVisitedError,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'network-only',
		variables: { input: searchVisited },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setRecentlyVisited(data?.getVisited?.list);
			setTotal(data?.getVisited?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchVisited({ ...searchVisited, page: value });
	};

	return (
		<div id="my-favorites-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{t('visited.recentlyVisited')}</Typography>
					<Typography className="sub-title">{t('visited.weAreGladToSee')}</Typography>
				</Stack>
			</Stack>
			<Stack className="favorites-list-box">
				{recentlyVisited?.length ? (
					recentlyVisited?.map((product: Product) => {
						return <ProductCard key={product._id} product={product} recentlyVisited={true} />;
					})
				) : (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>{t('visited.noRecentlyVisitedProductsFound')}</p>
					</div>
				)}
			</Stack>
			{recentlyVisited?.length ? (
				<Stack className="pagination-config">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(total / searchVisited.limit)}
							page={searchVisited.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total-result">
						<Typography>
							{t('visited.total', { count: total })}
						</Typography>
					</Stack>
				</Stack>
			) : null}
		</div>
	);
};

export default RecentlyVisited;
