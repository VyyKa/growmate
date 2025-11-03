// Frontend model mapped from backend EF Core OrderItem entity
// Navigation properties are intentionally omitted per request
// Field names are camelCased to follow TS conventions
export interface OrderItem {
	orderItemId: number
	orderId: number

	productId: number | null
	productName: string | null

	unitPrice: number
	quantity: number
	totalPrice: number | null

	createdAt: string

	listingId: number | null
	treeQuantity: number | null
	treeUnitPrice: number | null
	treeTotalPrice: number | null
	treeYears: number | null
}
