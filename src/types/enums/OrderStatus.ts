// Backend returns uppercase status strings. Keep const object for ergonomic access and a typed union.
export const OrderStatus = {
	PENDING: 'PENDING',
	PROCESSING: 'PROCESSING',
	SHIPPED: 'SHIPPED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
} as const

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]
