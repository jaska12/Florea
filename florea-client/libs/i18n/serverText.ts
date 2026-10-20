import { tr } from './tr';

// The API answers in English and is not changed. The messages it is known to send (and the ones this client
// raises itself) are listed here with the key of the same text in common.json, so an alert shows them in the
// chosen language. A message that is not listed is shown as it came.
const MESSAGES: Record<string, string> = {
	'Something went wrong!': 'somethingWentWrong',
	'No data found!': 'noDataFound',
	'Create failed!': 'createFailed',
	'Update failed!': 'updateFailed',
	'Remove failed!': 'removeFailed',
	'Upload failed!': 'uploadFailed',
	'Bad Request': 'badRequest',
	'Bad Request Exception': 'badRequest',
	'Already used member nick or phone!': 'nickOrPhoneUsed',
	'You are inserting already used nick or phone!': 'nickOrPhoneUsed',
	'No member with that member nick!': 'noMemberNick',
	'You have been blocked!': 'blocked',
	'User has been blocked!': 'blocked',
	'Wrong password, try again!': 'wrongPassword',
	'Please check your password again': 'wrongPassword',
	'You are not authenticated, please login first!': 'notAuthenticated',
	'Please login first!': 'notAuthenticated',
	'Bearer Token is not provided!': 'notAuthenticated',
	'Allowed only for members with specific roles!': 'rolesOnly',
	'Not Allowed Request!': 'notAllowed',
	'Please provide jpg, jpeg or png images!': 'imageFormat',
	'Only images with jpeg, jpg, png format allowed!': 'imageFormat',
	'Self subscription is denied!': 'selfSubscription',
	'One of the products is no longer available!': 'productNotAvailable',
	'You cannot order your own product!': 'ownProductOrder',
	'The price of a product in your cart has changed!': 'priceChanged',
	'The delivery date cannot be in the past!': 'deliveryDatePassed',
	'This order can no longer be cancelled!': 'orderCannotBeCancelled',
	'This status change is not allowed!': 'orderStatusNotAllowed',
	'Choose a topic for the FAQ entry!': 'noticeTopicRequired',
	'You are asking too fast. Please wait a minute and try again.': 'aiTooManyRequests',
	'The assistant is not available right now. Please try again in a moment.': 'aiUnavailable',
	'Token creation error!': 'loginFailed',
	'token error': 'loginFailed',
	'Login Err': 'loginFailed',
	'Please provide all inputs': 'fillAllInputs',
	'Please fulfill all inputs!': 'fillAllInputs',
	'Message is empty!': 'messageEmpty',
};

/** a message from the API (or one of this client's own) in the chosen language **/
export const serverText = (text: string): string => {
	const id = MESSAGES[text];
	return id ? tr(`common:serverError.${id}`, text) : text;
};

// Notification titles are written by the API when the notification is made, and stored in English.
const TITLES: Record<string, string> = {
	'New order': 'newOrder',
	'An order was cancelled': 'orderCancelledForShop',
	'Your order is confirmed': 'orderConfirmed',
	'Your order is being prepared': 'orderPreparing',
	'Your order is out for delivery': 'orderOutForDelivery',
	'Your order has been delivered': 'orderDelivered',
	'Your order was cancelled': 'orderCancelled',
	'New like on your product': 'likeProduct',
	'New like on your article': 'likeArticle',
	'New like on your profile': 'likeProfile',
	'New comment': 'comment',
	'New follower': 'follower',
};

export const notificationTitle = (title: string): string => {
	const id = TITLES[title];
	return id ? tr(`common:notifications.serverTitle.${id}`, title) : title;
};
