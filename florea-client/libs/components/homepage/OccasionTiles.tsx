import React from 'react';
import Link from 'next/link';
import SectionHeader from './SectionHeader';
import { ProductOccasion } from '../../enums/product.enum';

interface OccasionTile {
	occasion: ProductOccasion;
	label: string;
	image: string;
}

// photos are in public/img/home (credits in public/img/home/CREDITS.md)
const occasions: OccasionTile[] = [
	{ occasion: ProductOccasion.BIRTHDAY, label: 'Birthday', image: '/img/home/occ-birthday.jpg' },
	{ occasion: ProductOccasion.WEDDING, label: 'Wedding', image: '/img/home/occ-wedding.jpg' },
	{ occasion: ProductOccasion.ANNIVERSARY, label: 'Anniversary', image: '/img/home/occ-anniversary.jpg' },
	{ occasion: ProductOccasion.LOVE, label: 'Love', image: '/img/home/occ-love.jpg' },
	{ occasion: ProductOccasion.CONGRATS, label: 'Congrats', image: '/img/home/occ-congrats.jpg' },
	{ occasion: ProductOccasion.SYMPATHY, label: 'Sympathy', image: '/img/home/occ-sympathy.jpg' },
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

const OccasionTiles = () => {
	return (
		<section className={'home-section home-occasions'}>
			<div className={'home-shell'}>
				<SectionHeader title={'Shop by occasion'} subtitle={'Start from the moment you are marking.'}>
					<Link className={'text-link'} href={'/product'}>
						All products
					</Link>
				</SectionHeader>
				<ul className={'category-grid'}>
					{occasions.map((item) => (
						<li key={item.occasion}>
							<Link className={'category-tile'} href={occasionHref(item.occasion)}>
								<span className={'tile-photo'} style={{ backgroundImage: `url(${item.image})` }} />
								<span className={'tile-label'}>{item.label}</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default OccasionTiles;
