import { useState } from "react"
import type { VNPayBankCode } from "../utils/constants/vnpay"
import { createPaymentQR } from "../services/API/paymentAPI"
import type { CreatePaymentQrResponse } from "../types/apiResponse/paymentResponse"

export interface VNPayPaymentRequest {
  amount: number
  orderCode: string
  orderInfo: string
  bankCode?: VNPayBankCode
  returnUrl?: string
}

export interface VNPayPaymentResponse {
  success: boolean
  paymentUrl?: string
  qrData?: CreatePaymentQrResponse
  error?: string
}

/**
 * useVNPay Hook - Xử lý thanh toán qua VNPay
 * 
 * Chức năng:
 * - Tạo URL thanh toán VNPay (QR hoặc Internet Banking)
 * - Validate callback từ VNPay
 */
export const useVNPay = () => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Tạo QR thanh toán cho order (SEPAY)
   */
  const createQRPayment = async (
    orderId: number,
    amount: number
  ): Promise<VNPayPaymentResponse> => {
    setIsCreatingPayment(true)
    setError(null)

    try {
      const response = await createPaymentQR({ orderId, amount })
      
      return {
        success: true,
        qrData: response.data,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tạo mã QR thanh toán"
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsCreatingPayment(false)
    }
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  const createPaymentUrl = async (
    request: VNPayPaymentRequest
  ): Promise<VNPayPaymentResponse> => {
    setIsCreatingPayment(true)
    setError(null)

    try {
      // TODO: Call backend API to create VNPay payment URL
      const response = await fetch("/api/payment/vnpay/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Không thể tạo thanh toán. Vui lòng thử lại.")
      }

      const data = await response.json()

      if (!data.paymentUrl) {
        throw new Error("Không nhận được URL thanh toán từ server")
      }

      return {
        success: true,
        paymentUrl: data.paymentUrl,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định"
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsCreatingPayment(false)
    }
  }

  /**
   * Validate VNPay callback
   */
  const validateCallback = async (queryParams: URLSearchParams): Promise<{
    success: boolean
    orderCode?: string
    amount?: number
    error?: string
  }> => {
    try {
      // TODO: Call backend API to validate VNPay callback
      const response = await fetch(
        `/api/payment/vnpay/callback?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Không thể xác thực giao dịch")
      }

      const data = await response.json()

      return {
        success: data.success,
        orderCode: data.orderCode,
        amount: data.amount,
        error: data.error,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Lỗi xác thực giao dịch"
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  return {
    createQRPayment,
    createPaymentUrl,
    validateCallback,
    isCreatingPayment,
    error,
  }
}
