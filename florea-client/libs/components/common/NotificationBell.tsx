import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Badge, Box, IconButton, Popover, Stack, useMediaQuery } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import Moment from 'react-moment';
import { notificationPingVar, userVar } from '../../../apollo/store';
import { GET_BOARD_ARTICLE, GET_NOTIFICATIONS } from '../../../apollo/user/query';
import { READ_ALL_NOTIFICATIONS, READ_NOTIFICATION } from '../../../apollo/user/mutation';
import { Notification, Notifications } from '../../types/notification/notification';
import { NotificationsInquiry } from '../../types/notification/notification.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { MemberType } from '../../enums/member.enum';

const PAGE_SIZE = 10;
// new notifications are announced over the socket; this timer only covers a socket that is down
const POLL_INTERVAL = 60000;

// One icon per notification type. The backend sends LIKE, COMMENT and SUBSCRIBE today;
// ORDER and SYSTEM are ready for when it adds them, and an unknown type gets the SYSTEM icon.
const TYPE_ICONS: Record<string, { tone: string; icon: JSX.Element }> = {
	LIKE: { tone: 'like', icon: <FavoriteRoundedIcon /> },
	COMMENT: { tone: 'comment', icon: <ChatBubbleOutlineRoundedIcon /> },
	SUBSCRIBE: { tone: 'follow', icon: <PersonAddAlt1RoundedIcon /> },
	ORDER: { tone: 'order', icon: <LocalMallOutlinedIcon /> },
	SYSTEM: { tone: 'system', icon: <CampaignOutlinedIcon /> },
};

// order notifications that go to the florist; the others go to the buyer
const SHOP_ORDER_TITLES = ['New order', 'An order was cancelled'];

// What the author did, written after their name. Keys are in the locale files.
const ACTION_TEXT: Record<string, string> = {
	LIKE_PRODUCT: 'liked your product',
	LIKE_ARTICLE: 'liked your article',
	LIKE_MEMBER: 'liked your profile',
	COMMENT_PRODUCT: 'commented on your product',
	COMMENT_ARTICLE: 'commented on your article',
	COMMENT_MEMBER: 'left a review on your profile',
	SUBSCRIBE_MEMBER: 'started following you',
};

interface NotificationBellProps {
	// 'dark' sits on the wine navbar, 'light' on a pale surface
	tone?: 'dark' | 'light';
}

