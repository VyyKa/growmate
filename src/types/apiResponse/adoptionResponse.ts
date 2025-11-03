// Query params for GET /Adoption
export type GetAdoptionsQuery = {
	customerId?: number
	farmerId?: number
	orderId?: number
	page?: number
	pageSize?: number
}

// One adoption item in the list for the current user
export type AdoptionListItem = {
	adoptionId: number
	treeId: number
	listingId: number
	farmerId: number
	treeName: string
	farmerName: string
	uniqueCode: string
	description: string
	coordinates: string
	healthStatus: string
	availabilityStatus: string
	startDate: string
	endDate: string
	status: string
	createdAt: string
	primaryImageUrl: string
	pricePerYear: number
	years: number
	totalPrice: number
	postCode: string
}

// Paged response (plain, no envelope)
export type AdoptionPaged = {
	items: AdoptionListItem[]
	totalItems: number
	pageNumber: number
	pageSize: number
	totalPages: number
}

// Detail = same shape as list item for this API
export type AdoptionDetail = AdoptionListItem

// Update adoption payload (PUT /Adoption/{adoptionId})
export type UpdateAdoptionPayload = {
	startDate?: string
	endDate?: string
	primaryImageUrl?: string
}

// Common message response returned by mutation endpoints
export type MessageResponse = { message: string; success?: boolean }

// Back-compat named exports
export type UpdateAdoptionResponse = MessageResponse
export type DeleteAdoptionResponse = MessageResponse
export type UpdateAdoptionStatusResponse = MessageResponse

// Update adoption status payload (PUT /Adoption/{adoptionId}/status)
export type UpdateAdoptionStatusPayload = {
	status: string
}

export default {} as const

