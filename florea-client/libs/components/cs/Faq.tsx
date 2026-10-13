import { useTranslation } from 'next-i18next';
import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { GET_NOTICES } from '../../../apollo/user/query';
import { Notice } from '../../types/notice/notice';
import { NoticesInquiry } from '../../types/notice/notice.input';
import { NoticeCategory, NoticeTopic, noticeTopicLabels } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

// every active FAQ entry in one request, oldest first: the page groups them by topic
const inquiry: NoticesInquiry = {
	page: 1,
	limit: 300,
	direction: Direction.ASC,
	search: { noticeCategory: NoticeCategory.FAQ },
};
const TOPICS = Object.keys(noticeTopicLabels) as NoticeTopic[];

const Faq = () => {
	const { t } = useTranslation('cs');
	const [topic, setTopic] = useState<NoticeTopic>(NoticeTopic.PRODUCT);
	const [expanded, setExpanded] = useState<string | false>(false);

	/** APOLLO REQUESTS **/
	const { loading: getNoticesLoading, data: getNoticesData } = useQuery(GET_NOTICES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: inquiry },
	});

	const entries: Notice[] = (getNoticesData?.getNotices?.list ?? []).filter((entry: Notice) => entry.noticeTopic === topic);

	/** HANDLERS **/
	const changeTopicHandler = (value: NoticeTopic) => {
		setTopic(value);
		setExpanded(false);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<Stack className={'faq-content'}>
			<Box className={'categories'} component={'div'}>
				{TOPICS.map((value: NoticeTopic) => (
					<div className={topic === value ? 'active' : ''} onClick={() => changeTopicHandler(value)} key={value}>
						{noticeTopicLabels[value]}
					</div>
				))}
			</Box>
			<Box className={'wrap'} component={'div'}>
				{entries.map((entry: Notice) => (
					<Accordion expanded={expanded === entry._id} onChange={handleChange(entry._id)} key={entry._id}>
						<AccordionSummary id={`faq-${entry._id}-header`} className="question" aria-controls={`faq-${entry._id}-content`}>
							<Typography className="badge" variant={'h4'}>
								Q
							</Typography>
							<Typography> {entry.noticeTitle}</Typography>
						</AccordionSummary>
						<AccordionDetails id={`faq-${entry._id}-content`}>
							<Stack className={'answer flex-box'}>
								<Typography className="badge" variant={'h4'} color={'primary'}>
									A
								</Typography>
								<Typography> {entry.noticeContent}</Typography>
							</Stack>
						</AccordionDetails>
					</Accordion>
				))}
				{entries.length === 0 && !getNoticesLoading && (
					<div className={'no-data'}>
						<img src="/img/icons/icoAlert.svg" alt="" />
						<p>{t('faq.noQuestionsInThisGroup')}</p>
					</div>
				)}
			</Box>
		</Stack>
	);
};

export default Faq;
