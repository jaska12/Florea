import { ProductLocation, ProductOccasion, ProductSize, ProductStatus, ProductType } from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productType?: ProductType;
	productStatus?: ProductStatus;
	productLocation?: ProductLocation;
	productAddress?: string;
	productTitle?: string;
	productPrice?: number;
	productOccasion?: ProductOccasion;
	productSize?: ProductSize;
	productStock?: number;
	productImages?: string[];
	productDesc?: string;
	productSameDay?: boolean;
	productGiftWrap?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
}
