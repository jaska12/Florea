import { OrderStatus } from '../../enums/order.enum';
import { Member } from '../member/member';
import { Product, TotalCounter } from '../product/product';

export interface OrderItem {
	_id: string;
	itemQuantity: number;
	itemPrice: number;
	orderId: string;
	productId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	productData?: Product;
}

export interface Order {
	_id: string;
	orderTotal: number;
	orderDelivery: number;
	orderStatus: OrderStatus;
	recipientName: string;
	recipientPhone: string;
	deliveryAddress: string;
	deliveryDate: Date;
	deliveryTime?: string;
	cardMessage?: string;
	memberId: string;
	agentId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	orderItems?: OrderItem[];
	memberData?: Member;
	agentData?: Member;
}

export interface Orders {
	list: Order[];
	metaCounter: TotalCounter[];
}
