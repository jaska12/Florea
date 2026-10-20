import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import { Order, OrderItem, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrdersInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { Product } from '../../libs/dto/product/product';
import { Member } from '../../libs/dto/member/member';
import { cancellableOrderStatuses, OrderStatus, orderStatusFlow } from '../../libs/enums/order.enum';
import { ProductStatus } from '../../libs/enums/product.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { DELIVERY_FEE, FREE_DELIVERY_FROM, shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import { T } from '../../libs/types/common';

interface StockMove {
	productId: ObjectId;
	itemQuantity: number;
}

// what the buyer is told when the order moves on
const STATUS_TITLES: Record<string, string> = {
	[OrderStatus.CONFIRMED]: 'Your order is confirmed',
	[OrderStatus.PREPARING]: 'Your order is being prepared',
	[OrderStatus.OUT_FOR_DELIVERY]: 'Your order is out for delivery',
	[OrderStatus.DELIVERED]: 'Your order has been delivered',
	[OrderStatus.CANCELLED]: 'Your order was cancelled',
};

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		@InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private readonly notificationService: NotificationService,
	) {}

	/** BUYER **/

	// One order is created for each florist whose products are in the request.
	public async createOrder(memberId: ObjectId, input: OrderInput): Promise<Order[]> {
		// the same product sent twice counts once, with the quantities added
		const wanted = new Map<string, number>();
		// the unit prices the buyer saw, when the client sent them
		const seenPrice = new Map<string, number>();
		for (const item of input.items) {
			const key = String(item.productId);
			wanted.set(key, (wanted.get(key) ?? 0) + item.itemQuantity);
			if (item.itemPrice !== undefined && item.itemPrice !== null) seenPrice.set(key, item.itemPrice);
		}

		// a day of slack covers the time zones between the buyer and the server
		if (new Date(input.deliveryDate).getTime() < Date.now() - 24 * 60 * 60 * 1000) {
			throw new BadRequestException(Message.DELIVERY_DATE_PASSED);
		}

		const productIds = [...wanted.keys()].map((id) => shapeIntoMongoObjectId(id));
		const products = (await this.productModel
			.find({ _id: { $in: productIds }, productStatus: ProductStatus.ACTIVE })
			.exec()) as unknown as Product[];
		if (products.length !== productIds.length) throw new BadRequestException(Message.PRODUCT_NOT_AVAILABLE);

		for (const product of products) {
			if (String(product.memberId) === String(memberId))
				throw new BadRequestException(Message.OWN_PRODUCT_ORDER_DENIED);
			// the order is never placed for a sum other than the one on the buyer's screen
			const seen = seenPrice.get(String(product._id));
			if (seen !== undefined && seen !== product.productPrice) throw new BadRequestException(Message.PRICE_CHANGED);
			if (product.productStock < (wanted.get(String(product._id)) ?? 0)) {
				throw new BadRequestException(this.stockMessage(product));
			}
		}

		// Take the stock product by product. The condition in the query keeps two buyers from taking the same piece.
		const taken: StockMove[] = [];
		for (const product of products) {
			const itemQuantity = wanted.get(String(product._id)) ?? 0;
			const result = await this.productModel
				.findOneAndUpdate(
					{ _id: product._id, productStatus: ProductStatus.ACTIVE, productStock: { $gte: itemQuantity } },
					{ $inc: { productStock: -itemQuantity } },
					{ new: true },
				)
				.exec();
			if (!result) {
				await this.restoreStock(taken);
				throw new BadRequestException(this.stockMessage(product));
			}
			taken.push({ productId: product._id, itemQuantity: itemQuantity });
		}

		const byAgent = new Map<string, Product[]>();
		for (const product of products) {
			const key = String(product.memberId);
			byAgent.set(key, [...(byAgent.get(key) ?? []), product]);
		}

		const orders: Order[] = [];
		try {
			for (const [agentId, list] of byAgent) {
				const subtotal = list.reduce(
					(sum, product) => sum + product.productPrice * (wanted.get(String(product._id)) ?? 0),
					0,
				);
				const orderDelivery = subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;

				const order = (await this.orderModel.create({
					orderTotal: subtotal + orderDelivery,
					orderDelivery: orderDelivery,
					recipientName: input.recipientName.trim(),
					recipientPhone: input.recipientPhone.trim(),
					deliveryAddress: input.deliveryAddress.trim(),
					deliveryDate: input.deliveryDate,
					deliveryTime: input.deliveryTime,
					cardMessage: input.cardMessage?.trim() || undefined,
					memberId: memberId,
					agentId: shapeIntoMongoObjectId(agentId),
				})) as unknown as Order;
				orders.push(order);

				await this.orderItemModel.insertMany(
					list.map((product) => ({
						itemQuantity: wanted.get(String(product._id)) ?? 0,
						itemPrice: product.productPrice,
						orderId: order._id,
						productId: product._id,
					})),
				);
			}
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			const orderIds = orders.map((order) => order._id);
			await this.orderItemModel.deleteMany({ orderId: { $in: orderIds } }).exec();
			await this.orderModel.deleteMany({ _id: { $in: orderIds } }).exec();
			await this.restoreStock(taken);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		for (const order of orders) {
			await this.notificationService.createNotification({
				notificationType: NotificationType.ORDER,
				notificationGroup: NotificationGroup.ORDER,
				notificationTitle: 'New order',
				notificationDesc: this.describe(byAgent.get(String(order.agentId)) ?? []),
				authorId: memberId,
				receiverId: order.agentId,
				notificationRefId: order._id,
			});
		}

		return orders;
	}

	// The buyer can only cancel, and only while the florist has not confirmed the order.
	public async updateOrder(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
		if (input.orderStatus !== OrderStatus.CANCELLED) throw new BadRequestException(Message.ORDER_STATUS_NOT_ALLOWED);

		const result = (await this.orderModel
			.findOneAndUpdate(
				{ _id: input._id, memberId: memberId, orderStatus: OrderStatus.PENDING },
				{ orderStatus: OrderStatus.CANCELLED },
				{ new: true },
			)
			.exec()) as unknown as Order;
		if (!result) throw new BadRequestException(Message.ORDER_CANNOT_BE_CANCELLED);

		await this.restoreOrderStock(result._id);
		await this.notificationService.createNotification({
			notificationType: NotificationType.ORDER,
			notificationGroup: NotificationGroup.ORDER,
			notificationTitle: 'An order was cancelled',
			notificationDesc: await this.describeOrder(result._id),
			authorId: memberId,
			receiverId: result.agentId,
			notificationRefId: result._id,
		});

		return result;
	}

	public async getMyOrders(memberId: ObjectId, input: OrdersInquiry): Promise<Orders> {
		const match: T = { memberId: memberId };
		if (input.search?.orderStatus) match.orderStatus = input.search.orderStatus;
		return await this.listOrders(match, input);
	}

	public async getOrder(member: Member, orderId: ObjectId): Promise<Order> {
		const result = await this.orderModel.aggregate([{ $match: { _id: orderId } }, ...this.lookups()]).exec();
		const order: Order = result[0];
		if (!order) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const mine = [String(order.memberId), String(order.agentId)].includes(String(member._id));
		if (!mine && member.memberType !== MemberType.ADMIN) throw new ForbiddenException(Message.NOT_ALLOWED_REQUEST);

		return order;
	}

	/** FLORIST **/

	public async getAgentOrders(memberId: ObjectId, input: OrdersInquiry): Promise<Orders> {
		const match: T = { agentId: memberId };
		if (input.search?.orderStatus) match.orderStatus = input.search.orderStatus;
		return await this.listOrders(match, input);
	}

	public async updateOrderByAgent(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
		const order = (await this.orderModel.findOne({ _id: input._id, agentId: memberId }).exec()) as unknown as Order;
		if (!order) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return await this.changeStatus(memberId, order, input.orderStatus);
	}

	/** ADMIN **/

	public async getAllOrdersByAdmin(input: OrdersInquiry): Promise<Orders> {
		const match: T = {};
		if (input.search?.orderStatus) match.orderStatus = input.search.orderStatus;
		return await this.listOrders(match, input);
	}

	public async updateOrderByAdmin(memberId: ObjectId, input: OrderUpdate): Promise<Order> {
		const order = (await this.orderModel.findById(input._id).exec()) as unknown as Order;
		if (!order) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return await this.changeStatus(memberId, order, input.orderStatus);
	}

	/** SHARED **/

	// An order only moves forward, or is cancelled before it leaves the shop.
	private canMove(from: OrderStatus, to: OrderStatus): boolean {
		if (to === OrderStatus.CANCELLED) return cancellableOrderStatuses.includes(from);
		const fromStep = orderStatusFlow.indexOf(from);
		return fromStep !== -1 && orderStatusFlow.indexOf(to) > fromStep;
	}

	private async changeStatus(actorId: ObjectId, order: Order, orderStatus: OrderStatus): Promise<Order> {
		if (!this.canMove(order.orderStatus, orderStatus)) throw new BadRequestException(Message.ORDER_STATUS_NOT_ALLOWED);

		// the old status in the query keeps two changes at the same moment from both going through
		const result = (await this.orderModel
			.findOneAndUpdate({ _id: order._id, orderStatus: order.orderStatus }, { orderStatus: orderStatus }, { new: true })
			.exec()) as unknown as Order;
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (orderStatus === OrderStatus.CANCELLED) await this.restoreOrderStock(result._id);

		await this.notificationService.createNotification({
			notificationType: NotificationType.ORDER,
			notificationGroup: NotificationGroup.ORDER,
			notificationTitle: STATUS_TITLES[orderStatus],
			notificationDesc: await this.describeOrder(result._id),
			authorId: actorId,
			receiverId: result.memberId,
			notificationRefId: result._id,
		});

		return result;
	}

	private async listOrders(match: T, input: OrdersInquiry): Promise<Orders> {
		const { page, limit } = input;

		const result = await this.orderModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [{ $skip: (page - 1) * limit }, { $limit: limit }, ...this.lookups()],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	// the items with their products, the buyer and the florist
	private lookups(): any[] {
		return [
			{
				$lookup: {
					from: 'orderItems',
					let: { localOrderId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$orderId', '$$localOrderId'] } } },
						{ $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'productData' } },
						{ $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },
					],
					as: 'orderItems',
				},
			},
			{ $lookup: { from: 'members', localField: 'memberId', foreignField: '_id', as: 'memberData' } },
			{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
			{ $lookup: { from: 'members', localField: 'agentId', foreignField: '_id', as: 'agentData' } },
			{ $unwind: { path: '$agentData', preserveNullAndEmptyArrays: true } },
		];
	}

	private async restoreStock(moves: StockMove[]): Promise<void> {
		for (const move of moves) {
			await this.productModel.findByIdAndUpdate(move.productId, { $inc: { productStock: move.itemQuantity } }).exec();
		}
	}

	private async restoreOrderStock(orderId: ObjectId): Promise<void> {
		const items = (await this.orderItemModel.find({ orderId: orderId }).exec()) as unknown as OrderItem[];
		await this.restoreStock(items.map((item) => ({ productId: item.productId, itemQuantity: item.itemQuantity })));
	}

	private stockMessage(product: Product): string {
		return product.productStock > 0
			? `Only ${product.productStock} left of "${product.productTitle}"`
			: `"${product.productTitle}" is out of stock`;
	}

	// "Rose Bouquet" or "Rose Bouquet and 2 more": the second line of an order notification
	private describe(products: Product[]): string {
		if (!products.length) return '';
		const rest = products.length - 1;
		return rest > 0 ? `${products[0].productTitle} and ${rest} more` : products[0].productTitle;
	}

	private async describeOrder(orderId: ObjectId): Promise<string> {
		const items = (await this.orderItemModel.find({ orderId: orderId }).exec()) as unknown as OrderItem[];
		const products = (await this.productModel
			.find({ _id: { $in: items.map((item) => item.productId) } })
			.exec()) as unknown as Product[];
		return this.describe(products);
	}
}
