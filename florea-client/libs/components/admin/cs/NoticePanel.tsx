import { useFormat } from '../../../i18n/format';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	MenuItem,
	OutlinedInput,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_ALL_NOTICES_BY_ADMIN } from '../../../../apollo/admin/query';
import {
	CREATE_NOTICE_BY_ADMIN,
	REMOVE_NOTICE_BY_ADMIN,
	UPDATE_NOTICE_BY_ADMIN,
} from '../../../../apollo/admin/mutation';
import { Notice } from '../../../types/notice/notice';
import { AllNoticesInquiry } from '../../../types/notice/notice.input';
import {
	NoticeCategory,
	NoticeStatus,
	noticeStatusLabels,
	NoticeTopic,
	noticeTopicLabels,
} from '../../../enums/notice.enum';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

interface NoticePanelProps {
	/** the customer-care page has two lists: announcements and the FAQ **/
	category: NoticeCategory.NOTICE | NoticeCategory.FAQ;
}

interface NoticeForm {
	_id?: string;
	noticeTitle: string;
	noticeContent: string;
	noticeTopic: NoticeTopic | '';
	noticeEvent: boolean;
	noticeStatus: NoticeStatus;
}

const TABS: (NoticeStatus | 'ALL')[] = ['ALL', NoticeStatus.ACTIVE, NoticeStatus.HOLD, NoticeStatus.DELETE];
const TOPICS = Object.keys(noticeTopicLabels) as NoticeTopic[];
const STATUSES = Object.keys(noticeStatusLabels) as NoticeStatus[];
const emptyForm: NoticeForm = {
	noticeTitle: '',
	noticeContent: '',
	noticeTopic: '',
	noticeEvent: false,
	noticeStatus: NoticeStatus.ACTIVE,
};

