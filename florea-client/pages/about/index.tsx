import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const About: NextPage = () => {
	return (
		<Stack className={'about-page'}>
			<Stack className={'intro'}>
				<Stack className={'container'}>
					<Stack className={'left'}>
						<strong>Flowers and gifts from the florists near you.</strong>
					</Stack>
					<Stack className={'right'}>
						<p>
							Florea brings local florists and gift shops into one place, so a bouquet for a birthday, a plant for a
							new home or a gift box for an anniversary is a few minutes away.
							<br />
							<br />
							Choose by occasion, size and budget, see who made it, and send it to someone you love. Many items can
							be delivered the same day, and many can be gift wrapped.
						</p>
						<Stack className={'boxes'}>
							<div className={'box'}>
								<div>
									<img src="/img/icons/garden.svg" alt="" />
								</div>
								<span>Made by local florists</span>
								<p>Each product shows the shop behind it.</p>
							</div>
							<div className={'box'}>
								<div>
									<img src="/img/icons/securePayment.svg" alt="" />
								</div>
								<span>Chosen by occasion</span>
								<p>Birthday, wedding, anniversary and more.</p>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'statistics'}>
				<Stack className={'container'}>
					<Stack className={'banner'}>
						<img src="/img/home/hero.jpg" alt="" />
					</Stack>
					<Stack className={'info'}>
						<Box component={'div'}>
							<strong>6</strong>
							<p>Categories</p>
						</Box>
						<Box component={'div'}>
							<strong>6</strong>
							<p>Occasions</p>
						</Box>
						<Box component={'div'}>
							<strong>3</strong>
							<p>Sizes</p>
						</Box>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'options'}>
				<img src="/img/home/occ-anniversary.jpg" alt="" className={'about-banner'} />
				<Stack className={'container'}>
					<strong>For florists and gift shops</strong>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/security.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>List your products</span>
							<p>Add bouquets, plants and gift boxes with photos, price, size and stock.</p>
						</div>
					</Stack>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/keywording.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Receive orders</span>
							<p>Buyers find you by category, occasion and location, and order for delivery.</p>
						</div>
					</Stack>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/investment.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Build your following</span>
							<p>Customers can follow your shop, like your products and leave reviews.</p>
						</div>
					</Stack>
					<Link href={'/account/join'} className={'btn'}>
						Open your shop
						<img src="/img/icons/rightup.svg" alt="" />
					</Link>
				</Stack>
			</Stack>
			<Stack className={'help'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'left'}>
						<strong>Need help choosing?</strong>
						<p>Ask a florist on their page, or read the answers in customer care.</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<Link href={'/cs'} className={'white'}>
							Customer care
							<img src="/img/icons/rightup.svg" alt="" />
						</Link>
						<div className={'black'}>
							<img src="/img/icons/call.svg" alt="" />
							+82 10 4867 2909
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(About);
