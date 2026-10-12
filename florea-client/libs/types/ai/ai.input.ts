import { ProductOccasion, ProductSize, ProductType } from '../../enums/product.enum';
import { AiCardTone, AiLanguage } from '../../enums/ai.enum';

export interface AiGiftRecommendInput {
	prompt: string;
	budgetMax?: number;
	occasion?: ProductOccasion;
	size?: ProductSize;
}

export interface AiCardMessageInput {
	occasion: ProductOccasion;
	recipient: string;
	tone: AiCardTone;
	language?: AiLanguage;
}

export interface AiProductDescriptionInput {
	title: string;
	type: ProductType;
	occasion: ProductOccasion;
	size: ProductSize;
	notes?: string;
}
