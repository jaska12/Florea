import React from 'react';
import Link from 'next/link';
import { MotionConfig, motion, Variants } from 'framer-motion';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { productPriceCeiling } from '../../config';

/** the product list page reads its filters from this query string; "options" is its same-day / gift-wrap filter **/
const optionHref = (option: 'productSameDay' | 'productGiftWrap') => ({
	pathname: '/product',
	query: {
		input: JSON.stringify({
			page: 1,
			limit: 9,
			search: { pricesRange: { start: 0, end: productPriceCeiling }, options: [option] },
		}),
	},
});

// a short rise as the block scrolls into view; with reduced motion only the fade is left
const riseVariants: Variants = {
	hidden: { opacity: 0, y: 22 },
	visible: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
	}),
};
const inView = { once: true, amount: 0.25 };

const PHOTOS = [
	{ src: '/img/home/sameday-bouquet.jpg', alt: 'A pink bouquet in a vase', size: 'large' },
	{ src: '/img/home/sameday-roses.jpg', alt: 'Soft pink roses', size: 'small' },
	{ src: '/img/home/sameday-gift.jpg', alt: 'A pink gift box with a gold ribbon', size: 'small' },
];

const STEPS = [
	{
		icon: <LocalFloristOutlinedIcon />,
		title: 'Choose a bouquet or gift',
		text: 'Browse by occasion, size and price, and add what you like to the cart.',
	},
	{
		icon: <EditNoteOutlinedIcon />,
		title: 'Add a card message and address',
		text: 'Tell us who receives it, where and when. A few words for the card are welcome.',
	},
	{
		icon: <LocalShippingOutlinedIcon />,
		title: 'Delivered with care',
		text: 'The florist prepares it and brings it to the door. You pay in cash on delivery.',
	},
];

// The same-day delivery section of the homepage: a collage with the offer, then how ordering works.
const SameDayFeature = () => {
	/** HANDLERS **/
	const stepsHandler = () => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document.getElementById('how-florea-works')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
	};

	return (
		<section className={'home-section home-sameday'}>
			<div className={'home-shell'}>
				<MotionConfig reducedMotion="user">
					<div className={'sameday-feature'}>
						<motion.div
							className={'sameday-copy'}
							variants={riseVariants}
							initial="hidden"
							whileInView="visible"
							viewport={inView}
						>
							<span className={'sameday-kicker'}>Fresh today</span>
							<h2 className={'sameday-title'}>Flowers &amp; gifts, delivered the same day</h2>
							<p className={'sameday-text'}>
								Florists mark the bouquets and gifts they can deliver today. Many can{' '}
								<Link className={'text-link'} href={optionHref('productGiftWrap')}>
									add gift wrap
								</Link>{' '}
								too.
							</p>
							<div className={'sameday-actions'}>
								<Link className={'home-btn primary'} href={optionHref('productSameDay')}>
									Shop now
								</Link>
								<button type={'button'} className={'home-btn'} onClick={stepsHandler}>
									How it works
								</button>
							</div>
						</motion.div>

						<motion.div
							className={'sameday-bento'}
							variants={riseVariants}
							initial="hidden"
							whileInView="visible"
							viewport={inView}
							custom={0.12}
						>
							{PHOTOS.map((photo) => (
								<div className={`bento-photo ${photo.size}`} key={photo.src}>
									<img src={photo.src} alt={photo.alt} loading={'lazy'} />
								</div>
							))}
						</motion.div>
					</div>

					<div className={'sameday-steps'} id={'how-florea-works'}>
						<h3 className={'steps-title'}>How Florea works</h3>
						<ol className={'steps-list'}>
							{STEPS.map((step, index) => (
								<motion.li
									className={'step'}
									key={step.title}
									variants={riseVariants}
									initial="hidden"
									whileInView="visible"
									viewport={inView}
									custom={index * 0.1}
								>
									<span className={'step-icon'}>{step.icon}</span>
									<span className={'step-number'}>Step {index + 1}</span>
									<strong>{step.title}</strong>
									<p>{step.text}</p>
								</motion.li>
							))}
						</ol>
					</div>
				</MotionConfig>
			</div>
		</section>
	);
};

export default SameDayFeature;