const NotificationBell = (props: NotificationBellProps) => {
	const { tone = 'dark' } = props;
	const { t } = useTranslation('common');
	const router = useRouter();
	const client = useApolloClient();
	const user = useReactiveVar(userVar);
	const ping = useReactiveVar(notificationPingVar);
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);
	const [limit, setLimit] = useState<number>(PAGE_SIZE);
	const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const open = Boolean(anchor);
	const inquiry: NotificationsInquiry = { page: 1, limit: limit };

	/** APOLLO REQUESTS **/
	const [readNotification] = useMutation(READ_NOTIFICATION);
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS);

	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		previousData: getNotificationsPrevious,
		refetch: getNotificationsRefetch,
		stopPolling,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: inquiry },
		skip: !user?._id,
		pollInterval: POLL_INTERVAL,
		// A background check must not open an error alert (see errorLink in apollo/client.ts).
		// Apollo shares identical requests that are in flight. Two signals close together would then share one
		// answer, read before the second change was written, so every check here sends its own request.
		context: { silentError: true, queryDeduplication: false },
		onError: () => stopPolling(),
	});

	// while more rows load, the rows already shown stay on screen
	const result: Notifications | undefined = (getNotificationsData ?? getNotificationsPrevious)?.getNotifications;
	const notifications: Notification[] = result?.list ?? [];
	const total: number = result?.metaCounter?.[0]?.total ?? 0;
	const unreadCount: number = result?.unreadCount ?? 0;
	const firstLoad = getNotificationsLoading && !result;

	/** LIFECYCLES **/
	useEffect(() => {
		if (ping && user?._id) getNotificationsRefetch({ input: inquiry }).catch(() => {});
	}, [ping]);

	/** HANDLERS **/
	const openHandler = (event: React.MouseEvent<HTMLElement>) => {
		setAnchor(event.currentTarget);
		if (user?._id) getNotificationsRefetch({ input: inquiry }).catch(() => {});
	};

	const closeHandler = () => {
		setAnchor(null);
		setLimit(PAGE_SIZE);
	};

	// where a notification leads: the product, the article, or the member it is about
	const linkOf = async (notification: Notification): Promise<string> => {
		const { notificationType, notificationGroup, notificationRefId, authorId, authorData } = notification;

		if (notificationGroup === NotificationGroup.ORDER && notificationRefId) {
			const category = SHOP_ORDER_TITLES.includes(notification.notificationTitle) ? 'shopOrders' : 'myOrders';
			return `/mypage?category=${category}&orderId=${notificationRefId}`;
		}

		if (notificationGroup === NotificationGroup.PRODUCT && notificationRefId) {
			return `/product/detail?id=${notificationRefId}`;
		}

		if (notificationGroup === NotificationGroup.ARTICLE && notificationRefId) {
			// the article page needs the board the article is on
			try {
				const { data } = await client.query({ query: GET_BOARD_ARTICLE, variables: { input: notificationRefId } });
				return `/community/detail?articleCategory=${data?.getBoardArticle?.articleCategory}&id=${notificationRefId}`;
			} catch (err) {
				return '/community?articleCategory=FREE';
			}
		}

		// a review is on the receiver's own florist page; a like or a follow leads to the member who did it
		if (notificationType === NotificationType.COMMENT && notificationRefId) {
			return `/agent/detail?agentId=${notificationRefId}`;
		}
		if (authorData?.memberType === MemberType.AGENT) return `/agent/detail?agentId=${authorId}`;
		return `/member?memberId=${authorId}`;
	};

	const itemClickHandler = async (notification: Notification) => {
		try {
			if (notification.notificationStatus === NotificationStatus.WAIT) {
				await readNotification({ variables: { input: notification._id } });
				await getNotificationsRefetch({ input: inquiry });
			}
		} catch (err: any) {
			console.log('ERROR, itemClickHandler:', err.message);
		}

		const link = await linkOf(notification);
		closeHandler();
		await router.push(link);
	};

	const readAllHandler = async () => {
		try {
			await readAllNotifications();
			await getNotificationsRefetch({ input: inquiry });
		} catch (err: any) {
			console.log('ERROR, readAllHandler:', err.message);
		}
	};

	const showMoreHandler = () => {
		setLimit(limit + PAGE_SIZE);
	};

	return (
		<>
			<IconButton
				className={`notify-bell ${tone} ${open ? 'open' : ''}`}
				aria-label={unreadCount ? `${t('Notifications')} (${unreadCount})` : t('Notifications')}
				aria-haspopup={'true'}
				aria-expanded={open}
				onClick={openHandler}
			>
				<Badge className={'notify-badge'} badgeContent={unreadCount} max={99}>
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>

			<Popover
				open={open}
				anchorEl={anchor}
				onClose={closeHandler}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				transitionDuration={reducedMotion ? 0 : 240}
				disableScrollLock
				PaperProps={{ className: 'florea-notify' }}
			>
				<Stack className={'notify-head'}>
					<strong>{t('Notifications')}</strong>
					{unreadCount > 0 && (
						<span className={'notify-count'}>
							{unreadCount} {t('new')}
						</span>
					)}
					{unreadCount > 0 && (
						<button type={'button'} className={'notify-read-all'} onClick={readAllHandler}>
							{t('Mark all as read')}
						</button>
					)}
				</Stack>

				{firstLoad ? (
					<Stack className={'notify-list'} aria-busy={'true'}>
						{[0, 1, 2].map((row) => (
							<Stack className={'notify-item skeleton'} key={row}>
								<span className={'notify-icon'} />
								<Box component={'div'} className={'notify-body'}>
									<span className={'line'} />
									<span className={'line short'} />
								</Box>
							</Stack>
						))}
					</Stack>
				) : notifications.length === 0 ? (
					<Stack className={'notify-empty'}>
						<span className={'notify-empty-icon'}>
							<NotificationsOutlinedIcon />
						</span>
						<strong>{t('No notifications yet')}</strong>
						<p>{t('Likes, comments and new followers will appear here.')}</p>
					</Stack>
				) : (
					<Stack className={'notify-list'} component={'ul'}>
						{notifications.map((notification, index) => {
							const type = TYPE_ICONS[notification.notificationType] ?? TYPE_ICONS.SYSTEM;
							const action = ACTION_TEXT[`${notification.notificationType}_${notification.notificationGroup}`];
							const author = notification.authorData?.memberNick;
							const unread = notification.notificationStatus === NotificationStatus.WAIT;
							return (
								<li key={notification._id} style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}>
									<button
										type={'button'}
										className={`notify-item ${unread ? 'unread' : 'read'}`}
										onClick={() => itemClickHandler(notification)}
									>
										<span className={`notify-icon ${type.tone}`}>{type.icon}</span>
										<Box component={'div'} className={'notify-body'}>
											<span className={'notify-title'}>
												{author && action ? (
													<>
														<b>{author}</b> {t(action)}
													</>
												) : (
													t(notification.notificationTitle)
												)}
											</span>
											{notification.notificationDesc && (
												<span className={'notify-desc'}>{notification.notificationDesc}</span>
											)}
											<Moment className={'notify-time'} fromNow>
												{notification.createdAt}
											</Moment>
										</Box>
										{unread && <span className={'notify-dot'} aria-label={t('Unread')} />}
									</button>
								</li>
							);
						})}
						{total > notifications.length && (
							<li className={'notify-more'}>
								<button type={'button'} onClick={showMoreHandler} disabled={getNotificationsLoading}>
									{t('Show more')}
								</button>
							</li>
						)}
					</Stack>
				)}
			</Popover>
		</>
	);
};

export default NotificationBell;
