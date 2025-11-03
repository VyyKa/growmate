import type { MediaType } from "../../enums/MediaType"

/** Bảng media */
export interface Media {
  mediaId: number
  postId?: number | null
  reportId?: number | null
  productId?: number | null
  mediaUrl: string
  mediaType: MediaType
  isPrimary: boolean
  createdAt: string | null
  updatedAt: string | null
}
