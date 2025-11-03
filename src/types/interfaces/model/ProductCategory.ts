// Frontend model mapped from backend EF Core ProductCategory entity
export interface ProductCategory {
	categoryId: number
	name: string
	slug: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}
