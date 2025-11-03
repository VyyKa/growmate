import { useEffect, useState, useCallback } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useVNPay } from "../hooks/useVNPay"
import { getPaymentById } from "../services/API/paymentAPI"
import { getOrderById } from "../services/API/orderAPI"
import type { CreatePaymentQrResponse } from "../types/apiResponse/paymentResponse"
import type { Order } from "../types/apiResponse/orderResponse"
import Breadcrumb from "../components/Breadcrumb"
import ClockIconSvg from "../assets/svgs/ClockIconSvg"
import CheckCircleIconSvg from "../assets/svgs/CheckCircleIconSvg"
import { PaymentStatus } from "../types/enums/PaymentStatus"

/**
 * QRCheckout Page - Hiển thị mã QR thanh toán SEPAY
 *
 * Features:
 * - Display QR code image from payment gateway
 * - Show order details and payment amount
 * - Countdown timer until QR expiration
 * - Auto-refresh payment status
 * - Redirect on successful payment
 */
const QRCheckout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { createQRPayment } = useVNPay()

  const [qrData, setQrData] = useState<CreatePaymentQrResponse | null>(null)
  const [orderData, setOrderData] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isChecking, setIsChecking] = useState(false)

  // Get orderId from URL params
  const orderId = searchParams.get("orderId")

  /**
   * Load QR payment data
   */
  const loadQRPayment = useCallback(async () => {
    if (!orderId) {
      setError("Không tìm thấy thông tin đơn hàng")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(orderId)
      const response = await createQRPayment(Number(orderId))

      if (!response.success || !response.qrData) {
        throw new Error(response.error || "Không thể tạo mã QR thanh toán")
      }

      setQrData(response.qrData)

      // Fetch order details to get total amount
      try {
        const orderResponse = await getOrderById(Number(orderId))
        setOrderData(orderResponse.data)
      } catch (orderError) {
        console.error("Failed to fetch order details:", orderError)
        // Continue even if order fetch fails
      }

      // Calculate time remaining
      const expiryTime = new Date(response.qrData.expiresAt).getTime()
      const now = Date.now()
      const remaining = Math.floor((expiryTime - now) / 1000)
      setTimeRemaining(remaining > 0 ? remaining : 0)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi không xác định"
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  /**
   * Check payment status
   */
  const checkPaymentStatus = useCallback(async () => {
    if (!qrData || isChecking) return

    setIsChecking(true)
    try {
      const response = await getPaymentById(qrData.paymentId)
      const payment = response.data

      // If payment is completed, redirect to success page
      if (payment.status === PaymentStatus.SUCCESS) {
        navigate(
          `/order/success?orderCode=${qrData.orderId}&total=${
            payment.amount
          }&status=success&transactionNo=${
            payment.transactionReference || ""
          }&paymentMethod=SEPAY`,
          { replace: true }
        )
      }
    } catch (err) {
      console.error("Error checking payment status:", err)
    } finally {
      setIsChecking(false)
    }
  }, [qrData, isChecking, navigate])

  /**
   * Initialize QR payment on mount
   */
  useEffect(() => {
    loadQRPayment()
  }, [loadQRPayment])

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  /**
   * Auto-check payment status every 5 seconds
   */
  useEffect(() => {
    if (!qrData) return

    const interval = setInterval(() => {
      const expired = new Date(qrData.expiresAt).getTime() <= Date.now()
      if (expired) {
        clearInterval(interval)
        return
      }
      checkPaymentStatus()
    }, 5000) // 5s

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrData])

  /**
   * Format countdown time
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  /**
   * Copy QR content to clipboard
   */
  const copyToClipboard = () => {
    if (!qrData) return
    navigator.clipboard.writeText(qrData.qrContent)
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            { label: "Thanh toán QR", path: "/checkout/qr", isActive: true },
          ]}
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 mb-6">
                <div className="w-20 h-20 border-4 border-main border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Đang tạo mã QR thanh toán...
              </h2>
              <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !qrData) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            { label: "Thanh toán QR", path: "/checkout/qr", isActive: true },
          ]}
        />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-red-200 p-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 mb-6 flex items-center justify-center bg-red-100 rounded-full">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Có lỗi xảy ra
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Không thể tải thông tin thanh toán"}
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-main text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const isExpired = timeRemaining <= 0

  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Thanh toán QR", path: "/checkout/qr", isActive: true },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Quét mã QR để thanh toán
              </h1>
              <p className="text-lg text-gray-600">
                Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code Section */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-green-100 p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ClockIconSvg className="w-6 h-6 text-main" />
                    Mã QR thanh toán
                  </h2>
                  {!isExpired ? (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Còn lại:</span>
                      <span className="font-mono text-lg font-bold text-main">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-red-600 font-semibold text-sm">
                      Mã QR đã hết hạn
                    </div>
                  )}
                </div>

                {/* QR Image */}
                <div className="relative mb-6">
                  <div
                    className={`bg-white p-4 rounded-xl border-4 ${
                      isExpired ? "border-gray-300 opacity-50" : "border-main"
                    } transition-all duration-300`}
                  >
                    <img
                      src={qrData.qrImageUrl}
                      alt="QR Code"
                      className="w-full h-auto mx-auto"
                      style={{ maxWidth: "350px" }}
                    />
                  </div>

                  {isExpired && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
                      <div className="bg-white px-6 py-3 rounded-lg shadow-lg">
                        <p className="text-red-600 font-bold">Đã hết hạn</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Content */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">
                    Nội dung chuyển khoản:
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono font-bold text-gray-900 break-all">
                      {qrData.qrContent}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex-shrink-0 px-3 py-1 bg-main text-white text-xs rounded hover:bg-green-700 transition-colors"
                      title="Sao chép"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {isExpired && (
                  <button
                    onClick={loadQRPayment}
                    className="w-full px-6 py-3 bg-main text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Tạo mã QR mới
                  </button>
                )}
              </div>

              {/* Payment Info Section */}
              <div className="space-y-6">
                {/* Order Details */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Thông tin đơn hàng
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Mã đơn hàng:</span>
                      <span className="font-semibold text-gray-900">
                        #{qrData.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Mã giao dịch:</span>
                      <span className="font-mono text-sm text-gray-900">
                        {qrData.gatewayOrderCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        {qrData.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-gray-900">
                        Tổng tiền:
                      </span>
                      <span className="text-2xl font-bold text-main">
                        {orderData
                          ? orderData.totalAmountFormatted
                          : "Đang tải..."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg border border-green-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircleIconSvg className="w-6 h-6 text-main" />
                    Hướng dẫn thanh toán
                  </h2>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <span>Mở ứng dụng ngân hàng trên điện thoại</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <span>Chọn chức năng quét mã QR</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>Quét mã QR phía bên trái</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <span>Kiểm tra thông tin và xác nhận thanh toán</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-main text-white rounded-full flex items-center justify-center text-xs font-bold">
                        5
                      </span>
                      <span>
                        Hệ thống sẽ tự động cập nhật khi thanh toán thành công
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Auto-check notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {isChecking ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Đang theo dõi thanh toán
                      </p>
                      <p className="text-xs text-gray-600">
                        Hệ thống sẽ tự động kiểm tra và chuyển trang khi thanh
                        toán thành công. Không cần tải lại trang.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cancel button */}
                <button
                  onClick={() => navigate(-1)}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy và quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QRCheckout
