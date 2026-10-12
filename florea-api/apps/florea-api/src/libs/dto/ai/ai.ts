import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product';

@ObjectType()
export class AiGiftPick {
	@Field(() => Product)
	product: Product;

	/** one sentence from the assistant; empty when the picks are not from the assistant **/
	@Field(() => String)
	reason: string;
}

@ObjectType()
export class AiGiftRecommendation {
	@Field(() => [AiGiftPick])
	list: AiGiftPick[];

	/** false when the assistant could not answer and the list is the most popular matching products **/
	@Field(() => Boolean)
	aiUsed: boolean;

	/** a line for the customer when there is something to explain (nothing matched, the assistant is down) **/
	@Field(() => String, { nullable: true })
	message?: string;
}

@ObjectType()
export class AiCardMessages {
	@Field(() => [String])
	list: string[];
}

@ObjectType()
export class AiProductDescription {
	@Field(() => String)
	text: string;
}
