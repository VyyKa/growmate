import type { PaymentStatus } from "../../enums/PaymentStatus"

/** Bảng payments */
export interface Payment {
  paymentId: number
  adoptionId: number
  amount: number
  paymentMethod: string
  transactionReference?: string | null
  status: PaymentStatus
  createdAt: string
}
