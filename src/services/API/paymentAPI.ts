import axiosClient from "../axiosClient"
import type {
	GetPaymentsParams,
	PaymentListResponse,
	PaymentResponse,
	CreatePaymentPayload,
	CreatePaymentResponse,
	PaymentDetailResponse,
	UpdatePaymentPayload,
	UpdatePaymentResponse,
	UpdatePaymentStatusPayload,
	UpdatePaymentStatusResponse,
	DeletePaymentResponse,
	CreatePaymentQrPayload,
	CreatePaymentQrResponse,
	SepayWebhookPayload,
	SepayWebhookResponse,
} from "../../types/apiResponse/paymentResponse"
import { isPaymentListResponse, isPaymentResponse, isMessageResponse} from "../../types/apiResponse/paymentResponse"

// GET /api/Payment - Get payments with optional filters (paged)
export async function getPayments(params: GetPaymentsParams = {}) {
	const res = await axiosClient.get<unknown>("/Payment", { params })
	const data = res.data

	// Normalize to paged shape if backend returns a single object
	if (isPaymentListResponse(data)) return res as unknown as { data: PaymentListResponse }
	if (isPaymentResponse(data)) {
		const single = data as PaymentResponse
		const pageNumber = params.page ?? 1
		const pageSize = params.pageSize ?? 10
		const normalized: PaymentListResponse = {
			items: [single],
			totalItems: 1,
			pageNumber,
			pageSize,
			totalPages: 1,
		}
		return { ...res, data: normalized }
	}

	// If the shape is unexpected, throw to let caller handle error
	throw new Error("Unexpected payment response shape")
}

// Convenience helpers
export async function getPaymentsByOrderId(orderId: number, page = 1, pageSize = 10) {
	return getPayments({ orderId, page, pageSize })
}

export async function getPaymentsByCustomerId(customerId: number, page = 1, pageSize = 10) {
	return getPayments({ customerId, page, pageSize })
}

export async function getPaymentsByFarmerId(farmerId: number, page = 1, pageSize = 10) {
	return getPayments({ farmerId, page, pageSize })
}

// POST /api/Payment - Create new payment
export async function createPayment(payload: CreatePaymentPayload) {
	const res = await axiosClient.post<CreatePaymentResponse>("/Payment", payload)
	return res
}

// GET /api/Payment/{paymentId} - Get payment by id (single)
export async function getPaymentById(paymentId: number) {
	return axiosClient.get<PaymentResponse>(`/Payment/${paymentId}`)
}

// GET /api/Payment/{paymentId}/detail - Get payment detail with order and adoptions
export async function getPaymentDetail(paymentId: number) {
	const res = await axiosClient.get<PaymentDetailResponse>(`/Payment/${paymentId}/detail`)
	return res
}

// PUT /api/Payment/{paymentId} - Update a payment
export async function updatePayment(paymentId: number, payload: UpdatePaymentPayload) {
	const res = await axiosClient.put<UpdatePaymentResponse>(`/Payment/${paymentId}`, payload)
	return res
}

// PUT /api/Payment/{paymentId}/status - Update payment status
export async function updatePaymentStatus(paymentId: number, payload: UpdatePaymentStatusPayload) {
	const res = await axiosClient.put<UpdatePaymentStatusResponse>(`/Payment/${paymentId}/status`, payload)
	return res
}

// DELETE /api/Payment/{paymentId} - Soft delete payment
export async function deletePayment(paymentId: number) {
	const res = await axiosClient.delete<DeletePaymentResponse>(`/Payment/${paymentId}`)
	return res
}

// POST /api/Payment/qr - Create QR payment for an order (SEPAY)
export async function createPaymentQR(payload: CreatePaymentQrPayload) {
	return axiosClient.post<CreatePaymentQrResponse>(`/Payment/qr`, payload)
}

// POST /api/Payment/webhook/sepay - Sepay webhook endpoint
// Note: Typically called by Sepay; exposed for testing tools
export async function postSepayWebhook(payload: SepayWebhookPayload) {
	const res = await axiosClient.post<unknown>(`/Payment/webhook/sepay`, payload)
	const data = res.data
	if (isPaymentResponse(data) || isMessageResponse(data)) {
		return res as unknown as { data: SepayWebhookResponse }
	}
	throw new Error("Unexpected sepay webhook response shape")
}
