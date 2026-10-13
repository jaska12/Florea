import { useTranslation } from 'next-i18next';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import ProductCard from '../../libs/components/product/ProductCard';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/product/Filter';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Direction } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { productPriceCeiling } from '../../libs/config';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('product');
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');
	// on phones and tablets the filter is a panel that slides up from the bottom
	const [filterOpen, setFilterOpen] = useState<boolean>(false);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list);
			setTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('searchFilter:', searchFilter);
		getProductsRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/product?input=${JSON.stringify(searchFilter)}`,
			`/product?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.ASC });
				setFilterSortName(t('list.lowestPrice'));
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'productPrice', direction: Direction.DESC });
				setFilterSortName(t('list.highestPrice'));
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({
				variables: { input: id },
			});
			await getProductsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert(t('list.success'), 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="product-list-page" style={{ position: 'relative' }}>
			<div className="container">
				<Box component={'div'} className={'right'}>
					<button type={'button'} className={'filter-toggle'} onClick={() => setFilterOpen(true)}>
						<TuneRoundedIcon />
						{t('list.filters')}
					</button>
					<span>{t('list.sortBy')}</span>
					<div>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>
						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
							<MenuItem
								onClick={sortingHandler}
								id={'new'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								{t('list.new')}
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'lowest'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								{t('list.lowestPrice')}
							</MenuItem>
							<MenuItem
								onClick={sortingHandler}
								id={'highest'}
								disableRipple
								sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
							>
								{t('list.highestPrice')}
							</MenuItem>
						</Menu>
					</div>
				</Box>
				<Stack className={'product-page'}>
					<div className={`filter-backdrop ${filterOpen ? 'open' : ''}`} onClick={() => setFilterOpen(false)} />
					<Stack className={`filter-config ${filterOpen ? 'open' : ''}`}>
						<div className={'sheet-head'}>
							<strong>{t('list.filters')}</strong>
							<button type={'button'} aria-label={t('list.closeFilters')} onClick={() => setFilterOpen(false)}>
								<CloseRoundedIcon />
							</button>
						</div>
						{/* @ts-ignore */}
						<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						<div className={'sheet-foot'}>
							<button type={'button'} onClick={() => setFilterOpen(false)}>
								Show {total} product{total === 1 ? '' : 's'}
							</button>
						</div>
					</Stack>
					<Stack className="main-config" mb={'76px'}>
						<Stack className={'list-config'}>
							{products?.length === 0 ? (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>{t('list.noProductsFound')}</p>
								</div>
							) : (
								products.map((product: Product) => {
									return <ProductCard product={product} likeProductHandler={likeProductHandler} key={product?._id} />;
								})
							)}
						</Stack>
						<Stack className="pagination-config">
							{products.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}

							{products.length !== 0 && (
								<Stack className="total-result">
									<Typography>
										Total {total} product{total > 1 ? 's' : ''} available
									</Typography>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: productPriceCeiling,
			},
		},
	},
};

export default withLayoutBasic(ProductList);
