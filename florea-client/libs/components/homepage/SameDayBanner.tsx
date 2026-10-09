import React from 'react';
import Link from 'next/link';

/** the product list page reads its filters from this query string; "options" is its same-day / gift-wrap filter **/
const optionHref = (option: 'productSameDay' | 'productGiftWrap') => ({
	pathname: '/product',
	query: {
		input: JSON.stringify({
			page: 1,
			limit: 9,
			search: { pricesRange: { start: 0, end: 2000000 }, options: [option] },
		}),
	},
});

const SameDayBanner = () => {
	return (
		<section className={'home-section home-sameday'}>
			<div className={'home-shell'}>
				<div className={'sameday-banner'}>
					<div className={'sameday-copy'}>
						<span className={'sameday-kicker'}>Same-day delivery</span>
						<h2 className={'sameday-title'}>Forgot the date? Send something today.</h2>
						<p className={'sameday-text'}>
							Florists mark the bouquets and gifts they can deliver the same day. Many can add gift wrap too.
						</p>
						<div className={'sameday-actions'}>
							<Link className={'home-btn primary'} href={optionHref('productSameDay')}>
								Shop same-day delivery
							</Link>
							<Link className={'home-btn'} href={optionHref('productGiftWrap')}>
								See gift-wrapped items
							</Link>
						</div>
					</div>
					<div className={'sameday-photo'} style={{ backgroundImage: 'url(/img/home/sameday.jpg)' }} />
				</div>
			</div>
		</section>
	);
};

export default SameDayBanner;
