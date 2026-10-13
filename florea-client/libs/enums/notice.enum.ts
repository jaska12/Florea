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

// The order of the FAQ groups, on the customer-care page and in the admin panel.
// Their names are translated: useEnumLabel()('noticeTopic', value), from common.json.
export const noticeTopics: NoticeTopic[] = [
	NoticeTopic.PRODUCT,
	NoticeTopic.PAYMENT,
	NoticeTopic.ORDER,
	NoticeTopic.FLORIST,
	NoticeTopic.ACCOUNT,
	NoticeTopic.COMMUNITY,
	NoticeTopic.OTHER,
];

export const noticeStatuses: NoticeStatus[] = [NoticeStatus.HOLD, NoticeStatus.ACTIVE, NoticeStatus.DELETE];
