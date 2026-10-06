import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { productPrices } from '../../config';
import { ProductLocation, ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface HeaderFilterProps {
	initialInput: ProductsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const occasionRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openOccasion, setOpenOccasion] = useState(false);
	const [productLocation, setProductLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [productType, setProductType] = useState<ProductType[]>(Object.values(ProductType));
	const [productOccasion, setProductOccasion] = useState<ProductOccasion[]>(Object.values(ProductOccasion));
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!occasionRef?.current?.contains(event.target)) {
				setOpenOccasion(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenOccasion(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenOccasion(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenOccasion(false);
	};

	const occasionStateChangeHandler = () => {
		setOpenOccasion((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenOccasion(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const productLocationSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						locationList: [value],
					},
				});
				typeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, productLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productTypeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						typeList: [value],
					},
				});
				occasionStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, productTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productOccasionSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						occasionList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, productOccasionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productSizeSelectHandler = useCallback(
		async (size: ProductSize | null) => {
			try {
				if (size) {
					if (searchFilter?.search?.sizeList?.includes(size)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								sizeList: searchFilter?.search?.sizeList?.filter((item: ProductSize) => item !== size),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: { ...searchFilter.search, sizeList: [...(searchFilter?.search?.sizeList || []), size] },
						});
					}
				} else {
					delete searchFilter?.search.sizeList;
					setSearchFilter({ ...searchFilter });
				}

				console.log('productSizeSelectHandler:', size);
			} catch (err: any) {
				console.log('ERROR, productSizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, productOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productPriceHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						pricesRange: { ...searchFilter.search.pricesRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						pricesRange: { ...searchFilter.search.pricesRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.occasionList?.length == 0) {
				delete searchFilter.search.occasionList;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			if (searchFilter?.search?.sizeList?.length == 0) {
				delete searchFilter.search.sizeList;
			}

			await router.push(
				`/product?input=${JSON.stringify(searchFilter)}`,
				`/product?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openLocation ? 'on' : ''}`} onClick={locationStateChangeHandler}>
							<span>{searchFilter?.search?.locationList ? searchFilter?.search?.locationList[0] : t('Location')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span> {searchFilter?.search?.typeList ? searchFilter?.search?.typeList[0] : t('Product type')} </span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openOccasion ? 'on' : ''}`} onClick={occasionStateChangeHandler}>
							<span>
								{searchFilter?.search?.occasionList ? searchFilter?.search?.occasionList[0] : t('Occasion')}
							</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
							<img src="/img/icons/tune.svg" alt="" />
							<span>{t('Advanced')}</span>
						</Box>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-location ${openLocation ? 'on' : ''}`} ref={locationRef}>
						{productLocation.map((location: string) => {
							return (
								<div onClick={() => productLocationSelectHandler(location)} key={location}>
									<img src={`img/banner/cities/${location}.webp`} alt="" />
									<span>{location}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-type ${openType ? 'on' : ''}`} ref={typeRef}>
						{productType.map((type: string) => {
							return (
								<div
									style={{ backgroundImage: `url(/img/banner/types/${type.toLowerCase()}.webp)` }}
									onClick={() => productTypeSelectHandler(type)}
									key={type}
								>
									<span>{type}</span>
								</div>
							);
						})}
					</div>

					<div className={`filter-rooms ${openOccasion ? 'on' : ''}`} ref={occasionRef}>
						{productOccasion.map((occasion: string) => {
							return (
								<span onClick={() => productOccasionSelectHandler(occasion)} key={occasion}>
									{occasion}
								</span>
							);
						})}
					</div>
				</Stack>

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Find your gift</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>size</span>
										<div className={'inside'}>
											<div
												className={`room ${!searchFilter?.search?.sizeList ? 'active' : ''}`}
												onClick={() => productSizeSelectHandler(null)}
											>
												Any
											</div>
											{Object.values(ProductSize).map((size: ProductSize) => (
												<div
													className={`room ${searchFilter?.search?.sizeList?.includes(size) ? 'active' : ''}`}
													onClick={() => productSizeSelectHandler(size)}
													key={size}
												>
													{size}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>options</span>
										<div className={'inside'}>
											<FormControl>
												<Select
													value={optionCheck}
													onChange={productOptionSelectHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'productSameDay'}>Same day delivery</MenuItem>
													<MenuItem value={'productGiftWrap'}>Gift wrap</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>price</span>
										<div className={'inside space-between align-center'}>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.start}
													onChange={(e: any) => productPriceHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{productPrices.map((price: number) => (
														<MenuItem
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.end || 0) < price}
															key={price}
														>
															{price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl sx={{ width: '122px' }}>
												<Select
													value={searchFilter?.search?.pricesRange?.end}
													onChange={(e: any) => productPriceHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{productPrices.map((price: number) => (
														<MenuItem
															value={price}
															disabled={(searchFilter?.search?.pricesRange?.start || 0) > price}
															key={price}
														>
															{price}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default HeaderFilter;
