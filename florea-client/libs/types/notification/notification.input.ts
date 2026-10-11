import { NotificationStatus } from '../../enums/notification.enum';

interface NotificationSearch {
	notificationStatus?: NotificationStatus;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	search?: NotificationSearch;
}