// The admin screen for notices and for the FAQ: list, search, add, edit, change status, remove.
const NoticePanel = (props: NoticePanelProps) => {
	const { t } = useTranslation('admin');
	const format = useFormat();
	const { category } = props;
	const faq = category === NoticeCategory.FAQ;
	const [tab, setTab] = useState<NoticeStatus | 'ALL'>('ALL');
	const [topic, setTopic] = useState<NoticeTopic | 'ALL'>('ALL');
	const [searchText, setSearchText] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [page, setPage] = useState<number>(0);
	const [limit, setLimit] = useState<number>(10);
	const [form, setForm] = useState<NoticeForm | null>(null);
	const [formError, setFormError] = useState<string>('');
	const [saving, setSaving] = useState<boolean>(false);
	const inquiry: AllNoticesInquiry = {
		page: page + 1,
		limit: limit,
		search: {
			noticeCategory: category,
			...(tab === 'ALL' ? {} : { noticeStatus: tab }),
			...(faq && topic !== 'ALL' ? { noticeTopic: topic } : {}),
			...(text ? { text: text } : {}),
		},
	};

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE_BY_ADMIN);
	const [updateNotice] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeNotice] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const { data: getNoticesData, refetch: getNoticesRefetch } = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: inquiry },
		notifyOnNetworkStatusChange: true,
	});

	const notices: Notice[] = getNoticesData?.getAllNoticesByAdmin?.list ?? [];
	const total: number = getNoticesData?.getAllNoticesByAdmin?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/
	const tabChangeHandler = (value: NoticeStatus | 'ALL') => {
		setTab(value);
		setPage(0);
	};

	const searchHandler = (value: string) => {
		setText(value.trim());
		setPage(0);
	};

	const editHandler = (notice: Notice) => {
		setFormError('');
		setForm({
			_id: notice._id,
			noticeTitle: notice.noticeTitle,
			noticeContent: notice.noticeContent,
			noticeTopic: notice.noticeTopic ?? '',
			noticeEvent: notice.noticeEvent,
			noticeStatus: notice.noticeStatus,
		});
	};

	// a message about the form is out of date as soon as the form changes
	const changeForm = (changes: Partial<NoticeForm>) => {
		setFormError('');
		setForm((prev) => (prev ? { ...prev, ...changes } : prev));
	};

	const saveHandler = async () => {
		if (!form || saving) return;
		const noticeTitle = form.noticeTitle.trim();
		const noticeContent = form.noticeContent.trim();

		if (noticeTitle.length < 3) return setFormError(`Write the ${faq ? 'question' : 'title'} (at least 3 characters).`);
		if (noticeContent.length < 3) return setFormError(`Write the ${faq ? 'answer' : 'text'} (at least 3 characters).`);
		if (faq && !form.noticeTopic) return setFormError(t('notices.chooseTheTopicThisQuestion'));

		try {
			setSaving(true);
			const fields = {
				noticeTitle,
				noticeContent,
				noticeStatus: form.noticeStatus,
				...(faq ? { noticeTopic: form.noticeTopic } : { noticeEvent: form.noticeEvent }),
			};
			if (form._id) {
				await updateNotice({ variables: { input: { _id: form._id, ...fields } }, context: { silentError: true } });
			} else {
				await createNotice({ variables: { input: { noticeCategory: category, ...fields } }, context: { silentError: true } });
			}
			setForm(null);
			await getNoticesRefetch({ input: inquiry });
			await sweetTopSmallSuccessAlert(form._id ? t('notices.saved') : t('notices.added'), 1200);
		} catch (err: any) {
			setFormError(err?.graphQLErrors?.[0]?.message ?? t('notices.itCouldNotBeSaved'));
		} finally {
			setSaving(false);
		}
	};

	const statusChangeHandler = async (notice: Notice, noticeStatus: NoticeStatus) => {
		try {
			await updateNotice({ variables: { input: { _id: notice._id, noticeStatus } }, context: { silentError: true } });
			await getNoticesRefetch({ input: inquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeHandler = async (notice: Notice) => {
		try {
			if (!(await sweetConfirmAlert(t('notices.removeThisEntryForGood')))) return;
			await removeNotice({ variables: { input: notice._id }, context: { silentError: true } });
			await getNoticesRefetch({ input: inquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>{faq ? t('notices.faqManagement') : t('notices.noticeManagement')}</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					onClick={() => {
						setFormError('');
						setForm({ ...emptyForm });
					}}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					{t('notices.add')}
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<List className={'tab-menu'}>
						{TABS.map((value) => (
							<ListItem onClick={() => tabChangeHandler(value)} className={tab === value ? 'li on' : 'li'} key={value}>
								{value === 'ALL' ? t('notices.all') : noticeStatusLabels[value]}
							</ListItem>
						))}
					</List>
					<Divider />
					<Stack className={'search-area'} sx={{ m: '24px' }}>
						{faq && (
							<Select
								sx={{ width: '180px', mr: '20px' }}
								value={topic}
								onChange={(e) => {
									setTopic(e.target.value as NoticeTopic | 'ALL');
									setPage(0);
								}}
								inputProps={{ 'aria-label': t('notices.topic') }}
							>
								<MenuItem value={'ALL'}>{t('notices.allTopics')}</MenuItem>
								{TOPICS.map((value) => (
									<MenuItem value={value} key={value}>
										{noticeTopicLabels[value]}
									</MenuItem>
								))}
							</Select>
						)}
						<OutlinedInput
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							sx={{ width: '100%' }}
							className={'search'}
							placeholder={faq ? t('notices.searchInQuestions') : t('notices.searchInTitles')}
							onKeyDown={(event) => {
								if (event.key == 'Enter') searchHandler(searchText);
							}}
							endAdornment={
								<>
									{searchText && (
										<CancelRoundedIcon
											style={{ cursor: 'pointer' }}
											onClick={() => {
												setSearchText('');
												searchHandler('');
											}}
										/>
									)}
									<InputAdornment position="end" onClick={() => searchHandler(searchText)}>
										<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
									</InputAdornment>
								</>
							}
						/>
					</Stack>
					<Divider />
					<TableContainer>
						<Table sx={{ minWidth: 820 }} size={'medium'}>
							<TableHead>
								<TableRow>
									<TableCell>{faq ? t('notices.topic2') : t('notices.mark')}</TableCell>
									<TableCell>{faq ? t('notices.question') : t('notices.title')}</TableCell>
									<TableCell>{t('notices.writer')}</TableCell>
									<TableCell>{t('notices.date')}</TableCell>
									<TableCell>{t('notices.status')}</TableCell>
									<TableCell align="center">{t('notices.action')}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{notices.length === 0 && (
									<TableRow>
										<TableCell align="center" colSpan={6}>
											<span className={'no-data'}>{t('notices.dataNotFound')}</span>
										</TableCell>
									</TableRow>
								)}
								{notices.map((notice: Notice) => (
									<TableRow hover key={notice._id}>
										<TableCell>
											{faq ? noticeTopicLabels[notice.noticeTopic as NoticeTopic] ?? '' : notice.noticeEvent ? t('notices.event') : ''}
										</TableCell>
										<TableCell sx={{ maxWidth: 420 }}>
											<strong>{notice.noticeTitle}</strong>
											<br />
											<span style={{ color: '#7c6470' }}>{notice.noticeContent}</span>
										</TableCell>
										<TableCell>{notice.memberData?.memberNick}</TableCell>
										<TableCell>{format.date(notice.createdAt, 'short')}</TableCell>
										<TableCell>
											<Select
												size={'small'}
												value={notice.noticeStatus}
												sx={{ minWidth: 120 }}
												onChange={(e) => statusChangeHandler(notice, e.target.value as NoticeStatus)}
												inputProps={{ 'aria-label': `Status of "${notice.noticeTitle}"` }}
											>
												{STATUSES.map((value) => (
													<MenuItem value={value} key={value}>
														{noticeStatusLabels[value]}
													</MenuItem>
												))}
											</Select>
										</TableCell>
										<TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
											<IconButton aria-label={`Edit "${notice.noticeTitle}"`} onClick={() => editHandler(notice)}>
												<EditOutlinedIcon fontSize="small" />
											</IconButton>
											{notice.noticeStatus === NoticeStatus.DELETE && (
												<IconButton aria-label={`Remove "${notice.noticeTitle}"`} onClick={() => removeHandler(notice)}>
													<DeleteIcon fontSize="small" />
												</IconButton>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 20, 40]}
						component="div"
						count={total}
						rowsPerPage={limit}
						page={page}
						onPageChange={(e: unknown, newPage: number) => setPage(newPage)}
						onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setLimit(parseInt(e.target.value, 10));
							setPage(0);
						}}
					/>
				</Box>
			</Box>

			<Dialog open={Boolean(form)} onClose={() => !saving && setForm(null)} fullWidth maxWidth={'sm'}>
				<DialogTitle>
					{form?._id ? 'Edit' : 'Add'} {faq ? 'a question' : 'a notice'}
				</DialogTitle>
				{form && (
					<DialogContent>
						<Stack gap={'18px'} sx={{ pt: '8px' }}>
							{faq && (
								<Select
									displayEmpty
									value={form.noticeTopic}
									onChange={(e) => changeForm({ noticeTopic: e.target.value as NoticeTopic })}
									inputProps={{ 'aria-label': t('notices.topic') }}
								>
									<MenuItem value={''} disabled>
										{t('notices.chooseATopic')}
									</MenuItem>
									{TOPICS.map((value) => (
										<MenuItem value={value} key={value}>
											{noticeTopicLabels[value]}
										</MenuItem>
									))}
								</Select>
							)}
							<TextField
								label={faq ? t('notices.question2') : t('notices.title2')}
								value={form.noticeTitle}
								onChange={(e) => changeForm({ noticeTitle: e.target.value })}
								inputProps={{ maxLength: 150 }}
								autoFocus
							/>
							<TextField
								label={faq ? t('notices.answer') : t('notices.text')}
								value={form.noticeContent}
								onChange={(e) => changeForm({ noticeContent: e.target.value })}
								inputProps={{ maxLength: 2000 }}
								multiline
								minRows={4}
								// the theme fixes every outlined input at 48px; a text of several lines needs its own height
								sx={{ '& .MuiOutlinedInput-root': { height: 'auto' } }}
							/>
							<Stack direction={'row'} alignItems={'center'} gap={'16px'} flexWrap={'wrap'}>
								<Select
									size={'small'}
									value={form.noticeStatus}
									onChange={(e) => changeForm({ noticeStatus: e.target.value as NoticeStatus })}
									inputProps={{ 'aria-label': t('notices.status2') }}
								>
									{STATUSES.map((value) => (
										<MenuItem value={value} key={value}>
											{noticeStatusLabels[value]}
										</MenuItem>
									))}
								</Select>
								{!faq && (
									<FormControlLabel
										control={
											<Checkbox
												checked={form.noticeEvent}
												onChange={(e) => changeForm({ noticeEvent: e.target.checked })}
											/>
										}
										label={t('notices.showWithTheEventMark')}
									/>
								)}
							</Stack>
							{formError && (
								<Typography role={'alert'} sx={{ color: '#7a1f45', fontSize: '14px' }}>
									{formError}
								</Typography>
							)}
						</Stack>
					</DialogContent>
				)}
				<DialogActions sx={{ px: '24px', pb: '20px' }}>
					<Button onClick={() => setForm(null)} disabled={saving}>
						{t('notices.cancel')}
					</Button>
					<Button variant={'contained'} onClick={saveHandler} disabled={saving}>
						{saving ? t('notices.saving') : t('notices.save')}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default NoticePanel;
