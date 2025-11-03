import type { Order } from "./Order"

// Frontend model mapped from backend EF Core Shipment entity
// Field names are camelCased to follow TS conventions
export interface Shipment {
	shipmentId: number
	orderId: number

	carrier: string
	trackingNumber: string
	status: string

	shippedAt: string | null
	deliveredAt: string | null

	createdAt: string
	updatedAt: string

	// Navigation property (optional depending on API expansion)
	order?: Order
}
