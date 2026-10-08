import React from 'react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { ProductType } from '../../enums/product.enum';

interface CategoryTile {
	type: ProductType;
	label: string;
	image: string;
}

// photos are in public/img/home (credits in public/img/home/CREDITS.md)
const categories: CategoryTile[] = [
	{ type: ProductType.BOUQUET, label: 'Bouquets', image: '/img/home/cat-bouquet.jpg' },
	{ type: ProductType.FLOWER_BOX, label: 'Flower boxes', image: '/img/home/cat-flower-box.jpg' },
	{ type: ProductType.PLANT, label: 'Plants', image: '/img/home/cat-plant.jpg' },
	{ type: ProductType.GIFT_BOX, label: 'Gift boxes', image: '/img/home/cat-gift-box.jpg' },
	{ type: ProductType.SWEET, label: 'Sweets', image: '/img/home/cat-sweet.jpg' },
	{ type: ProductType.TOY, label: 'Toys', image: '/img/home/cat-toy.jpg' },
];

/** the product list page reads its filters from this query string (same shape the search box sends) **/
const categoryHref = (type: ProductType) => ({
	pathname: '/product',
	query: {
		input: JSON.stringify({
			page: 1,
			limit: 9,
			search: { pricesRange: { start: 0, end: 2000000 }, typeList: [type] },
		}),
	},
});

const CategoryTiles = () => {
	return (
		<section className={'home-section home-categories'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Shop by category'} subtitle={'Six kinds of gifts, each with its own page of products.'}>
					<Link className={'text-link'} href={'/product'}>
						All products
					</Link>
				</SectionHeader>
				<ul className={'category-grid'}>
					{categories.map((category) => (
						<li key={category.type}>
							<Link className={'category-tile'} href={categoryHref(category.type)}>
								<span className={'tile-photo'} style={{ backgroundImage: `url(${category.image})` }} />
								<span className={'tile-label'}>{category.label}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default CategoryTiles;
