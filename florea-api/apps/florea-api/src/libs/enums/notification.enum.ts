import { registerEnumType } from '@nestjs/graphql';

export enum NotificationGroup {
    MEMBER = 'MEMBER',
    ARTICLE = 'ARTICLE',
    PRODUCT = 'PRODUCT',
    ORDER = 'ORDER',
}
registerEnumType(NotificationGroup, {
    name: 'NotificationGroup',
});

export enum NotificationStatus {
    WAIT = 'WAIT',
    READ = 'READ',
}
registerEnumType(NotificationStatus, {
    name: 'NotificationStatus',
});

export enum NotificationType {
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    SUBSCRIBE = 'SUBSCRIBE',
    ORDER = 'ORDER',
}
registerEnumType(NotificationType, {
    name: 'NotificationType',
});
