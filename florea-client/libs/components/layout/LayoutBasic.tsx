import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import HelpHub from '../help/HelpHub';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/** the page headers: the address of a page and the key of its header under page.header in common.json **/
const PAGE_HEADERS: Record<string, string> = {
	'/product': 'product',
	'/agent': 'florists',
	'/agent/detail': 'florist',
	'/mypage': 'myPage',
	'/community': 'community',
	'/community/detail': 'community',
	'/cs': 'help',
	'/account/join': 'join',
	'/about': 'about',
	'/cart': 'cart',
	'/checkout': 'checkout',
	'/order/complete': 'orderPlaced',
	'/member': 'member',
};

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const [authHeader, setAuthHeader] = useState<boolean>(false);

		// the header of each page: title and one line under it, from common.json (page.header)
		const headerKey = PAGE_HEADERS[router.pathname];
		const memoizedValues = useMemo(
			() => ({
				title: headerKey ? t(`page.header.${headerKey}.title`) : '',
				desc: headerKey ? t(`page.header.${headerKey}.desc`) : '',
				bgImage: '/img/home/hero.jpg',
			}),
			[headerKey, t],
		);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		useEffect(() => {
			setAuthHeader(router.pathname === '/account/join');
		}, [router.pathname]);

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

					<HelpHub />

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutBasic;
