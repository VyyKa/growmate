import type { PaymentStatus } from "../enums/PaymentStatus"
import type { OrderStatus } from "../enums/OrderStatus"
import type { AdoptionStatus } from "../enums/AdoptionStatus"

// Single payment response mapped from backend PaymentResponse class
export type PaymentResponse = {
  paymentId: number
  orderId: number
  amount: number
  currency: string
  paymentMethod: string
  transactionReference: string | null
  sourceType: string
  status: PaymentStatus | string
  paymentDate: string
  notes: string | null
  createdAt: string | null
  updatedAt: string | null
}

// Paged response shape (same as PostListResponse)
export type PaymentListResponse = {
  items: PaymentResponse[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
}

export type GetPaymentsParams = {
  orderId?: number
  customerId?: number
  farmerId?: number
  page?: number
  pageSize?: number
}

// Type guards
export const isPaymentListResponse = (data: unknown): data is PaymentListResponse => {
  return (
    !!data &&
    typeof data === 'object' &&
    'items' in (data as Record<string, unknown>) &&
    Array.isArray((data as { items: unknown }).items) &&
    'totalItems' in (data as Record<string, unknown>)
  )
}

export const isPaymentResponse = (data: unknown): data is PaymentResponse => {
  return !!data && typeof data === 'object' && 'paymentId' in (data as Record<string, unknown>)
}

// ---- Create/Mutate Payment common message ----
export type MessageResponse = { message: string; success: boolean }

export type CreatePaymentPayload = {
  orderId: number
  amount: number
  currency: string
  paymentMethod: string
  transactionReference?: string | null
  sourceType: string
  status: PaymentStatus | string
  paymentDate: string
  notes?: string | null
}

export type CreatePaymentResponse = PaymentResponse | MessageResponse

export const isMessageResponse = (data: unknown): data is MessageResponse => {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return 'message' in d && 'success' in d && typeof d.success === 'boolean'
}

// ---- Create Payment QR (SEPAY) ----
// POST /api/Payment/qr
export type CreatePaymentQrPayload = {
  orderId: number
}

// Response shape returned by QR endpoint
export type CreatePaymentQrResponse = {
  paymentId: number
  orderId: number
  gatewayOrderCode: string
  qrContent: string
  qrImageUrl: string
  expiresAt: string
  transactionReference: string | null
  status: PaymentStatus | string
}

// ---- Sepay Webhook ----
// POST /api/Payment/webhook/sepay
// The payload is defined by Sepay; we keep it flexible on FE side
export type SepayWebhookPayload = Record<string, unknown>
export type SepayWebhookResponse = CreatePaymentResponse

// ---- Update Payment ----
// PUT /api/Payment/{paymentId}
export type UpdatePaymentPayload = {
  amount: number
  currency: string
  paymentMethod: string
  transactionReference?: string | null
  sourceType: string
  status: PaymentStatus | string
  paymentDate: string
  notes?: string | null
}

// Align update responses with create response union
export type UpdatePaymentResponse = CreatePaymentResponse

// ---- Update Payment Status ----
// PUT /api/Payment/{paymentId}/status
export type UpdatePaymentStatusPayload = {
  status: PaymentStatus | string
}

export type UpdatePaymentStatusResponse = CreatePaymentResponse

// ---- Delete Payment (soft) ----
// DELETE /api/Payment/{paymentId}
export type DeletePaymentResponse = CreatePaymentResponse

// ---- Payment Detail with related data ----
export type OrderSummaryResponse = {
  orderId: number
  customerId: number
  customerName: string
  sellerId: number
  sellerName: string
  status: OrderStatus | string
  totalAmount: number
  createdAt: string
}

export type AdoptionSummaryResponse = {
  adoptionId: number
  treeId: number
  customerId: number
  customerName: string
  treeName: string
  status: AdoptionStatus | string
  startDate: string
  endDate: string
  createdAt: string
}

export type PaymentDetailResponse = PaymentResponse & {
  order?: OrderSummaryResponse | null
  adoptions?: AdoptionSummaryResponse[] | null
}