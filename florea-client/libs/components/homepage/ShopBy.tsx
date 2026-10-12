import React, { useState } from 'react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import HomeTabs, { HomeTab } from './HomeTabs';
import { ProductOccasion, ProductType } from '../../enums/product.enum';
import { productPriceCeiling } from '../../config';

interface ShopTile {
	key: string;
	label: string;
	image: string;
	/** the part of the product search this tile sets **/
	search: { occasionList: ProductOccasion[] } | { typeList: ProductType[] };
}

// photos are in public/img/home (credits in public/img/home/CREDITS.md); each is used once on the homepage
const occasions: ShopTile[] = [
	{ key: ProductOccasion.BIRTHDAY, label: 'Birthday', image: '/img/home/occ-birthday.jpg', search: { occasionList: [ProductOccasion.BIRTHDAY] } },
	{ key: ProductOccasion.WEDDING, label: 'Wedding', image: '/img/home/occ-wedding.jpg', search: { occasionList: [ProductOccasion.WEDDING] } },
	{ key: ProductOccasion.ANNIVERSARY, label: 'Anniversary', image: '/img/home/occ-anniversary.jpg', search: { occasionList: [ProductOccasion.ANNIVERSARY] } },
	{ key: ProductOccasion.LOVE, label: 'Love', image: '/img/home/occ-love.jpg', search: { occasionList: [ProductOccasion.LOVE] } },
	{ key: ProductOccasion.CONGRATS, label: 'Congrats', image: '/img/home/occ-congrats.jpg', search: { occasionList: [ProductOccasion.CONGRATS] } },
	{ key: ProductOccasion.SYMPATHY, label: 'Sympathy', image: '/img/home/occ-sympathy.jpg', search: { occasionList: [ProductOccasion.SYMPATHY] } },
];

const categories: ShopTile[] = [
	{ key: ProductType.BOUQUET, label: 'Bouquets', image: '/img/home/cat-bouquet.jpg', search: { typeList: [ProductType.BOUQUET] } },
	{ key: ProductType.FLOWER_BOX, label: 'Flower boxes', image: '/img/home/cat-flower-box.jpg', search: { typeList: [ProductType.FLOWER_BOX] } },
	{ key: ProductType.PLANT, label: 'Plants', image: '/img/home/cat-plant.jpg', search: { typeList: [ProductType.PLANT] } },
	{ key: ProductType.GIFT_BOX, label: 'Gift boxes', image: '/img/home/cat-gift-box.jpg', search: { typeList: [ProductType.GIFT_BOX] } },
	{ key: ProductType.SWEET, label: 'Sweets', image: '/img/home/cat-sweet.jpg', search: { typeList: [ProductType.SWEET] } },
	{ key: ProductType.TOY, label: 'Toys', image: '/img/home/cat-toy.jpg', search: { typeList: [ProductType.TOY] } },
];

const TABS: HomeTab[] = [
	{ key: 'occasion', label: 'Occasion' },
	{ key: 'category', label: 'Category' },
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
	const [active, setActive] = useState<string>('occasion');
	const tiles = active === 'occasion' ? occasions : categories;

	return (
		<section className={'home-section home-shopby'}>
			<div className={'home-shell'}>
				<SectionHeader
					title={'Shop by'}
					subtitle={'Start from the moment you are marking, or from what you want to give.'}
					seeAll={{ href: '/product', label: 'See all products' }}
				/>
				<HomeTabs name={'shopby'} label={'Shop by'} tabs={TABS} active={active} onChange={setActive} />
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
								<span className={'tile-label'}>{tile.label}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default ShopBy;
