import { useEnumLabel } from '../../i18n/labels';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import { ProductCard } from './ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/product/product';
import { AgentProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { ProductStatus } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { GET_AGENT_PRODUCTS } from '../../../apollo/user/query';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('mypage');
	const enumLabel = useEnumLabel();
	const [searchFilter, setSearchFilter] = useState<AgentProductsInquiry>(initialInput);
	const [agentProducts, setAgentProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getAgentProductsLoading,
		data: getAgentProductsData,
		error: getAgentProductsError,
		refetch: getAgentProductsRefetch,
	} = useQuery(GET_AGENT_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProducts(data?.getAgentProducts?.list);
			setTotal(data?.getAgentProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProductStatus) => {
		setSearchFilter({ ...searchFilter, search: { productStatus: value } });
	};

	const deleteProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert(t('products.areYouSureToDelete'))) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: 'DELETE',
						},
					},
				});
				await getAgentProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(t('products.confirmStatus', { status: enumLabel('productStatus', status) }))) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: status,
						},
					},
				});
				await getAgentProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	return (
		<div id="my-product-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{t('products.myProducts')}</Typography>
					<Typography className="sub-title">{t('products.weAreGladToSee')}</Typography>
				</Stack>
			</Stack>
			<Stack className="product-list-box">
				<Stack className="tab-name-box">
					<Typography
						onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
						className={searchFilter.search.productStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
					>
						{t('products.onSale')}
					</Typography>
					<Typography
						onClick={() => changeStatusHandler(ProductStatus.SOLD)}
						className={searchFilter.search.productStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
					>
						{t('products.onSold')}
					</Typography>
				</Stack>
				<Stack className="list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('products.product')}</Typography>
						<Typography className="title-text">{t('products.datePublished')}</Typography>
						<Typography className="title-text">{t('products.status')}</Typography>
						<Typography className="title-text">{t('products.view')}</Typography>
						<Typography className="title-text">{t('products.action')}</Typography>
					</Stack>

					{agentProducts?.length === 0 ? (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('products.noProductFound')}</p>
						</div>
					) : (
						agentProducts.map((product: Product) => {
							return (
								<ProductCard
									key={product._id}
									product={product}
									deleteProductHandler={deleteProductHandler}
									updateProductHandler={updateProductHandler}
								/>
							);
						})
					)}

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
								<Typography>{t('products.total', { count: total })}</Typography>
							</Stack>
						</Stack>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default MyProducts;
