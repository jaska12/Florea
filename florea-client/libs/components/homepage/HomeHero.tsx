import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { MotionConfig, motion, Variants } from 'framer-motion';
import HeaderFilter from './HeaderFilter';
import { ProductOccasion } from '../../enums/product.enum';

// same curve as $logo-ease in scss/variables.scss
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// the one orchestrated moment on the page: headline, text, search and shortcuts arrive in order
const riseVariants: Variants = {
	hidden: { opacity: 0, y: 18 },
	visible: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: EASE, delay },
	}),
};

const occasionShortcuts: ProductOccasion[] = [
	ProductOccasion.BIRTHDAY,
	ProductOccasion.WEDDING,
	ProductOccasion.ANNIVERSARY,
	ProductOccasion.LOVE,
];

/** the product list page reads its filters from this query string (same shape the search box sends) **/
const occasionHref = (occasion: ProductOccasion) => ({
	pathname: '/product',
	query: {
		input: JSON.stringify({
			page: 1,
			limit: 9,
			search: { pricesRange: { start: 0, end: 2000000 }, occasionList: [occasion] },
		}),
	},
});

const HomeHero = () => {
	const { t } = useTranslation('common');

	return (
		<section className={'home-hero'}>
			<div className={'home-shell'}>
				<MotionConfig reducedMotion="user">
					<div className={'hero-copy'}>
						<motion.h1 className={'hero-title'} variants={riseVariants} initial="hidden" animate="visible" custom={0}>
							{t('Find your perfect Florea flowers & gifts')}
						</motion.h1>
						<motion.p className={'hero-sub'} variants={riseVariants} initial="hidden" animate="visible" custom={0.1}>
							{t('Fresh bouquets, plants and curated gift boxes from local florists and gift shops. Choose by occasion and send them to someone you love.')}
						</motion.p>
					</div>
					<div className={'hero-search'}>
						<HeaderFilter />
					</div>
					<motion.nav
						className={'hero-shortcuts'}
						aria-label={'Popular occasions'}
						variants={riseVariants}
						initial="hidden"
						animate="visible"
						custom={0.34}
					>
						<span className={'shortcuts-label'}>{t('Popular occasions')}</span>
						{occasionShortcuts.map((occasion) => (
							<Link className={'shortcut'} href={occasionHref(occasion)} key={occasion}>
								{occasion.toLowerCase()}
							</Link>
						))}
					</motion.nav>
				</MotionConfig>
			</div>
		</section>
	);
};

export default HomeHero;
