import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import HomeHero from '../homepage/HomeHero';
import { getJwtToken, updateUserInfo } from '../../auth';
import HelpHub from '../help/HelpHub';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const { t } = useTranslation('common');

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		return (
			<>
				<Head>
					<title>Florea</title>
					<meta name={'title'} content={`Florea`} />
					<meta name={'description'} content={t('page.metaDescription')} />
					<meta name={'keywords'} content={t('page.metaKeywords')} />
				</Head>
				<Stack id="pc-wrap">
					<Stack id={'top'}>
						<Top />
					</Stack>

					<HomeHero />

					<Stack id={'main'}>
						<Component {...props} />
					</Stack>

					<HelpHub />

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutMain;
