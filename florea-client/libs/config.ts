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

// The top of the price filter when the visitor has not set one. It was 2,000,000, a house price from Nestar.
// A product priced above it is hidden until the visitor raises the limit, so keep it well above real prices.
export const productPriceCeiling = 10000;

// The delivery rule, the same as DELIVERY_FEE and FREE_DELIVERY_FROM in the API (libs/config.ts there).
// The cart shows what the server will charge; the server's sum is the one that counts.
export const deliveryFee = 5;
export const freeDeliveryFrom = 100;

export const deliveryTimeSlots = ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00'];
