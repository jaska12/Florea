import { HttpException, ServiceUnavailableException } from '@nestjs/common';
import { ObjectId } from 'bson';
import { AI_RATE_LIMIT, AI_RATE_WINDOW_MS, AiService } from './ai.service';
import { AiClient, AiFailure, AiJsonRequest } from './ai.client';
import { ProductOccasion, ProductSize, ProductStatus, ProductType } from '../../libs/enums/product.enum';
import { AiCardTone, AiLanguage } from '../../libs/enums/ai.enum';
import { Message } from '../../libs/enums/common.enum';

// No test here reaches the OpenAI API: the client is a mock, and so is the product collection.

const product = (n: number) => ({
	_id: new ObjectId(),
	productTitle: `Product ${n}`,
	productType: ProductType.BOUQUET,
	productOccasion: ProductOccasion.BIRTHDAY,
	productSize: ProductSize.MEDIUM,
	productPrice: 20 + n,
	productStock: 5,
	productDesc: `Description of product ${n}`,
	productImages: ['uploads/product/secret-path.jpg'],
	memberId: new ObjectId(),
});

const setup = (candidates: ReturnType<typeof product>[] = []) => {
	const exec = jest.fn().mockResolvedValue(candidates);
	const find = jest.fn(() => ({ sort: () => ({ limit: () => ({ lean: () => ({ exec }) }) }) }));
	const askJson = jest.fn<Promise<unknown>, [AiJsonRequest]>();
	const service = new AiService({ find } as never, { askJson } as unknown as AiClient);
	return { service, find, askJson };
};

