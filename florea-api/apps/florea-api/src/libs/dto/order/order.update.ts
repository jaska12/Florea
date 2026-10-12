import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'bson';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class OrderUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsNotEmpty()
	@Field(() => OrderStatus)
	orderStatus: OrderStatus;
}
