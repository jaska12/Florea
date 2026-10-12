import { OrderStatus } from '../../enums/order.enum';

export interface OrderItemInput {
	productId: string;
	itemQuantity: number;
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
