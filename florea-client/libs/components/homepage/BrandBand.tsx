import React from 'react';
import Link from 'next/link';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';

// Each point describes something the site already does, not a promise about service.
const points = [
	{
		icon: <LocalFloristOutlinedIcon />,
		title: 'Six kinds of gifts',
		text: 'Bouquets, flower boxes, plants, gift boxes, sweets and toys, all in one place.',
	},
	{
		icon: <CelebrationOutlinedIcon />,
		title: 'Chosen for the occasion',
		text: 'Filter by birthday, wedding, anniversary, love, congratulations or sympathy.',
	},
	{
		icon: <StorefrontOutlinedIcon />,
		title: 'Sellers you can get to know',
		text: 'Open an agent’s page to see their products, follow them and leave a comment.',
	},
];

const BrandBand = () => {
	return (
		<section className={'home-band'}>
			<div className={'home-shell'}>
				<div className={'band-intro'}>
					<h2 className={'band-title'}>A calmer way to choose a gift</h2>
					<div className={'band-actions'}>
						<Link className={'band-btn primary'} href={'/product'}>
							Browse all products
						</Link>
						<Link className={'band-btn'} href={'/agent'}>
							Meet the agents
						</Link>
					</div>
				</div>
				<ul className={'band-points'}>
					{points.map((point) => (
						<li className={'band-point'} key={point.title}>
							<span className={'point-icon'}>{point.icon}</span>
							<h3 className={'point-title'}>{point.title}</h3>
							<p className={'point-text'}>{point.text}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};

export default BrandBand;
