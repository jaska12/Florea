import { useTranslation } from 'next-i18next';
import React from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
const TuiEditor = dynamic(() => import('../community/Teditor'), { ssr: false });

const WriteArticle: NextPage = () => {
	const { t } = useTranslation('mypage');

	return (
		<div id="write-article-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">{t('articles.writeAnArticle')}</Typography>
					<Typography className="sub-title">{t('articles.feelFreeToWriteYour')}</Typography>
				</Stack>
			</Stack>
			<TuiEditor />
		</div>
	);
};

export default WriteArticle;
