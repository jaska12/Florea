import { useTranslation } from 'next-i18next';
import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { pageTranslations } from '../../libs/i18n/server';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await pageTranslations(locale, ['cs'])),
	},
});

const About: NextPage = () => {
	const { t } = useTranslation('cs');
	return (
		<Stack className={'about-page'}>
			<Stack className={'intro'}>
				<Stack className={'container'}>
					<Stack className={'left'}>
						<strong>{t('about.flowersAndGiftsFromThe')}</strong>
					</Stack>
					<Stack className={'right'}>
						<p>
							{t('about.floreaBringsLocalFloristsAnd')}
							<br />
							<br />
							{t('about.chooseByOccasionSizeAnd')}
						</p>
						<Stack className={'boxes'}>
							<div className={'box'}>
								<div>
									<img src="/img/icons/garden.svg" alt="" />
								</div>
								<span>{t('about.madeByLocalFlorists')}</span>
								<p>{t('about.eachProductShowsTheShop')}</p>
							</div>
							<div className={'box'}>
								<div>
									<img src="/img/icons/securePayment.svg" alt="" />
								</div>
								<span>{t('about.chosenByOccasion')}</span>
								<p>{t('about.birthdayWeddingAnniversaryAndMore')}</p>
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
							<p>{t('about.categories')}</p>
						</Box>
						<Box component={'div'}>
							<strong>6</strong>
							<p>{t('about.occasions')}</p>
						</Box>
						<Box component={'div'}>
							<strong>3</strong>
							<p>{t('about.sizes')}</p>
						</Box>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'options'}>
				<img src="/img/home/occ-anniversary.jpg" alt="" className={'about-banner'} />
				<Stack className={'container'}>
					<strong>{t('about.forFloristsAndGiftShops')}</strong>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/security.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>{t('about.listYourProducts')}</span>
							<p>{t('about.addBouquetsPlantsAndGift')}</p>
						</div>
					</Stack>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/keywording.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>{t('about.receiveOrders')}</span>
							<p>{t('about.buyersFindYouByCategory')}</p>
						</div>
					</Stack>
					<Stack className={'box'}>
						<div className={'icon-box'}>
							<img src="/img/icons/investment.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>{t('about.buildYourFollowing')}</span>
							<p>{t('about.customersCanFollowYourShop')}</p>
						</div>
					</Stack>
					<Link href={'/account/join'} className={'btn'}>
						{t('about.openYourShop')}
						<img src="/img/icons/rightup.svg" alt="" />
					</Link>
				</Stack>
			</Stack>
			<Stack className={'help'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'left'}>
						<strong>{t('about.needHelpChoosing')}</strong>
						<p>{t('about.askAFloristOnTheir')}</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<Link href={'/cs'} className={'white'}>
							{t('about.customerCare')}
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
