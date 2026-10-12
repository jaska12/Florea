import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
    // an announcement on the customer-care page
    NOTICE = 'NOTICE',
    FAQ = 'FAQ',
    TERMS = 'TERMS',
    INQUIRY = 'INQUIRY',
}
registerEnumType(NoticeCategory, {
    name: 'NoticeCategory',
});

export enum NoticeStatus {
    HOLD = 'HOLD',
    ACTIVE = 'ACTIVE',
    DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, {
    name: 'NoticeStatus',
});

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
registerEnumType(NoticeTopic, {
    name: 'NoticeTopic',
});
