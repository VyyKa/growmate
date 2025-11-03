// Frontend model mapped from backend EF Core ProductType entity
export interface ProductType {
	productTypeId: number
	name: string
	slug: string
	description: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}
