import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'bson';
import { OrderService } from './order.service';
import { OrderInput } from '../../libs/dto/order/order.input';
import { Message } from '../../libs/enums/common.enum';
import { ProductStatus } from '../../libs/enums/product.enum';

// libs/config.ts imports uuid, which jest cannot load as it is shipped; nothing here needs a real one
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

// The collections are mocks. These tests stop before any stock is taken, except the one that places the order.

const product = { _id: new ObjectId(), productPrice: 59000, productStock: 5, productStatus: ProductStatus.ACTIVE, memberId: new ObjectId() };

const setup = () => {
	const find = jest.fn(() => ({ exec: jest.fn().mockResolvedValue([product]) }));
	const findOneAndUpdate = jest.fn(() => ({ exec: jest.fn().mockResolvedValue({ ...product, productStock: 4 }) }));
	const create = jest.fn(async (doc: object) => ({ _id: new ObjectId(), ...doc }));
	const insertMany = jest.fn().mockResolvedValue([]);
	const notify = { createNotification: jest.fn().mockResolvedValue(undefined) };
	const service = new OrderService({ create } as never, { insertMany } as never, { find, findOneAndUpdate } as never, notify as never);
	return { service, findOneAndUpdate, create };
};

const input = (itemPrice?: number): OrderInput =>
	({
		items: [{ productId: product._id, itemQuantity: 1, ...(itemPrice === undefined ? {} : { itemPrice }) }],
		recipientName: 'Kim',
		recipientPhone: '01012345678',
		deliveryAddress: 'Seoul, Gangnam',
		deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
		deliveryTime: '10:00-12:00',
	}) as unknown as OrderInput;

describe('OrderService.createOrder and the price the buyer saw', () => {
	const buyer = new ObjectId();

	it('refuses the order when the buyer saw another price, and takes no stock', async () => {
		const { service, findOneAndUpdate } = setup();
		await expect(service.createOrder(buyer, input(88))).rejects.toThrow(new BadRequestException(Message.PRICE_CHANGED));
		expect(findOneAndUpdate).not.toHaveBeenCalled();
	});

	it('places the order when the price is the one the buyer saw', async () => {
		const { service, create } = setup();
		await service.createOrder(buyer, input(59000));
		// from ₩50,000 the delivery is free
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ orderTotal: 59000, orderDelivery: 0 }));
	});

	it('still places the order when an older client sends no price', async () => {
		const { service, create } = setup();
		await service.createOrder(buyer, input());
		expect(create).toHaveBeenCalled();
	});
});
