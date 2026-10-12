export enum NoticeCategory {
	// an announcement on the customer-care page
	NOTICE = 'NOTICE',
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	INQUIRY = 'INQUIRY',
}

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}

// the group an FAQ entry is shown under
export enum NoticeTopic {
	PRODUCT = 'PRODUCT',
	PAYMENT = 'PAYMENT',
	ORDER = 'ORDER',
	FLORIST = 'FLORIST',
	ACCOUNT = 'ACCOUNT',
	COMMUNITY = 'COMMUNITY',
	OTHER = 'OTHER',
}

// the order and the names of the FAQ groups, on the customer-care page and in the admin panel
export const noticeTopicLabels: Record<NoticeTopic, string> = {
	[NoticeTopic.PRODUCT]: 'Product',
	[NoticeTopic.PAYMENT]: 'Payment',
	[NoticeTopic.ORDER]: 'Orders',
	[NoticeTopic.FLORIST]: 'For Florists',
	[NoticeTopic.ACCOUNT]: 'Account',
	[NoticeTopic.COMMUNITY]: 'Community',
	[NoticeTopic.OTHER]: 'Other',
};

export const noticeStatusLabels: Record<NoticeStatus, string> = {
	[NoticeStatus.HOLD]: 'On hold',
	[NoticeStatus.ACTIVE]: 'Active',
	[NoticeStatus.DELETE]: 'Deleted',
};
