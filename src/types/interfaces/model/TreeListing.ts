import type { ListingStatus } from "../../enums/ListingStatus"

/** Bảng tree_listings */
export interface TreeListing {
  listingId: number
  postId: number
  farmerId: number
  pricePerTree: number
  totalQuantity: number
  availableQuantity: number
  status: ListingStatus
  createdAt: string
  updatedAt: string
}
