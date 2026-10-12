import { Schema } from 'mongoose';

const OrderItemSchema = new Schema(
	{
		itemQuantity: {
			type: Number,
			required: true,
		},

		// the price of one piece when the order was placed
		itemPrice: {
			type: Number,
			required: true,
		},

		orderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Order',
		},

		productId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Product',
		},
	},
	{ timestamps: true, collection: 'orderItems' },
);

OrderItemSchema.index({ orderId: 1 });

export default OrderItemSchema;
