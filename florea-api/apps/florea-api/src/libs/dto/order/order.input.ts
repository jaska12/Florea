import { Field, InputType, Int } from '@nestjs/graphql';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsDate,
	IsInt,
	IsNotEmpty,
	IsOptional,
	Length,
	Max,
	Min,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'bson';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class OrderItemInput {
	@IsNotEmpty()
	@Field(() => String)
	productId: ObjectId;

	@IsInt()
	@Min(1)
	@Max(50)
	@Field(() => Int)
	itemQuantity: number;
}

@InputType()
export class OrderInput {
	@ArrayMinSize(1)
	@ArrayMaxSize(30)
	@ValidateNested({ each: true })
	@Type(() => OrderItemInput)
	@Field(() => [OrderItemInput])
	items: OrderItemInput[];

	@IsNotEmpty()
	@Length(2, 60)
	@Field(() => String)
	recipientName: string;

	@IsNotEmpty()
	@Length(5, 20)
	@Field(() => String)
	recipientPhone: string;

	@IsNotEmpty()
	@Length(5, 200)
	@Field(() => String)
	deliveryAddress: string;

	@IsDate()
	@Field(() => Date)
	deliveryDate: Date;

	@IsOptional()
	@Length(1, 30)
	@Field(() => String, { nullable: true })
	deliveryTime?: string;

	@IsOptional()
	@Length(1, 300)
	@Field(() => String, { nullable: true })
	cardMessage?: string;
}

@InputType()
class OrderSearch {
	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;
}

@InputType()
export class OrdersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@Field(() => OrderSearch, { nullable: true })
	search?: OrderSearch;
}
