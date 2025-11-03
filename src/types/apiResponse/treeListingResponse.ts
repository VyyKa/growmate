import type { TreeListing } from "../interfaces/model/TreeListing"
import type { Tree } from "../interfaces/model/Tree"

// List response when no specific filter (paged)
//! In list mode, backend returns nulls/empties for relations
export type TreeListingListItem = TreeListing & {
  cartItems: unknown[]
  farmer: unknown | null
  orderItems: unknown[]
  post: unknown | null
  trees: Tree[] | []
}

export type TreeListingListResponse = {
  items: TreeListingListItem[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// Detail response when querying by a specific postId (or id)
export type TreeListingDetailResponse = TreeListing & {
  treeResponses: Tree[] | []
}

export type GetTreeListingsParams = {
  treeListingId?: number
  farmerId?: number
  postId?: number
  includeTree?: boolean
  page?: number
  pageSize?: number
}
