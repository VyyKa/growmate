import type { ListingStatus as PostStatus } from "../../enums/ListingStatus"
import type { UnitEnum } from "../../enums/UnitEnum"

/** Bảng posts */
export interface Post {
  postId: number
  farmerId: number
  productName: string
  productType: string
  productVariety?: string | null
  farmName: string
  origin?: string | null
  pricePerYear: number
  harvestWeight?: number | null
  unit: UnitEnum
  harvestFrequency: number
  treeQuantity: number
  description?: string | null
  status: PostStatus
  createdAt: string
  updatedAt: string
}
