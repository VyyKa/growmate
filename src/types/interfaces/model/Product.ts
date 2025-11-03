// Frontend model mapped from backend EF Core Product entity
export interface Product {
	productId: number
	farmerId: number
	categoryId: number | null
	productTypeId: number | null
	unitId: number | null
	name: string
	slug: string
	description: string
	price: number
	stock: number
	status: string
	createdAt: string
	updatedAt: string
}
