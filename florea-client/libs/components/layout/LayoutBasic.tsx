import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '/img/home/hero.jpg';

			switch (router.pathname) {
				case '/product':
					title = 'Flowers and gifts';
					desc = 'Filter by category, occasion, size and delivery.';
					break;
				case '/agent':
					title = 'Florists';
					desc = 'The florists and gift shops on Florea.';
					break;
				case '/agent/detail':
					title = 'Florist';
					desc = 'Their products, reviews and contact details.';
					break;
				case '/mypage':
					title = 'My page';
					desc = 'Your products, favourites and profile.';
					break;
				case '/community':
					title = 'Community';
					desc = 'News and conversations from Florea members.';
					break;
				case '/community/detail':
					title = 'Community';
					desc = 'News and conversations from Florea members.';
					break;
				case '/cs':
					title = 'Customer care';
					desc = 'Notices and answers to common questions.';
					break;
				case '/account/join':
					title = 'Welcome to Florea';
					desc = 'Log in or create an account.';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member';
					desc = 'Their products, followers and articles.';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Florea</title>
						<meta name={'title'} content={`Florea`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Florea</title>
						<meta name={'title'} content={`Florea`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
