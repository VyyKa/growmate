import type { Tree } from "../interfaces/model/Tree"

// Item shape for Tree list responses. Starts from base model and allows
// optional denormalized display fields that backend may include.
export type TreeItem = Tree & {
	treeName?: string | null
	farmerName?: string | null
	primaryImageUrl?: string | null
}

export type TreeListResponse = {
	items: TreeItem[]
	totalItems: number
	pageNumber: number
	pageSize: number
	totalPages: number
}

export type GetTreesParams = {
	treeId?: number
	farmerId?: number
	listingId?: number
	page?: number
	pageSize?: number
}

