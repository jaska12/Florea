import { Schema } from 'mongoose';
import { ProductLocation, ProductOccasion, ProductSize, ProductStatus, ProductType } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
    {
        productType: {
            type: String,
            enum: ProductType,
            required: true,
        },

        productStatus: {
            type: String,
            enum: ProductStatus,
            default: ProductStatus.ACTIVE,
        },

        productLocation: {
            type: String,
            enum: ProductLocation,
            required: true,
        },

        productAddress: {
            type: String,
            required: true,
        },

        productTitle: {
            type: String,
            required: true,
        },

        productPrice: {
            type: Number,
            required: true,
        },

        productOccasion: {
            type: String,
            enum: ProductOccasion,
            required: true,
        },

        productSize: {
            type: String,
            enum: ProductSize,
            required: true,
        },

        productStock: {
            type: Number,
            required: true,
        },

        productLikes: {
            type: Number,
            default: 0,
        },

        productViews: {
            type: Number,
            default: 0,
        },

        productComments: {
            type: Number,
            default: 0,
        },

        productRank: {
            type: Number,
            default: 0,
        },

        productImages: {
            type: [String],
            required: true,
        },

        productDesc: {
            type: String,
        },

        productSameDay: {
            type: Boolean,
            default: false,
        },

        productGiftWrap: {
            type: Boolean,
            default: false,
        },

        memberId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Member',
        },

        soldAt: {
            type: Date,
        },

        deletedAt: {
            type: Date,
        },
    },
    { timestamps: true, collection: 'products' },
);

ProductSchema.index(
    { productType: 1, productLocation: 1, productTitle: 1, productPrice: 1 },
    { unique: true },
);

export default ProductSchema;
