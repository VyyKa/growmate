// Types for Post list API response

export type PostItem = {
	postId: number
	farmerId: number
	productName: string
	productType: string
	productVariety: string
	farmName: string
	origin: string
	pricePerYear: number
	harvestWeight: number
	unit: string
	harvestFrequency: number
	treeQuantity: number
	description: string
	status: string
	createdAt: string
	updatedAt: string
	primaryImageUrl?: string
	mainImageUrl?: string
	farmer?: unknown | null
	media?: unknown[]
	postComments?: unknown[]
	treeListing?: unknown | null
	mediaPostList?: unknown[]
	postCommentList?: unknown[]
}

export type PostListResponse = {
	items: PostItem[]
	totalItems: number
	pageNumber: number
	pageSize: number
	totalPages: number
}

export type GetPostsParams = {
	postId?: number
	farmerId?: number
	status?: string
	page?: number
	pageSize?: number
}

// ---- Create Post payload types ----
export type CreateMediaPostRequest = {
	mediaUrl: string
	mediaType: string
}

export type CreatePostPayload = {
	farmerId: number
	productName: string
	productType: string
	productVariety: string
	farmName: string
	origin: string
	pricePerYear: number
	harvestWeight: number
	unit: string
	harvestFrequency: number
	treeQuantity: number
	description: string
	media: CreateMediaPostRequest[]
}

export type CreatePostResponse = PostItem 
export type UpdatePostPayload = CreatePostPayload
export type UpdatePostResponse = PostItem
