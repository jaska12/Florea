import { ObjectId } from 'bson';
import { ProductService } from './product.service';

// libs/config.ts imports uuid, which jest cannot load as it is shipped; nothing here needs a real one
jest.mock('uuid', () => ({ v4: () => 'test-uuid' }));

// The product collection is a mock; only the aggregation that getCartProducts sends is looked at.

const setup = (rows: unknown[] = []) => {
	const exec = jest.fn().mockResolvedValue(rows);
	const aggregate = jest.fn((pipeline: unknown[]) => ({ exec }));
	const recordView = jest.fn();
	const service = new ProductService({ aggregate } as never, {} as never, { recordView } as never, {} as never, {} as never);
	return { service, aggregate, recordView };
};

const matchedIds = (aggregate: jest.Mock): string[] =>
	(aggregate.mock.calls[0][0][0] as { $match: { _id: { $in: ObjectId[] } } }).$match._id.$in.map(String);

describe('ProductService.getCartProducts', () => {
	it('asks for the products of the cart whatever their status, with their florist', async () => {
		const { service, aggregate } = setup();
		const a = new ObjectId().toHexString();
		const b = new ObjectId().toHexString();
		await service.getCartProducts([a, b]);
		const pipeline = aggregate.mock.calls[0][0];
		expect(matchedIds(aggregate)).toEqual([a, b]);
		expect(JSON.stringify(pipeline)).not.toContain('productStatus');
		expect(JSON.stringify(pipeline)).toContain('memberData');
	});

	it('drops ids that are not ids and the same id sent twice', async () => {
		const { service, aggregate } = setup();
		const a = new ObjectId().toHexString();
		await service.getCartProducts([a, 'not-an-id', a, '{"$gt":""}']);
		expect(matchedIds(aggregate)).toEqual([a]);
	});

	it('does not ask the database when nothing usable was sent', async () => {
		const { service, aggregate } = setup();
		expect(await service.getCartProducts(['x', ''])).toEqual([]);
		expect(aggregate).not.toHaveBeenCalled();
	});

	it('looks at no more than 30 products', async () => {
		const { service, aggregate } = setup();
		const ids = Array.from({ length: 40 }, () => new ObjectId().toHexString());
		await service.getCartProducts(ids);
		expect(matchedIds(aggregate)).toHaveLength(30);
	});

	it('records no view', async () => {
		const { service, recordView } = setup();
		await service.getCartProducts([new ObjectId().toHexString()]);
		expect(recordView).not.toHaveBeenCalled();
	});
});
