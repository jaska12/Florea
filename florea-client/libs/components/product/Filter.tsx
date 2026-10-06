import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductLocation, ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

interface FilterType {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [productLocation, setProductLocation] = useState<ProductLocation[]>(Object.values(ProductLocation));
	const [productType, setProductType] = useState<ProductType[]>(Object.values(ProductType));
	const [productOccasion, setProductOccasion] = useState<ProductOccasion[]>(Object.values(ProductOccasion));
	const [productSize, setProductSize] = useState<ProductSize[]>(Object.values(ProductSize));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.occasionList?.length == 0) {
			delete searchFilter.search.occasionList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.sizeList?.length == 0) {
			delete searchFilter.search.sizeList;
			router.push(`/product?input=${queryParams}`, `/product?input=${queryParams}`, { scroll: false }).then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const productLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('productLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('productTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productOccasionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, occasionList: [...(searchFilter?.search?.occasionList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, occasionList: [...(searchFilter?.search?.occasionList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.occasionList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								occasionList: searchFilter?.search?.occasionList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								occasionList: searchFilter?.search?.occasionList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}


				console.log('productOccasionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productOccasionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('productOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, productOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productSizeSelectHandler = useCallback(
		async (value: ProductSize | null) => {
			try {
				if (value) {
					if (searchFilter?.search?.sizeList?.includes(value)) {
						await router.push(
							`/product?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									sizeList: searchFilter?.search?.sizeList?.filter((item: ProductSize) => item !== value),
								},
							})}`,
							`/product?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									sizeList: searchFilter?.search?.sizeList?.filter((item: ProductSize) => item !== value),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/product?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, sizeList: [...(searchFilter?.search?.sizeList || []), value] },
							})}`,
							`/product?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, sizeList: [...(searchFilter?.search?.sizeList || []), value] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.sizeList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('productSizeSelectHandler:', value);
			} catch (err: any) {
				console.log('ERROR, productSizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Gift</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`product-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{productLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="product-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as ProductLocation)}
										onChange={productLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="product-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Product Type</Typography>
					{productType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="product-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={productTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as ProductType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="product_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Occasion</Typography>
					{productOccasion.map((occasion: string) => (
						<Stack className={'input-box'} key={occasion}>
							<Checkbox
								id={occasion}
								className="product-checkbox"
								color="default"
								size="small"
								value={occasion}
								onChange={productOccasionSelectHandler}
								checked={(searchFilter?.search?.occasionList || []).includes(occasion as ProductOccasion)}
							/>
							<label htmlFor={occasion} style={{ cursor: 'pointer' }}>
								<Typography className="product_type">{occasion}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Size</Typography>
					<Stack className="button-group">
						<Button
							sx={{
								borderRadius: '12px 0 0 12px',
								border: !searchFilter?.search?.sizeList ? '2px solid #181A20' : '1px solid #b9b9b9',
							}}
							onClick={() => productSizeSelectHandler(null)}
						>
							Any
						</Button>
						{productSize.map((size: ProductSize, index: number) => (
							<Button
								sx={{
									borderRadius: index === productSize.length - 1 ? '0 12px 12px 0' : 0,
									border: searchFilter?.search?.sizeList?.includes(size) ? '2px solid #181A20' : '1px solid #b9b9b9',
									borderLeft: searchFilter?.search?.sizeList?.includes(size) ? undefined : 'none',
								}}
								onClick={() => productSizeSelectHandler(size)}
								key={size}
							>
								{size}
							</Button>
						))}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'GiftWrap'}
							className="product-checkbox"
							color="default"
							size="small"
							value={'productGiftWrap'}
							checked={(searchFilter?.search?.options || []).includes('productGiftWrap')}
							onChange={productOptionSelectHandler}
						/>
						<label htmlFor={'GiftWrap'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Gift wrap</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'SameDay'}
							className="product-checkbox"
							color="default"
							size="small"
							value={'productSameDay'}
							checked={(searchFilter?.search?.options || []).includes('productSameDay')}
							onChange={productOptionSelectHandler}
						/>
						<label htmlFor={'SameDay'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Same day delivery</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="square-year-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									productPriceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									productPriceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