describe('AiService', () => {
	const memberId = new ObjectId();

	describe('giftRecommend', () => {
		it('asks the database for products that can be ordered now and match the filters', async () => {
			const { service, find } = setup();
			await service.giftRecommend(memberId, {
				prompt: 'something for my mother',
				budgetMax: 50,
				occasion: ProductOccasion.BIRTHDAY,
				size: ProductSize.SMALL,
			});
			expect(find).toHaveBeenCalledWith({
				productStatus: ProductStatus.ACTIVE,
				productStock: { $gt: 0 },
				memberId: { $ne: memberId },
				productPrice: { $lte: 50 },
				productOccasion: ProductOccasion.BIRTHDAY,
				productSize: ProductSize.SMALL,
			});
		});

		it('does not call the model when nothing matches', async () => {
			const { service, askJson } = setup([]);
			const result = await service.giftRecommend(memberId, { prompt: 'a gift' });
			expect(askJson).not.toHaveBeenCalled();
			expect(result.list).toEqual([]);
			expect(result.aiUsed).toBe(false);
			expect(result.message).toBeTruthy();
		});

		it('sends only the short candidate fields to the model', async () => {
			const candidates = [product(1), product(2)];
			const { service, askJson } = setup(candidates);
			askJson.mockResolvedValue({ picks: [] });
			await service.giftRecommend(memberId, { prompt: 'a gift for a friend' });

			const request = askJson.mock.calls[0][0];
			const sent = JSON.parse(request.user.split('<candidates>\n')[1].split('\n</candidates>')[0]) as Record<
				string,
				unknown
			>[];
			expect(sent).toHaveLength(2);
			expect(Object.keys(sent[0]).sort()).toEqual(['desc', 'id', 'occasion', 'price', 'size', 'title', 'type']);
			expect(sent[0].id).toBe(String(candidates[0]._id));
			expect(request.user).not.toContain('secret-path');
			expect(request.user).not.toContain(String(memberId));
			expect(request.user).toContain('a gift for a friend');
		});

		it('keeps only ids from the candidate list, each once, in the order of the model', async () => {
			const candidates = [product(1), product(2), product(3)];
			const { service, askJson } = setup(candidates);
			askJson.mockResolvedValue({
				picks: [
					{ id: String(candidates[2]._id), reason: 'Fits the budget.' },
					{ id: String(new ObjectId()), reason: 'A product that is not in the shop.' },
					{ id: 'not-an-id', reason: 'Made up.' },
					{ id: String(candidates[0]._id), reason: 'A classic.' },
					{ id: String(candidates[2]._id), reason: 'The same one again.' },
					{ reason: 'No id at all.' },
					null,
				],
			});
			const result = await service.giftRecommend(memberId, { prompt: 'a gift' });
			expect(result.aiUsed).toBe(true);
			expect(result.list.map((pick) => pick.product._id)).toEqual([candidates[2]._id, candidates[0]._id]);
			expect(result.list.map((pick) => pick.reason)).toEqual(['Fits the budget.', 'A classic.']);
		});

		it('returns five picks at most and shortens a long reason', async () => {
			const candidates = Array.from({ length: 8 }, (_, n) => product(n));
			const { service, askJson } = setup(candidates);
			askJson.mockResolvedValue({
				picks: candidates.map((candidate) => ({ id: String(candidate._id), reason: 'word '.repeat(100) })),
			});
			const result = await service.giftRecommend(memberId, { prompt: 'a gift' });
			expect(result.list).toHaveLength(5);
			expect(result.list[0].reason.length).toBeLessThanOrEqual(200);
			expect(result.list[0].reason.endsWith('…')).toBe(true);
		});

		it('says so when the model picked nothing usable', async () => {
			const { service, askJson } = setup([product(1)]);
			askJson.mockResolvedValue({ picks: 'not a list' });
			const result = await service.giftRecommend(memberId, { prompt: 'a gift' });
			expect(result.list).toEqual([]);
			expect(result.message).toBeTruthy();
		});

		it('falls back to the most popular matching products when the model fails', async () => {
			const candidates = Array.from({ length: 7 }, (_, n) => product(n));
			const { service, askJson } = setup(candidates);
			askJson.mockRejectedValue(new AiFailure('the request timed out'));
			const result = await service.giftRecommend(memberId, { prompt: 'a gift' });
			expect(result.aiUsed).toBe(false);
			expect(result.message).toBeTruthy();
			expect(result.list.map((pick) => pick.product._id)).toEqual(candidates.slice(0, 5).map((c) => c._id));
			expect(result.list.every((pick) => pick.reason === '')).toBe(true);
		});
	});

	describe('cardMessages', () => {
		const input = { occasion: ProductOccasion.BIRTHDAY, recipient: 'my mother', tone: AiCardTone.WARM };

		it('returns three messages, none over 200 characters, without repeats', async () => {
			const { service, askJson } = setup();
			askJson.mockResolvedValue({
				messages: [
					'Happy birthday, Mum.',
					'Happy birthday, Mum.',
					'long '.repeat(80),
					42,
					'  With all my love.  ',
					'A fifth one.',
				],
			});
			const result = await service.cardMessages(memberId, input);
			expect(result.list).toHaveLength(3);
			expect(result.list[0]).toBe('Happy birthday, Mum.');
			expect(result.list[1].length).toBeLessThanOrEqual(200);
			expect(result.list[2]).toBe('With all my love.');
		});

		it('asks for the chosen language, English when none is given', async () => {
			const { service, askJson } = setup();
			askJson.mockResolvedValue({ messages: ['One.', 'Two.', 'Three.'] });
			await service.cardMessages(memberId, input);
			await service.cardMessages(memberId, { ...input, language: AiLanguage.KOREAN });
			expect(askJson.mock.calls[0][0].system).toContain('Language: English.');
			expect(askJson.mock.calls[1][0].system).toContain('Language: Korean.');
		});

		it('answers with a clear error when the model fails or returns nothing usable', async () => {
			const { service, askJson } = setup();
			askJson.mockRejectedValueOnce(new AiFailure('the API answered 500'));
			await expect(service.cardMessages(memberId, input)).rejects.toThrow(ServiceUnavailableException);
			askJson.mockResolvedValueOnce({ messages: [] });
			await expect(service.cardMessages(memberId, input)).rejects.toThrow(Message.AI_UNAVAILABLE);
		});
	});

	describe('productDescription', () => {
		const input = {
			title: 'Coral Tulip Bouquet',
			type: ProductType.BOUQUET,
			occasion: ProductOccasion.CONGRATS,
			size: ProductSize.MEDIUM,
		};

		it('returns one description that fits the product field', async () => {
			const { service, askJson } = setup();
			askJson.mockResolvedValue({ description: 'Coral tulips,\n cut the same morning. '.repeat(30) });
			const result = await service.productDescription(memberId, input);
			expect(result.text.length).toBeLessThanOrEqual(500);
			expect(result.text).not.toContain('\n');
		});

		it('answers with a clear error when the description is missing or too short', async () => {
			const { service, askJson } = setup();
			askJson.mockResolvedValueOnce({ description: 'Nice.' });
			await expect(service.productDescription(memberId, input)).rejects.toThrow(ServiceUnavailableException);
			askJson.mockResolvedValueOnce({});
			await expect(service.productDescription(memberId, input)).rejects.toThrow(Message.AI_UNAVAILABLE);
			askJson.mockRejectedValueOnce(new Error('anything'));
			await expect(service.productDescription(memberId, input)).rejects.toThrow(Message.AI_UNAVAILABLE);
		});
	});

	describe('rate limit', () => {
		afterEach(() => jest.restoreAllMocks());

		it('refuses a member after ten requests in a minute, over all three features, and lets them in again later', async () => {
			let now = 1_000_000;
			jest.spyOn(Date, 'now').mockImplementation(() => now);
			const { service, askJson } = setup();
			askJson.mockResolvedValue({ messages: ['One.', 'Two.', 'Three.'] });
			const card = { occasion: ProductOccasion.LOVE, recipient: 'my wife', tone: AiCardTone.ROMANTIC };

			for (let i = 0; i < AI_RATE_LIMIT - 1; i++) await service.cardMessages(memberId, card);
			await service.giftRecommend(memberId, { prompt: 'a gift' });
			const calls = askJson.mock.calls.length;

			const refused: unknown = await service.cardMessages(memberId, card).catch((err: unknown) => err);
			expect(refused).toBeInstanceOf(HttpException);
			expect((refused as HttpException).getStatus()).toBe(429);
			expect((refused as HttpException).message).toBe(Message.AI_TOO_MANY_REQUESTS);
			expect(askJson.mock.calls.length).toBe(calls);

			// another member is not affected
			await expect(service.cardMessages(new ObjectId(), card)).resolves.toBeTruthy();

			now += AI_RATE_WINDOW_MS + 1;
			await expect(service.cardMessages(memberId, card)).resolves.toBeTruthy();
		});
	});
});
