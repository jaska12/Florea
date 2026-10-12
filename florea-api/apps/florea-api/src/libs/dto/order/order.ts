import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'bson';
import { OrderStatus } from '../../enums/order.enum';
import { Member, TotalCounter } from '../member/member';
import { Product } from '../product/product';

@ObjectType()
export class OrderItem {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	itemQuantity: number;

	@Field(() => Number)
	itemPrice: number;

	@Field(() => String)
	orderId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Product, { nullable: true })
	productData?: Product;
}

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Number)
	orderTotal: number;

	@Field(() => Number)
	orderDelivery: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

	@Field(() => String)
	recipientName: string;

	@Field(() => String)
	recipientPhone: string;

	@Field(() => String)
	deliveryAddress: string;

	@Field(() => Date)
	deliveryDate: Date;

	@Field(() => String, { nullable: true })
	deliveryTime?: string;

	@Field(() => String, { nullable: true })
	cardMessage?: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	agentId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => [OrderItem], { nullable: true })
	orderItems?: OrderItem[];

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Member, { nullable: true })
	agentData?: Member;
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
