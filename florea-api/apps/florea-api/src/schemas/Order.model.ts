import { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';

const OrderSchema = new Schema(
	{
		// what the buyer pays: the items plus the delivery fee
		orderTotal: {
			type: Number,
			required: true,
		},

		orderDelivery: {
			type: Number,
			required: true,
		},

		orderStatus: {
			type: String,
			enum: OrderStatus,
			default: OrderStatus.PENDING,
		},

		recipientName: {
			type: String,
			required: true,
		},

		recipientPhone: {
			type: String,
			required: true,
		},

		deliveryAddress: {
			type: String,
			required: true,
		},

		deliveryDate: {
			type: Date,
			required: true,
		},

		deliveryTime: {
			type: String,
		},

		cardMessage: {
			type: String,
		},

		// the buyer
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// the florist whose products are in the order (one order holds one florist's products)
		agentId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'orders' },
);

OrderSchema.index({ memberId: 1, createdAt: -1 });
OrderSchema.index({ agentId: 1, createdAt: -1 });

export default OrderSchema;
