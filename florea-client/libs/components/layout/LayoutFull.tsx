import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import GiftAssistant from '../ai/GiftAssistant';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		const { t } = useTranslation('common');
		const router = useRouter();
		const user = useReactiveVar(userVar);

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

					<Stack id={'main'}>
						<Component {...props} />
					</Stack>

					{user?._id && <Chat />}
					<GiftAssistant />

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutFull;
