import { ProductOccasion } from '../../enums/product.enum';
import { Product } from '../product/product';

export interface AiGiftPick {
	product: Product;
	/** one sentence from the assistant; empty when the picks are not from the assistant **/
	reason: string;
}

export interface AiGiftRecommendation {
	list: AiGiftPick[];
	/** false when the assistant could not answer and the list is the most popular matching products **/
	aiUsed: boolean;
	message?: string | null;
}

/** one request to the gift assistant and what came back, as the panel shows it **/
export interface GiftTurn {
	id: number;
	prompt: string;
	budgetMax?: number;
	occasion?: ProductOccasion;
	status: 'loading' | 'done' | 'error';
	result?: AiGiftRecommendation;
	error?: string;
}
