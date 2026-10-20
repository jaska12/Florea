import { OrderStatus } from '../../enums/order.enum';

export interface OrderItemInput {
	productId: string;
	itemQuantity: number;
	// the unit price on the buyer's screen; the API refuses the order if the product now costs something else
	itemPrice?: number;
}

export interface OrderInput {
	items: OrderItemInput[];
	recipientName: string;
	recipientPhone: string;
	deliveryAddress: string;
	deliveryDate: Date | string;
	deliveryTime?: string;
	cardMessage?: string;
}

interface OrderSearch {
	orderStatus?: OrderStatus;
}

export interface OrdersInquiry {
	page: number;
	limit: number;
	search?: OrderSearch;
}

export interface OrderUpdate {
	_id: string;
	orderStatus: OrderStatus;
}
