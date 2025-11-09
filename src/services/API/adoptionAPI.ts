import axiosClient from "../axiosClient"
import type { AdoptionPaged, GetAdoptionsQuery, AdoptionDetail, UpdateAdoptionPayload, MessageResponse, UpdateAdoptionStatusPayload } from "../../types/apiResponse/adoptionResponse"

const ADOPTION_BASE_URL = "/Adoption"

/**
 * Get adoptions with optional filters (paged)
 * Accepts: customerId, farmerId, orderId, postId, page, pageSize
 */
export const getAdoptions = async (params?: GetAdoptionsQuery): Promise<AdoptionPaged> => {
	const res = await axiosClient.get(ADOPTION_BASE_URL, { params })
	const raw = res.data
	const paged: AdoptionPaged = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as AdoptionPaged) : (raw as AdoptionPaged)
	return paged
}

export const getAdoptionById = async (adoptionId: number): Promise<AdoptionDetail> => {
	const res = await axiosClient.get(`${ADOPTION_BASE_URL}/${adoptionId}`)
	const raw = res.data
	const detail: AdoptionDetail = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as AdoptionDetail) : (raw as AdoptionDetail)
	return detail
}

// Get adoption detail with reports and payments
export const getAdoptionDetail = async (adoptionId: number): Promise<AdoptionDetail> => {
	const res = await axiosClient.get(`${ADOPTION_BASE_URL}/${adoptionId}/detail`)
	const raw = res.data
	const detail: AdoptionDetail = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as AdoptionDetail) : (raw as AdoptionDetail)
	return detail
}

export const updateAdoption = async (adoptionId: number, data: UpdateAdoptionPayload): Promise<MessageResponse> => {
	const res = await axiosClient.put(`${ADOPTION_BASE_URL}/${adoptionId}`, data)
	const raw = res.data
	const msg: MessageResponse = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as MessageResponse) : (raw as MessageResponse)
	return msg
}

export const deleteAdoption = async (adoptionId: number): Promise<MessageResponse> => {
	const res = await axiosClient.delete(`${ADOPTION_BASE_URL}/${adoptionId}`)
	const raw = res.data
	const msg: MessageResponse = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as MessageResponse) : (raw as MessageResponse)
	return msg
}

export const updateAdoptionStatus = async (adoptionId: number, data: UpdateAdoptionStatusPayload): Promise<MessageResponse> => {
	const res = await axiosClient.put(`${ADOPTION_BASE_URL}/${adoptionId}/status`, data)
	const raw = res.data
	const msg: MessageResponse = raw && typeof raw === 'object' && 'data' in raw ? (raw.data as MessageResponse) : (raw as MessageResponse)
	return msg
}

export default {
	getAdoptions,
	getAdoptionById,
    getAdoptionDetail,
	updateAdoption,
	deleteAdoption,
	updateAdoptionStatus,
}

