import { registerEnumType } from '@nestjs/graphql';

export enum Message {
    SOMETHING_WENT_WRONG = 'Something went wrong!',
    NO_DATA_FOUND = 'No data found!',
    CREATE_FAILED = 'Create failed!',
    UPDATE_FAILED = 'Update failed!',
    REMOVE_FAILED = 'Remove failed!',
    UPLOAD_FAILED = 'Upload failed!',
    BAD_REQUEST = 'Bad Request',

    USED_MEMBER_NICK_OR_PHONE = 'Already used member nick or phone!',
    NO_MEMBER_NICK = 'No member with that member nick!',
    BLOCKED_USER = 'You have been blocked!',
    WRONG_PASSWORD = 'Wrong password, try again!',
    NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
    TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
    ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for members with specific roles!',
    NOT_ALLOWED_REQUEST = 'Not Allowed Request!',
    PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg or png images!',
    SELF_SUBSCRIPTION_DENIED = 'Self subscription is denied!',

    PRODUCT_NOT_AVAILABLE = 'One of the products is no longer available!',
    OWN_PRODUCT_ORDER_DENIED = 'You cannot order your own product!',
    PRICE_CHANGED = 'The price of a product in your cart has changed!',
    DELIVERY_DATE_PASSED = 'The delivery date cannot be in the past!',
    ORDER_CANNOT_BE_CANCELLED = 'This order can no longer be cancelled!',
    ORDER_STATUS_NOT_ALLOWED = 'This status change is not allowed!',

    NOTICE_TOPIC_REQUIRED = 'Choose a topic for the FAQ entry!',

    AI_TOO_MANY_REQUESTS = 'You are asking too fast. Please wait a minute and try again.',
    AI_UNAVAILABLE = 'The assistant is not available right now. Please try again in a moment.',
}

export enum Direction {
    ASC = 1,
    DESC = -1,
}

registerEnumType(Direction, {
    name: 'Direction',
});
