import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface HeaderFilterProps {
	initialInput: ProductsInquiry;
}

/** BOUQUET -> bouquet, FLOWER_BOX -> flower box (capitalized in CSS) **/
const formatLabel = (value: string): string => value.replace(/_/g, ' ').toLowerCase();

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const typeRef: any = useRef();
	const occasionRef: any = useRef();
	const sizeRef: any = useRef();
	const router = useRouter();
	const [openType, setOpenType] = useState(false);
	const [openOccasion, setOpenOccasion] = useState(false);
	const [openSize, setOpenSize] = useState(false);
	const [productType, setProductType] = useState<ProductType[]>(Object.values(ProductType));
	const [productOccasion, setProductOccasion] = useState<ProductOccasion[]>(Object.values(ProductOccasion));
	const [productSize, setProductSize] = useState<ProductSize[]>(Object.values(ProductSize));

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!occasionRef?.current?.contains(event.target)) {
				setOpenOccasion(false);
			}

			if (!sizeRef?.current?.contains(event.target)) {
				setOpenSize(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/
	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenOccasion(false);
		setOpenSize(false);
	};

	const occasionStateChangeHandler = () => {
		setOpenOccasion((prev) => !prev);
		setOpenType(false);
		setOpenSize(false);
	};

	const sizeStateChangeHandler = () => {
		setOpenSize((prev) => !prev);
		setOpenType(false);
		setOpenOccasion(false);
	};

	const disableAllStateHandler = () => {
		setOpenType(false);
		setOpenOccasion(false);
		setOpenSize(false);
	};

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
				sizeStateChangeHandler();
			} catch (err: any) {
				console.log('ERROR, productOccasionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const productSizeSelectHandler = useCallback(
		async (value: any) => {
			try {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						sizeList: [value],
					},
				});
				disableAllStateHandler();
			} catch (err: any) {
				console.log('ERROR, productSizeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.occasionList?.length == 0) {
				delete searchFilter.search.occasionList;
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
				<h2 className={'search-title'}>{t('Find your perfect Florea flowers & gifts')}</h2>
				<Stack className={'search-box'}>
					<Stack className={'select-box'}>
						<Box component={'div'} className={`box ${openType ? 'on' : ''}`} onClick={typeStateChangeHandler}>
							<span>
								{searchFilter?.search?.typeList ? formatLabel(searchFilter?.search?.typeList[0]) : t('Category')}
							</span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openOccasion ? 'on' : ''}`} onClick={occasionStateChangeHandler}>
							<span>
								{searchFilter?.search?.occasionList
									? formatLabel(searchFilter?.search?.occasionList[0])
									: t('Occasion')}
							</span>
							<ExpandMoreIcon />
						</Box>
						<Box className={`box ${openSize ? 'on' : ''}`} onClick={sizeStateChangeHandler}>
							<span>{searchFilter?.search?.sizeList ? formatLabel(searchFilter?.search?.sizeList[0]) : t('Size')}</span>
							<ExpandMoreIcon />
						</Box>
					</Stack>
					<Stack className={'search-box-other'}>
						<Box className={'search-btn'} onClick={pushSearchHandler}>
							<img src="/img/icons/search_white.svg" alt="" />
						</Box>
					</Stack>

					{/*MENU */}
					<div className={`filter-options ${openType ? 'on' : ''}`} ref={typeRef}>
						{productType.map((type: string) => {
							return (
								<span onClick={() => productTypeSelectHandler(type)} key={type}>
									{formatLabel(type)}
								</span>
							);
						})}
					</div>

					<div className={`filter-options ${openOccasion ? 'on' : ''}`} ref={occasionRef}>
						{productOccasion.map((occasion: string) => {
							return (
								<span onClick={() => productOccasionSelectHandler(occasion)} key={occasion}>
									{formatLabel(occasion)}
								</span>
							);
						})}
					</div>

					<div className={`filter-options ${openSize ? 'on' : ''}`} ref={sizeRef}>
						{productSize.map((size: string) => {
							return (
								<span onClick={() => productSizeSelectHandler(size)} key={size}>
									{formatLabel(size)}
								</span>
							);
						})}
					</div>
				</Stack>
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
