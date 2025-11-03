import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../hooks/reduxHooks"
import { clearCart, removeItem } from "../store/slices/cartSlice"
import { useServerCart } from "../hooks/useServerCart"
import { useVNPay } from "../hooks/useVNPay"
import { VNPAY_ERROR_MESSAGES } from "../utils/constants/vnpay"
import Breadcrumb from "../components/Breadcrumb"

/**
 * CheckoutCallbackPage - Xử lý callback từ VNPay
 *
 * Flow:
 * 1. Nhận response từ VNPay qua URL params
 * 2. Validate transaction với backend
 * 3. Clear cart nếu thành công
 * 4. Redirect đến success/failed page
 */
const CheckoutCallbackPage = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { validateCallback } = useVNPay()
  const [isValidating, setIsValidating] = useState(true)
  const { removeByProductId } = useServerCart()

  // Parse URL parameters
  const params = useMemo(() => new URLSearchParams(search), [search])

  // VNPay response parameters
  const vnpResponseCode = params.get("vnp_ResponseCode") || ""
  const vnpTransactionStatus = params.get("vnp_TransactionStatus") || ""
  const vnpTxnRef = params.get("vnp_TxnRef") || "" // Order code
  const vnpAmount = params.get("vnp_Amount") || "0" // Amount in VND * 100
  const vnpBankCode = params.get("vnp_BankCode") || ""
  const vnpTransactionNo = params.get("vnp_TransactionNo") || ""
  const vnpPayDate = params.get("vnp_PayDate") || ""

  useEffect(() => {
    const processPaymentCallback = async () => {
      try {
        // Check if we have VNPay params
        if (!vnpResponseCode || !vnpTxnRef) {
          navigate(
            "/order/success?status=failed&error=Không tìm thấy thông tin thanh toán",
            { replace: true }
          )
          return
        }

        // Validate with backend
        const validationResult = await validateCallback(params)

        if (!validationResult.success) {
          throw new Error(
            validationResult.error || "Xác thực giao dịch thất bại"
          )
        }

        // Check payment status from VNPay response code
        const isSuccess =
          vnpResponseCode === "00" && vnpTransactionStatus === "00"

        if (isSuccess) {
          // If this was a Buy Now flow, remove only that item from cart (guest and server)
          try {
            const buyNowRaw = sessionStorage.getItem("buyNowItem")
            if (buyNowRaw) {
              const bn = JSON.parse(buyNowRaw) as { productId: number }
              if (bn && typeof bn.productId === "number") {
                // Remove locally (guest cart)
                dispatch(removeItem({ productId: bn.productId }))
                // Attempt to remove from server cart (authenticated users)
                try {
                  await removeByProductId(bn.productId)
                } catch {
                  // ignore server removal errors, local removal is enough for UI
                }
              }
            } else {
              // Not a Buy Now flow -> clear entire cart
              dispatch(clearCart())
            }
          } catch {
            // Fallback: clear entire cart on unexpected errors
            dispatch(clearCart())
          }

          const storedOrderId = sessionStorage.getItem("pendingOrderId")
          const storedAmount = sessionStorage.getItem("pendingOrderAmount")

          const orderCode = storedOrderId || vnpTxnRef
          const totalAmount = storedAmount
            ? Number(storedAmount)
            : parseInt(vnpAmount) / 100

          // Clear stored order info
          try {
            sessionStorage.removeItem("pendingOrderId")
            sessionStorage.removeItem("pendingOrderAmount")
            sessionStorage.removeItem("buyNowItem")
          } catch {
            void 0
          }

          // Navigate to success page with transaction details
          navigate(
            `/order/success?orderCode=${orderCode}&total=${totalAmount}&status=success&transactionNo=${vnpTransactionNo}&bankCode=${vnpBankCode}&payDate=${vnpPayDate}`,
            { replace: true }
          )
        } else {
          // Payment failed - get error message
          const errorMessage = getVNPayErrorMessage(vnpResponseCode)

          navigate(
            `/order/success?status=failed&error=${encodeURIComponent(
              errorMessage
            )}&orderCode=${vnpTxnRef}`,
            { replace: true }
          )
        }
      } catch (error) {
        console.error("Payment validation error:", error)

        const errorMsg =
          error instanceof Error
            ? error.message
            : "Lỗi xác thực giao dịch. Vui lòng liên hệ hỗ trợ."

        navigate(
          `/order/success?status=failed&error=${encodeURIComponent(errorMsg)}`,
          { replace: true }
        )
      } finally {
        setIsValidating(false)
      }
    }

    processPaymentCallback()
  }, [
    params,
    navigate,
    dispatch,
    validateCallback,
    removeByProductId,
    vnpResponseCode,
    vnpTransactionStatus,
    vnpTxnRef,
    vnpAmount,
    vnpBankCode,
    vnpTransactionNo,
    vnpPayDate,
  ])

  /**
   * Get error message in Vietnamese from VNPay response code
   */
  const getVNPayErrorMessage = (code: string): string => {
    return (
      VNPAY_ERROR_MESSAGES[code] ||
      "Giao dịch không thành công. Vui lòng thử lại."
    )
  }

  /**
   * Format payment date from VNPay format (yyyyMMddHHmmss) to readable format
   */
  const formatPayDate = (payDate: string): string => {
    if (!payDate || payDate.length !== 14) return ""

    const year = payDate.substring(0, 4)
    const month = payDate.substring(4, 6)
    const day = payDate.substring(6, 8)
    const hour = payDate.substring(8, 10)
    const minute = payDate.substring(10, 12)

    return `${hour}:${minute} ${day}/${month}/${year}`
  }

  if (isValidating) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            {
              label: "Xác thực thanh toán",
              path: "/checkout/callback",
              isActive: true,
            },
          ]}
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              {/* Loading spinner */}
              <div className="mx-auto w-20 h-20 mb-6">
                <div className="w-20 h-20 border-4 border-main border-t-transparent rounded-full animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đang xác thực thanh toán...
              </h2>
              <p className="text-gray-600 mb-6">
                Vui lòng chờ trong giây lát. Không đóng trình duyệt.
              </p>

              {/* Payment info */}
              {vnpTxnRef && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg text-left">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Mã đơn hàng:
                      </span>
                      <span className="font-bold text-gray-900 text-base">
                        {vnpTxnRef}
                      </span>
                    </div>

                    {vnpAmount && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Số tiền:
                        </span>
                        <span className="font-bold text-main text-lg">
                          {(parseInt(vnpAmount) / 100).toLocaleString()} ₫
                        </span>
                      </div>
                    )}

                    {vnpBankCode && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Ngân hàng:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {vnpBankCode}
                        </span>
                      </div>
                    )}

                    {vnpPayDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Thời gian:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPayDate(vnpPayDate)}
                        </span>
                      </div>
                    )}

                    {vnpTransactionNo && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Mã GD VNPay:
                        </span>
                        <span className="font-mono text-xs text-gray-700">
                          {vnpTransactionNo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="font-medium">
                    Giao dịch được bảo mật bởi VNPay
                  </span>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-6">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div
                    className="w-2 h-2 bg-main rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="w-2 h-2 bg-main rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-main rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Fallback (shouldn't reach here due to navigation in useEffect)
  return null
}

export default CheckoutCallbackPage
