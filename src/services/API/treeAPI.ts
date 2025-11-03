import axiosClient from "../axiosClient"
import { buildQuery } from "../../utils/helpers/queryHelpers"
import type { GetTreesParams, TreeListResponse } from "../../types/apiResponse/treeResponse"

// GET /api/Tree
// Supports filters: listingId, farmerId, (optionally treeId), and paging
export const getTrees = async (params: GetTreesParams = {}) => {
	const query = buildQuery({
		treeId: params.treeId,
		listingId: params.listingId,
		farmerId: params.farmerId,
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 10,
	})
	return axiosClient.get<TreeListResponse>(`/Tree${query}`)
}

// Convenience helpers
export const getTreesByListingId = async (
	listingId: number,
	page?: number,
	pageSize?: number
) => {
	const query = buildQuery({ listingId, page, pageSize })
	return axiosClient.get<TreeListResponse>(`/Tree${query}`)
}

export const getTreesByFarmerId = async (
	farmerId: number,
	page?: number,
	pageSize?: number
) => {
	const query = buildQuery({ farmerId, page, pageSize })
	return axiosClient.get<TreeListResponse>(`/Tree${query}`)
}

export default {
	getTrees,
	getTreesByListingId,
	getTreesByFarmerId,
}

