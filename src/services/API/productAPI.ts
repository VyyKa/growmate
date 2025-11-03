import axiosClient from "../axiosClient"
import { buildQuery } from "../../utils/helpers/queryHelpers"
import type { 
	ApprovedProductListResponse, 
	PendingProductListResponse, 
	GetApprovedProductsParams, 
	ProductDetail, 
	CreateProductPayload, 
	UpdateProductPayload, 
	CreateProductResponse, 
	UpdateProductResponse 
} from "../../types/apiResponse/productResponse"

// GET /api/products/approved
// Public endpoint: list all approved products (paged)
export const getApprovedProducts = async (params: GetApprovedProductsParams = {}) => {
	const query = buildQuery({
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 12,
	})
	return axiosClient.get<ApprovedProductListResponse>(`/products/approved${query}`)
}

// GET /api/products/pending (Admin only)
export const getPendingProducts = async (params: GetApprovedProductsParams = {}) => {
	const query = buildQuery({
		page: params.page ?? 1,
		pageSize: params.pageSize ?? 12,
	})
	return axiosClient.get<PendingProductListResponse>(`/products/pending${query}`)
}

// GET /api/products/{id}
// Public endpoint: product detail (non-approved hidden unless admin per backend rule)
export const getProductById = async (id: number) => {
  return axiosClient.get<ProductDetail>(`/products/${id}`)
}

// POST /api/products (Farmer only) - create product (auto PENDING)
export const createProduct = async (payload: CreateProductPayload) => {
	return axiosClient.post<CreateProductResponse>(`/products`, payload)
}

// PUT /api/products/{id} (Farmer only) - update product + media
export const updateProduct = async (id: number, payload: UpdateProductPayload) => {
	return axiosClient.put<UpdateProductResponse>(`/products/${id}`, payload)
}

// DELETE /api/products/{id} (Farmer or Admin)
export const deleteProduct = async (id: number) => {
	return axiosClient.delete<void>(`/products/${id}`)
}

// PUT /api/products/{id}/status?status=APPROVE|REJECT|CANCEL (Admin only)
export const updateProductStatus = async (id: number, status: string) => {
	return axiosClient.put<ProductDetail>(`/products/${id}/status`, undefined, { params: { status } })
}

export default {
	getApprovedProducts,
	getPendingProducts,
  getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	updateProductStatus,
}

