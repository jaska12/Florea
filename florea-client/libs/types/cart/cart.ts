// One line of the cart. It is a copy of what the buyer saw, kept in the browser until the order is placed.
export interface CartItem {
	productId: string;
	productTitle: string;
	productPrice: number;
	productImage?: string;
	productStock: number;
	// the florist who sells it: products of one florist become one order
	agentId: string;
	agentNick?: string;
	quantity: number;
}

export interface CartGroup {
	agentId: string;
	agentNick?: string;
	items: CartItem[];
	subtotal: number;
	delivery: number;
	total: number;
}

export interface CartTotals {
	count: number;
	subtotal: number;
	delivery: number;
	total: number;
}
