import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { Stack, Box, Pagination } from '@mui/material';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice as NoticeEntry } from '../../types/notice/notice';
import { NoticesInquiry } from '../../types/notice/notice.input';
import { NoticeCategory } from '../../enums/notice.enum';

const LIMIT = 10;

const Notice = () => {
	const { t } = useTranslation('cs');
	const [page, setPage] = useState<number>(1);
	const inquiry: NoticesInquiry = { page: page, limit: LIMIT, search: { noticeCategory: NoticeCategory.NOTICE } };

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		previousData: getNoticesPrevious,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: inquiry },
	});

	const result = (getNoticesData ?? getNoticesPrevious)?.getNotices;
	const notices: NoticeEntry[] = result?.list ?? [];
	const total: number = result?.metaCounter?.[0]?.total ?? 0;

	return (
		<Stack className={'notice-content'}>
			<span className={'title'}>{t('notice.notice')}</span>
			<Stack className={'main'}>
				<Box component={'div'} className={'top'}>
					<span>{t('notice.number')}</span>
					<span>{t('notice.title')}</span>
					<span>{t('notice.date')}</span>
				</Box>
				<Stack className={'bottom'}>
					{notices.map((notice: NoticeEntry, index: number) => (
						<div className={`notice-card ${notice.noticeEvent ? 'event' : ''}`} key={notice._id}>
							{notice.noticeEvent ? (
								<div>{t('notice.event')}</div>
							) : (
								// the newest notice has the highest number
								<span className={'notice-number'}>{total - (page - 1) * LIMIT - index}</span>
							)}
							<span className={'notice-title'}>
								{notice.noticeTitle}
								<small>{notice.noticeContent}</small>
							</span>
							<span className={'notice-date'}>{moment(notice.createdAt).format('DD.MM.YYYY')}</span>
						</div>
					))}
					{notices.length === 0 && !getNoticesLoading && (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>{t('notice.noNoticesYet')}</p>
						</div>
					)}
				</Stack>
			</Stack>
			{total > LIMIT && (
				<Stack className={'pagination'}>
					<Pagination
						page={page}
						count={Math.ceil(total / LIMIT)}
						onChange={(e: any, value: number) => setPage(value)}
						shape="circular"
						color="primary"
					/>
				</Stack>
			)}
		</Stack>
	);
};

export default Notice;
