export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	PREPARING = 'PREPARING',
	OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
}

// the way an order moves forward; CANCELLED is outside it
export const orderStatusFlow: OrderStatus[] = [
	OrderStatus.PENDING,
	OrderStatus.CONFIRMED,
	OrderStatus.PREPARING,
	OrderStatus.OUT_FOR_DELIVERY,
	OrderStatus.DELIVERED,
];

// a florist or an admin may cancel until the order leaves the shop
export const cancellableOrderStatuses: OrderStatus[] = [
	OrderStatus.PENDING,
	OrderStatus.CONFIRMED,
	OrderStatus.PREPARING,
];

export const orderStatusLabels: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'Placed',
	[OrderStatus.CONFIRMED]: 'Confirmed',
	[OrderStatus.PREPARING]: 'Preparing',
	[OrderStatus.OUT_FOR_DELIVERY]: 'Out for delivery',
	[OrderStatus.DELIVERED]: 'Delivered',
	[OrderStatus.CANCELLED]: 'Cancelled',
};
