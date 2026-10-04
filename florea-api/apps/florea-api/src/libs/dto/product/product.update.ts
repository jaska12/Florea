import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, IsInt, Min } from 'class-validator';
import { ProductLocation, ProductOccasion, ProductSize, ProductStatus, ProductType } from '../../enums/product.enum';
import { ObjectId } from 'bson';

@InputType()
export class ProductUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(() => ProductType, { nullable: true })
    productType?: ProductType;

    @IsOptional()
    @Field(() => ProductStatus, { nullable: true })
    productStatus?: ProductStatus;

    @IsOptional()
    @Field(() => ProductLocation, { nullable: true })
    productLocation?: ProductLocation;

    @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true })
    productAddress?: string;

    @IsOptional()
    @Length(3, 100)
    @Field(() => String, { nullable: true })
    productTitle?: string;

    @IsOptional()
    @Field(() => Number, { nullable: true })
    productPrice?: number;

    @IsOptional()
    @Field(() => ProductOccasion, { nullable: true })
    productOccasion?: ProductOccasion;

    @IsOptional()
    @Field(() => ProductSize, { nullable: true })
    productSize?: ProductSize;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Field(() => Int, { nullable: true })
    productStock?: number;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    productImages?: string[];

    @IsOptional()
    @Length(5, 500)
    @Field(() => String, { nullable: true })
    productDesc?: string;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    productSameDay?: boolean;

    @IsOptional()
    @Field(() => Boolean, { nullable: true })
    productGiftWrap?: boolean;

soldAt?: Date;
    deletedAt?: Date;
}
