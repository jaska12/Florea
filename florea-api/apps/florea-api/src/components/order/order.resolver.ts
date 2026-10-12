import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'bson';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Member } from '../../libs/dto/member/member';
import { Order, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrdersInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class OrderResolver {
	constructor(private readonly orderService: OrderService) {}

	/** BUYER **/

	@UseGuards(AuthGuard)
	@Mutation(() => [Order])
	public async createOrder(@Args('input') input: OrderInput, @AuthMember('_id') memberId: ObjectId): Promise<Order[]> {
		console.log('Mutation: createOrder');
		return await this.orderService.createOrder(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Order)
	public async updateOrder(@Args('input') input: OrderUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Order> {
		console.log('Mutation: updateOrder');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateOrder(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Orders)
	public async getMyOrders(
		@Args('input') input: OrdersInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Orders> {
		console.log('Query: getMyOrders');
		return await this.orderService.getMyOrders(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Order)
	public async getOrder(@Args('orderId') input: string, @AuthMember() member: Member): Promise<Order> {
		console.log('Query: getOrder');
		return await this.orderService.getOrder(member, shapeIntoMongoObjectId(input));
	}

	/** FLORIST **/

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => Orders)
	public async getAgentOrders(
		@Args('input') input: OrdersInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Orders> {
		console.log('Query: getAgentOrders');
		return await this.orderService.getAgentOrders(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Order)
	public async updateOrderByAgent(
		@Args('input') input: OrderUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Mutation: updateOrderByAgent');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateOrderByAgent(memberId, input);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Orders)
	public async getAllOrdersByAdmin(@Args('input') input: OrdersInquiry): Promise<Orders> {
		console.log('Query: getAllOrdersByAdmin');
		return await this.orderService.getAllOrdersByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Order)
	public async updateOrderByAdmin(
		@Args('input') input: OrderUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Order> {
		console.log('Mutation: updateOrderByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.orderService.updateOrderByAdmin(memberId, input);
	}
}
