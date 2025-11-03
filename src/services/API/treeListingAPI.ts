import axiosClient from "../axiosClient"
import { buildQuery } from "../../utils/helpers/queryHelpers"
import type {
	GetTreeListingsParams,
	TreeListingListResponse,
	TreeListingDetailResponse,
} from "../../types/apiResponse/treeListingResponse"

// GET /api/TreeListing
// Behaviors:
// - When called with generic paging filters: returns a paged list response
// - When called with a specific postId (and likely includeTree true/false depending on backend): returns a single detail object
export const getTreeListings = async (params: GetTreeListingsParams = {}) => {
	const query = buildQuery({
		treeListingId: params.treeListingId,
		farmerId: params.farmerId,
		postId: params.postId,
		includeTree: params.includeTree,
		page: params.page,
		pageSize: params.pageSize,
	})

	if (params.postId || params.treeListingId) {
		return axiosClient.get<TreeListingDetailResponse>(`/TreeListing${query}`)
	}
	return axiosClient.get<TreeListingListResponse>(`/TreeListing${query}`)
}

// Convenience: fetch by postId
export const getTreeListingByPostId = async (postId: number, includeTree = false) => {
	const query = buildQuery({ postId, includeTree })
	return axiosClient.get<TreeListingDetailResponse>(`/TreeListing${query}`)
}

// Convenience: fetch by listingId
export const getTreeListingById = async (treeListingId: number, includeTree = false) => {
	const query = buildQuery({ treeListingId, includeTree })
	return axiosClient.get<TreeListingDetailResponse>(`/TreeListing${query}`)
}

export default {
	getTreeListings,
	getTreeListingByPostId,
	getTreeListingById,
}

