import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'bson';
import { AiService } from './ai.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { AiCardMessages, AiGiftRecommendation, AiProductDescription } from '../../libs/dto/ai/ai';
import { AiCardMessageInput, AiGiftRecommendInput, AiProductDescriptionInput } from '../../libs/dto/ai/ai.input';

// Every AI operation needs a logged-in member: the requests cost money and are counted per member.
@Resolver()
export class AiResolver {
	constructor(private readonly aiService: AiService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => AiGiftRecommendation)
	public async aiGiftRecommend(
		@Args('input') input: AiGiftRecommendInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AiGiftRecommendation> {
		console.log('Mutation: aiGiftRecommend');
		return await this.aiService.giftRecommend(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => AiCardMessages)
	public async aiCardMessage(
		@Args('input') input: AiCardMessageInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AiCardMessages> {
		console.log('Mutation: aiCardMessage');
		return await this.aiService.cardMessages(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => AiProductDescription)
	public async aiProductDescription(
		@Args('input') input: AiProductDescriptionInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AiProductDescription> {
		console.log('Mutation: aiProductDescription');
		return await this.aiService.productDescription(memberId, input);
	}
}
