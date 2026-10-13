import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import { ProductCard } from '../mypage/ProductCard';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';

const MemberProducts: NextPage = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('member');
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>({ ...initialInput });
	const [agentProducts, setAgentProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setAgentProducts(data?.getProducts?.list);
			setTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getProductsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	return (
		<div id="member-products-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{t('products.products')}</Typography>
				</Stack>
			</Stack>
			<Stack className="products-list-box">
				<Stack className="list-box">
					{agentProducts?.length > 0 && (
						<Stack className="listing-title-box">
							<Typography className="title-text">{t('products.listingTitle')}</Typography>
							<Typography className="title-text">{t('products.datePublished')}</Typography>
							<Typography className="title-text">{t('products.status')}</Typography>
							<Typography className="title-text">{t('products.view')}</Typography>
						</Stack>
					)}
					{agentProducts?.length === 0 && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('products.noProductFound')}</p>
						</div>
					)}
					{agentProducts?.map((product: Product) => {
						return <ProductCard product={product} memberPage={true} key={product?._id} />;
					})}

					{agentProducts.length !== 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(total / searchFilter.limit)}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>{total} product available</Typography>
							</Stack>
						</Stack>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

MemberProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			memberId: '',
		},
	},
};

export default MemberProducts;
