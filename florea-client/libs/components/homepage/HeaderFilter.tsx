import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { AnimatePresence, MotionConfig, motion, Variants } from 'framer-motion';

interface HeaderFilterProps {
	initialInput: ProductsInquiry;
}

/** BOUQUET -> bouquet, FLOWER_BOX -> flower box (capitalized in CSS) **/
const formatLabel = (value: string): string => value.replace(/_/g, ' ').toLowerCase();

/** MOTION **/
// same curve as $logo-ease in scss/variables.scss, so the search box moves like the logo
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const revealVariants: Variants = {
	hidden: { opacity: 0, y: 14 },
	visible: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: EASE, delay },
	}),
};

const panelVariants: Variants = {
	hidden: { opacity: 0, y: -8, scale: 0.985 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { duration: 0.28, ease: EASE, staggerChildren: 0.03, delayChildren: 0.04 },
	},
	exit: { opacity: 0, y: -6, scale: 0.99, transition: { duration: 0.18, ease: EASE } },
};

const optionVariants: Variants = {
	hidden: { opacity: 0, y: 6 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } },
	exit: { opacity: 0 },
};

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(initialInput);
	const selectRef: any = useRef();
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
			// the filter buttons open and close their own menus
			if (selectRef?.current?.contains(event.target)) return;

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

	/** VIEW DATA **/
	const selectedType = searchFilter?.search?.typeList?.[0];
	const selectedOccasion = searchFilter?.search?.occasionList?.[0];
	const selectedSize = searchFilter?.search?.sizeList?.[0];

	const filters = [
		{
			key: 'type',
			open: openType,
			selected: selectedType,
			placeholder: t('Category'),
			toggle: typeStateChangeHandler,
		},
		{
			key: 'occasion',
			open: openOccasion,
			selected: selectedOccasion,
			placeholder: t('Occasion'),
			toggle: occasionStateChangeHandler,
		},
		{
			key: 'size',
			open: openSize,
			selected: selectedSize,
			placeholder: t('Size'),
			toggle: sizeStateChangeHandler,
		},
	];

	const menus = [
		{ key: 'type', open: openType, ref: typeRef, options: productType, selected: selectedType, select: productTypeSelectHandler },
		{
			key: 'occasion',
			open: openOccasion,
			ref: occasionRef,
			options: productOccasion,
			selected: selectedOccasion,
			select: productOccasionSelectHandler,
		},
		{ key: 'size', open: openSize, ref: sizeRef, options: productSize, selected: selectedSize, select: productSizeSelectHandler },
	];

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			// reducedMotion="user": people who ask for less motion get fades only, no movement
			<MotionConfig reducedMotion="user">
				<motion.h2 className={'search-title'} variants={revealVariants} initial="hidden" animate="visible" custom={0}>
					{t('Find your perfect Florea flowers & gifts')}
				</motion.h2>
				<motion.div
					className={'search-box'}
					variants={revealVariants}
					initial="hidden"
					animate="visible"
					custom={0.12}
				>
					<Stack className={'select-box'} ref={selectRef}>
						{filters.map((filter) => (
							<motion.div
								className={`box ${filter.open ? 'on' : ''} ${filter.selected ? 'selected' : ''}`}
								onClick={filter.toggle}
								whileHover={{ y: -1 }}
								whileTap={{ scale: 0.985 }}
								transition={{ duration: 0.24, ease: EASE }}
								key={filter.key}
							>
								<span>{filter.selected ? formatLabel(filter.selected) : filter.placeholder}</span>
								<motion.i
									className={'chevron'}
									animate={{ rotate: filter.open ? 180 : 0 }}
									transition={{ duration: 0.32, ease: EASE }}
								>
									<ExpandMoreIcon />
								</motion.i>
							</motion.div>
						))}
					</Stack>
					<Stack className={'search-box-other'}>
						<motion.div
							className={'search-btn'}
							onClick={pushSearchHandler}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.96 }}
							transition={{ duration: 0.24, ease: EASE }}
						>
							<img src="/img/icons/search_white.svg" alt="" />
						</motion.div>
					</Stack>

					{/*MENU */}
					<AnimatePresence>
						{menus.map(
							(menu) =>
								menu.open && (
									<motion.div
										className={'filter-options on'}
										ref={menu.ref}
										variants={panelVariants}
										initial="hidden"
										animate="visible"
										exit="exit"
										key={menu.key}
									>
										{menu.options.map((option: string) => (
											<motion.span
												className={menu.selected === option ? 'active' : ''}
												onClick={() => menu.select(option)}
												variants={optionVariants}
												key={option}
											>
												{formatLabel(option)}
											</motion.span>
										))}
									</motion.div>
								),
						)}
					</AnimatePresence>
				</motion.div>
			</MotionConfig>
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
