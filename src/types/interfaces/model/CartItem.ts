// Frontend model mapped from backend EF Core CartItem entity
// Navigation properties are intentionally omitted
// Field names are camelCased to follow TS conventions
export interface CartItem {
	cartItemId: number
	cartId: number

	productId: number | null
	quantity: number
	unitPrice: number
	createdAt: string

	listingId: number | null
	treeQuantity: number | null
	treeUnitPrice: number | null
	treeYears: number | null
}
