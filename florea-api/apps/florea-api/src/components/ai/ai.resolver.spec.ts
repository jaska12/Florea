// The guards pull in the auth service and, through it, modules Jest cannot load; here they only need to be classes.
jest.mock('../auth/guards/auth.guard', () => ({ AuthGuard: class AuthGuard {} }));
jest.mock('../auth/guards/roles.guard', () => ({ RolesGuard: class RolesGuard {} }));

import { ObjectId } from 'bson';
import { AiResolver } from './ai.resolver';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { ProductOccasion, ProductSize, ProductType } from '../../libs/enums/product.enum';
import { AiCardTone } from '../../libs/enums/ai.enum';

// The AiService is a mock: the resolver is checked for what it passes on and for who may call it.
describe('AiResolver', () => {
	const memberId = new ObjectId();
	const aiService = {
		giftRecommend: jest.fn().mockResolvedValue({ list: [], aiUsed: true }),
		cardMessages: jest.fn().mockResolvedValue({ list: ['One.', 'Two.', 'Three.'] }),
		productDescription: jest.fn().mockResolvedValue({ text: 'A description.' }),
	};
	const resolver = new AiResolver(aiService as unknown as AiService);
	// what the decorators left on a method of the resolver
	const metadata = (key: string, method: keyof AiResolver): unknown =>
		Reflect.getMetadata(key, Object.getOwnPropertyDescriptor(AiResolver.prototype, method)?.value as object);
	const guardsOf = (method: keyof AiResolver): unknown => metadata('__guards__', method);
	const rolesOf = (method: keyof AiResolver): unknown => metadata('roles', method);

	it('passes the member and the input on to the service', async () => {
		const gift = { prompt: 'a gift for a friend', budgetMax: 40 };
		await expect(resolver.aiGiftRecommend(gift, memberId)).resolves.toEqual({ list: [], aiUsed: true });
		expect(aiService.giftRecommend).toHaveBeenCalledWith(memberId, gift);

		const card = { occasion: ProductOccasion.WEDDING, recipient: 'my sister', tone: AiCardTone.WARM };
		await expect(resolver.aiCardMessage(card, memberId)).resolves.toEqual({ list: ['One.', 'Two.', 'Three.'] });
		expect(aiService.cardMessages).toHaveBeenCalledWith(memberId, card);

		const desc = {
			title: 'White Orchid',
			type: ProductType.PLANT,
			occasion: ProductOccasion.ANNIVERSARY,
			size: ProductSize.MEDIUM,
		};
		await expect(resolver.aiProductDescription(desc, memberId)).resolves.toEqual({ text: 'A description.' });
		expect(aiService.productDescription).toHaveBeenCalledWith(memberId, desc);
	});

	it('needs a logged-in member for the gift assistant and the card messages', () => {
		expect(guardsOf('aiGiftRecommend')).toEqual([AuthGuard]);
		expect(guardsOf('aiCardMessage')).toEqual([AuthGuard]);
	});

	it('lets only florists generate a product description', () => {
		expect(guardsOf('aiProductDescription')).toEqual([RolesGuard]);
		expect(rolesOf('aiProductDescription')).toEqual([MemberType.AGENT]);
	});
});
