// Types for Product approved list API response
import type { Product as ProductModel } from "../interfaces/model/Product"
import type { Media } from "../interfaces/model/Media"

// Item in product listing responses (subset of model with extra display fields)
export type ProductItem =
  Pick<ProductModel, "productId" | "name" | "slug" | "price" | "stock" | "status"> & {
    categoryName: string
    unitName: string
    productTypeName: string
    farmerName: string
    mainImageUrl: string | null
  }

// Detailed product (single) response shape
export type ProductDetail =
  ProductItem &
  Pick<ProductModel, "farmerId" | "description" | "categoryId" | "productTypeId" | "unitId" | "createdAt" | "updatedAt"> & {
    media: Media[]
  }

export type ProductListResponse = {
  items: ProductItem[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

// Backwards compat alias (approved list)
export type ApprovedProductListResponse = ProductListResponse
export type PendingProductListResponse = ProductListResponse

export type GetProductsParams = {
  page?: number
  pageSize?: number
}

// Backwards compat alias for earlier usage
export type GetApprovedProductsParams = GetProductsParams

// ---- Create / Update product payloads ----
export type ProductMediaInput = {
  mediaUrl: string
  mediaType: string
}

export type CreateOrUpdateProductPayload = {
  farmerId: number
  categoryId: number
  productTypeId: number
  unitId: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  media?: ProductMediaInput[]
}

export type CreateProductPayload = CreateOrUpdateProductPayload
export type UpdateProductPayload = CreateOrUpdateProductPayload
export type CreateProductResponse = ProductDetail
export type UpdateProductResponse = ProductDetail
