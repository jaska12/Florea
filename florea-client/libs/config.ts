export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ['productSameDay', 'productGiftWrap'];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

export const topProductRank = 2;

// Prices are whole Korean won (KRW).
// The top of the price filter when the visitor has not set one, in won. A product priced above it is hidden
// until the visitor raises the limit, so it is kept far above real prices.
export const productPriceCeiling = 10000000;
/** the steps of the price filter and of the price field of the product form **/
export const priceStep = 1000;
/** the lowest price a product may have; the same as MIN_PRODUCT_PRICE in the API **/
export const minProductPrice = 1000;

// The delivery rule, the same as DELIVERY_FEE and FREE_DELIVERY_FROM in the API (libs/config.ts there).
// The cart shows what the server will charge; the server's sum is the one that counts.
export const deliveryFee = 4000;
export const freeDeliveryFrom = 50000;

export const deliveryTimeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];
