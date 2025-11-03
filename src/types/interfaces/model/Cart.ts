import type { CartItem } from "./CartItem"

// Frontend model mapped from backend EF Core Cart entity
// Field names are camelCased to follow TS conventions
export interface Cart {
	cartId: number
	customerId: number
	status: string
	createdAt: string
	updatedAt: string

	// Navigation properties (optional depending on API shape)
	cartItems?: CartItem[]
}
