import { Field, Float, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, IsArray, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { AiCardTone, AiLanguage } from '../../enums/ai.enum';

@InputType()
export class AiGiftRecommendInput {
	@IsNotEmpty()
	@Length(2, 300)
	@Field(() => String)
	prompt: string;

	@IsOptional()
	@Min(1)
	@Max(100000)
	@Field(() => Float, { nullable: true })
	budgetMax?: number;

	@IsOptional()
	@Field(() => ProductOccasion, { nullable: true })
	occasion?: ProductOccasion;

	@IsOptional()
	@Field(() => ProductSize, { nullable: true })
	size?: ProductSize;

	/** what the member wrote earlier in the same conversation, oldest first, so that "something cheaper" makes sense **/
	@IsOptional()
	@IsArray()
	@ArrayMaxSize(6)
	@IsString({ each: true })
	@MaxLength(300, { each: true })
	@Field(() => [String], { nullable: true })
	history?: string[];
}

@InputType()
export class AiCardMessageInput {
	@IsNotEmpty()
	@Field(() => ProductOccasion)
	occasion: ProductOccasion;

	/** who the card is for, in the sender's words: "my mother", "a colleague who is leaving" **/
	@IsNotEmpty()
	@Length(2, 60)
	@Field(() => String)
	recipient: string;

	@IsNotEmpty()
	@Field(() => AiCardTone)
	tone: AiCardTone;

	@IsOptional()
	@Field(() => AiLanguage, { nullable: true })
	language?: AiLanguage;
}

@InputType()
export class AiProductDescriptionInput {
	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	title: string;

	@IsNotEmpty()
	@Field(() => ProductType)
	type: ProductType;

	@IsNotEmpty()
	@Field(() => ProductOccasion)
	occasion: ProductOccasion;

	@IsNotEmpty()
	@Field(() => ProductSize)
	size: ProductSize;

	/** what the florist wants mentioned: flowers used, colours, what is in the box **/
	@IsOptional()
	@Length(0, 300)
	@Field(() => String, { nullable: true })
	notes?: string;
}
