import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import HomeTabs, { HomeTab } from './HomeTabs';
import { ProductOccasion, ProductType } from '../../enums/product.enum';
import { productPriceCeiling } from '../../config';

interface ShopTile {
	key: string;
	/** the key of the label in the locale files **/
	label: string;
	image: string;
	/** the part of the product search this tile sets **/
	search: { occasionList: ProductOccasion[] } | { typeList: ProductType[] };
}

// photos are in public/img/home (credits in public/img/home/CREDITS.md); each is used once on the homepage
const occasions: ShopTile[] = [
	{ key: ProductOccasion.BIRTHDAY, label: 'common:enum.productOccasion.BIRTHDAY', image: '/img/home/occ-birthday.jpg', search: { occasionList: [ProductOccasion.BIRTHDAY] } },
	{ key: ProductOccasion.WEDDING, label: 'common:enum.productOccasion.WEDDING', image: '/img/home/occ-wedding.jpg', search: { occasionList: [ProductOccasion.WEDDING] } },
	{ key: ProductOccasion.ANNIVERSARY, label: 'common:enum.productOccasion.ANNIVERSARY', image: '/img/home/occ-anniversary.jpg', search: { occasionList: [ProductOccasion.ANNIVERSARY] } },
	{ key: ProductOccasion.LOVE, label: 'common:enum.productOccasion.LOVE', image: '/img/home/occ-love.jpg', search: { occasionList: [ProductOccasion.LOVE] } },
	{ key: ProductOccasion.CONGRATS, label: 'common:enum.productOccasion.CONGRATS', image: '/img/home/occ-congrats.jpg', search: { occasionList: [ProductOccasion.CONGRATS] } },
	{ key: ProductOccasion.SYMPATHY, label: 'common:enum.productOccasion.SYMPATHY', image: '/img/home/occ-sympathy.jpg', search: { occasionList: [ProductOccasion.SYMPATHY] } },
];

const categories: ShopTile[] = [
	{ key: ProductType.BOUQUET, label: 'shopBy.category.BOUQUET', image: '/img/home/cat-bouquet.jpg', search: { typeList: [ProductType.BOUQUET] } },
	{ key: ProductType.FLOWER_BOX, label: 'shopBy.category.FLOWER_BOX', image: '/img/home/cat-flower-box.jpg', search: { typeList: [ProductType.FLOWER_BOX] } },
	{ key: ProductType.PLANT, label: 'shopBy.category.PLANT', image: '/img/home/cat-plant.jpg', search: { typeList: [ProductType.PLANT] } },
	{ key: ProductType.GIFT_BOX, label: 'shopBy.category.GIFT_BOX', image: '/img/home/cat-gift-box.jpg', search: { typeList: [ProductType.GIFT_BOX] } },
	{ key: ProductType.SWEET, label: 'shopBy.category.SWEET', image: '/img/home/cat-sweet.jpg', search: { typeList: [ProductType.SWEET] } },
	{ key: ProductType.TOY, label: 'shopBy.category.TOY', image: '/img/home/cat-toy.jpg', search: { typeList: [ProductType.TOY] } },
];

const TABS: HomeTab[] = [
	{ key: 'occasion', label: 'shopBy.tab.occasion' },
	{ key: 'category', label: 'shopBy.tab.category' },
];

/** the product list page reads its filters from this query string (same shape the search box sends) **/
const tileHref = (tile: ShopTile) => ({
	pathname: '/product',
	query: {
		input: JSON.stringify({
			page: 1,
			limit: 9,
			search: { pricesRange: { start: 0, end: productPriceCeiling }, ...tile.search },
		}),
	},
});

// "Shop by" on the homepage: the occasion tiles and the category tiles behind two tabs.
const ShopBy = () => {
	const { t } = useTranslation('home');
	const [active, setActive] = useState<string>('occasion');
	const tiles = active === 'occasion' ? occasions : categories;

	return (
		<section className={'home-section home-shopby'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={t('shopBy.shopBy')}
					subtitle={t('shopBy.startFromTheMomentYou')}
					seeAll={{ href: '/product', label: t('shopBy.seeAllProducts') }}
				/>
				<HomeTabs name={'shopby'} label={t('shopBy.shopBy')} tabs={TABS.map((tab) => ({ ...tab, label: t(tab.label) }))} active={active} onChange={setActive} />
				<ul
					className={'category-grid home-panel'}
					role={'tabpanel'}
					id={`shopby-panel-${active}`}
					aria-labelledby={`shopby-tab-${active}`}
					key={active}
				>
					{tiles.map((tile) => (
						<li key={tile.key}>
							<Link className={'category-tile'} href={tileHref(tile)}>
								<span className={'tile-photo'} style={{ backgroundImage: `url(${tile.image})` }} />
								<span className={'tile-label'}>{t(tile.label)}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default ShopBy;
