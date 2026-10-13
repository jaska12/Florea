import { useTranslation } from 'next-i18next';
import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { pageTranslations } from '../../libs/i18n/server';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await pageTranslations(locale, ['cs'])),
	},
});

const CS: NextPage = () => {
	const { t } = useTranslation('cs');
	const router = useRouter();

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				<Box component={'div'} className={'cs-main-info'}>
					<Box component={'div'} className={'info'}>
						<span>{t('page.customerCare')}</span>
						<p>{t('page.noticesAndAnswersToCommon')}</p>
					</Box>
					<Box component={'div'} className={'btns'}>
						<div
							className={tab == 'notice' ? 'active' : ''}
							onClick={() => {
								changeTabHandler('notice');
							}}
						>
							{t('page.notice')}
						</div>
						<div
							className={tab == 'faq' ? 'active' : ''}
							onClick={() => {
								changeTabHandler('faq');
							}}
						>
							{t('page.faq')}
						</div>
					</Box>
				</Box>

				<Box component={'div'} className={'cs-content'}>
					{tab === 'notice' && <Notice />}

					{tab === 'faq' && <Faq />}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);
