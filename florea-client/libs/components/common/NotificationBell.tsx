import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Badge, Box, IconButton, Popover, Stack, useMediaQuery } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import Moment from 'react-moment';
import { Notification } from '../../types/notification/notification';
import { NotificationStatus } from '../../enums/notification.enum';

// One icon per notification type. The backend has LIKE and COMMENT today; the others are ready for when it adds them.
const TYPE_ICONS: Record<string, { tone: string; icon: JSX.Element }> = {
	LIKE: { tone: 'like', icon: <FavoriteRoundedIcon /> },
	COMMENT: { tone: 'comment', icon: <ChatBubbleOutlineRoundedIcon /> },
	FOLLOW: { tone: 'follow', icon: <PersonAddAlt1RoundedIcon /> },
	ORDER: { tone: 'order', icon: <LocalMallOutlinedIcon /> },
	SYSTEM: { tone: 'system', icon: <CampaignOutlinedIcon /> },
};

interface NotificationBellProps {
	notifications?: Notification[];
	loading?: boolean;
	onItemClick?: (notification: Notification) => void;
	onMarkAllRead?: () => void;
	// 'dark' sits on the wine navbar, 'light' on a pale surface
	tone?: 'dark' | 'light';
}

const NotificationBell = (props: NotificationBellProps) => {
	const { notifications = [], loading = false, onItemClick, onMarkAllRead, tone = 'dark' } = props;
	const { t } = useTranslation('common');
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);
	const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const open = Boolean(anchor);
	const unreadCount = notifications.filter((item) => item.notificationStatus === NotificationStatus.WAIT).length;

	/** HANDLERS **/
	const itemClickHandler = (notification: Notification) => {
		if (onItemClick) onItemClick(notification);
		setAnchor(null);
	};

	return (
		<>
			<IconButton
				className={`notify-bell ${tone} ${open ? 'open' : ''}`}
				aria-label={unreadCount ? `${t('Notifications')} (${unreadCount})` : t('Notifications')}
				aria-haspopup={'true'}
				aria-expanded={open}
				onClick={(event: React.MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
			>
				<Badge className={'notify-badge'} badgeContent={unreadCount} max={99}>
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>

			<Popover
				open={open}
				anchorEl={anchor}
				onClose={() => setAnchor(null)}
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
					{unreadCount > 0 && onMarkAllRead && (
						<button type={'button'} className={'notify-read-all'} onClick={onMarkAllRead}>
							{t('Mark all as read')}
						</button>
					)}
				</Stack>

				{loading ? (
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
						<p>{t('Updates about your account will appear here.')}</p>
					</Stack>
				) : (
					<Stack className={'notify-list'} component={'ul'}>
						{notifications.map((notification, index) => {
							const type = TYPE_ICONS[notification.notificationType] ?? TYPE_ICONS.SYSTEM;
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
											<span className={'notify-title'}>{notification.notificationTitle}</span>
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
					</Stack>
				)}
			</Popover>
		</>
	);
};

export default NotificationBell;
