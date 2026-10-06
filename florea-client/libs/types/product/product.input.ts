import { ProductLocation, ProductOccasion, ProductSize, ProductStatus, ProductType } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	productType: ProductType;
	productLocation: ProductLocation;
	productAddress: string;
	productTitle: string;
	productPrice: number;
	productOccasion: ProductOccasion;
	productSize: ProductSize;
	productStock: number;
	productImages: string[];
	productDesc?: string;
	productSameDay?: boolean;
	productGiftWrap?: boolean;
	memberId?: string;
}

interface PISearch {
	memberId?: string;
	locationList?: ProductLocation[];
	typeList?: ProductType[];
	occasionList?: ProductOccasion[];
	options?: string[];
	sizeList?: ProductSize[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface AgentProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productLocationList?: ProductLocation[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
