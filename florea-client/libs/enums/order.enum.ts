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

// The names of the statuses are translated: useEnumLabel()('orderStatus', value), from common.json.
