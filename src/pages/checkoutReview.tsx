import { useMemo, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAppSelector } from "../hooks/reduxHooks"
import {
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../store/slices/cartSlice"
import { formatPrice } from "../utils/helpers/priceHelpers"
import Breadcrumb from "../components/Breadcrumb"
import type { ShippingForm } from "../types/schemas/shippingValidation"
import { useVietnamAddress } from "../hooks/useVietnamAddress"
import { useVNPay } from "../hooks/useVNPay"
import VietNamBankIconSvg from "../assets/svgs/VietNamBankIconSvg"
import VnPayQR from "../assets/icons/VNPayQR.png"
import { createOrder } from "../services/API/orderAPI"

const CheckoutReviewPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const cartTotal = useAppSelector(selectCartTotal)

  // Support Buy Now: if a buyNowItem is passed via navigation state, we show only that item
  type BuyNowItem = {
    productId: number
    name: string
    price: number
    unitName: string
    imageUrl: string | null
    quantity: number
    years?: number
  }
  const buyNowItem = location.state?.buyNowItem as BuyNowItem | undefined

  const displayItems = useMemo(() => {
    if (buyNowItem) return [buyNowItem]
    return cartItems
  }, [buyNowItem, cartItems])

  const displayCount = useMemo(
    () => displayItems.reduce((sum, i) => sum + (i.quantity || 0), 0),
    [displayItems]
  )

  const displayTotal = useMemo(
    () => displayItems.reduce((sum, i) => sum + i.price * (i.quantity || 0), 0),
    [displayItems]
  )

  // Get shipping info and payment method from navigation state
  const shippingInfo = location.state?.shipping as ShippingForm | undefined
  const paymentMethod = location.state?.payment as "qr" | "atm" | undefined

  const [isProcessing, setIsProcessing] = useState(false)

  const { provinces, getDistrictOptions, getWardOptions } = useVietnamAddress()

  const { createPaymentUrl } = useVNPay()

  // Redirect if no shipping info
  if (!shippingInfo || !paymentMethod) {
    navigate("/checkout", { replace: true })
    return null
  }

  // Get full names from codes
  const provinceName =
    provinces.find((p) => p.value === shippingInfo.province)?.label ||
    shippingInfo.province
  const districtName =
    getDistrictOptions(shippingInfo.province).find(
      (d) => d.value === shippingInfo.district
    )?.label || shippingInfo.district
  const wardName =
    getWardOptions(shippingInfo.district).find(
      (w) => w.value === shippingInfo.ward
    )?.label || shippingInfo.ward

  // Format full address with proper names
  const fullAddress = `${shippingInfo.address}, ${wardName}, ${districtName}, ${provinceName}`

  const handleConfirmOrder = async () => {
    setIsProcessing(true)

    try {
      const { data: order } = await createOrder({
        shippingAddress: fullAddress,
        notes: shippingInfo.note ?? "",
      })

      // Persist orderId for the callback page (used in success display)
      try {
        sessionStorage.setItem("pendingOrderId", String(order.orderId))
        sessionStorage.setItem("pendingOrderAmount", String(order.totalAmount))
        if (buyNowItem) {
          sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem))
        }
      } catch {
        void 0
      }

      // Build payment descriptors from created order
      const orderCode = String(order.orderId)
      const orderInfo = `Thanh toán đơn hàng #${order.orderId} - GrowMate`

      // If payment method is QR, redirect to QR checkout page
      if (paymentMethod === "qr") {
        navigate(`/checkout/qr?orderId=${order.orderId}`, { replace: true })
        return
      }

      // For ATM payment, create VNPay payment URL
      const paymentResponse = await createPaymentUrl({
        amount: order.totalAmount,
        orderCode: orderCode,
        orderInfo: orderInfo,
        // If ATM selected, can specify bank code (optional)
        returnUrl: `${window.location.origin}/checkout/callback`,
      })

      if (!paymentResponse.success || !paymentResponse.paymentUrl) {
        throw new Error(paymentResponse.error || "Không thể tạo thanh toán")
      }

      // Redirect to VNPay payment page
      window.location.href = paymentResponse.paymentUrl
    } catch (error) {
      console.error("Order creation failed:", error)
      setIsProcessing(false)

      // Get error message
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra trong quá trình xử lý đơn hàng. Vui lòng thử lại sau."

      // Navigate to failed page instead of showing alert
      navigate(
        `/order/success?status=failed&error=${encodeURIComponent(errorMsg)}`,
        { replace: true }
      )
    }
  }

  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Giỏ hàng", path: "/cart" },
          { label: "Thanh toán", path: "/checkout" },
          {
            label: "Xác nhận đơn hàng",
            path: "/checkout/review",
            isActive: true,
          },
        ]}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Xác nhận đơn hàng
            </h1>
            <p className="text-gray-600">
              Vui lòng kiểm tra lại thông tin trước khi xác nhận
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Thông tin người nhận</h2>
                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: buyNowItem ? { buyNowItem } : undefined,
                      })
                    }
                    className="text-sm underline hover:text-green-100 transition"
                  >
                    Chỉnh sửa
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                      <p className="font-semibold text-gray-900">
                        {shippingInfo.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Số điện thoại
                      </p>
                      <p className="font-semibold text-gray-900">
                        {shippingInfo.phone}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">
                        {shippingInfo.email}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">
                        Địa chỉ nhận hàng
                      </p>
                      <p className="font-semibold text-gray-900">
                        {fullAddress}
                      </p>
                    </div>

                    {shippingInfo.note && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Lời nhắn</p>
                        <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg">
                          "{shippingInfo.note}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Phương thức thanh toán</h2>
                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: buyNowItem ? { buyNowItem } : undefined,
                      })
                    }
                    className="text-sm underline hover:text-green-100 transition"
                  >
                    Chỉnh sửa
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-main">
                      {paymentMethod === "qr" ? (
                        <img
                          src={VnPayQR}
                          alt="QR Code"
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <VietNamBankIconSvg size={40} />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {paymentMethod === "qr"
                          ? "Quét mã QR chuyển khoản"
                          : "Thẻ ATM - Tài khoản ngân hàng"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {paymentMethod === "qr"
                          ? "Hỗ trợ tất cả ngân hàng và ví điện tử"
                          : "Hỗ trợ ngân hàng có Internet Banking"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                  <h2 className="text-lg font-bold">
                    Sản phẩm ({buyNowItem ? displayCount : cartCount} sản phẩm)
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(buyNowItem ? displayItems : cartItems).map((item) => (
                      <div
                        key={item.productId}
                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                      >
                        <img
                          src={item.imageUrl || "/src/assets/imgs/product1.jpg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Số lượng: {item.quantity} {item.unitName}
                          </p>
                          {"years" in item &&
                            typeof (item as BuyNowItem).years === "number" &&
                            (item as BuyNowItem).years! > 0 && (
                              <p className="text-xs text-green-700 mt-1">
                                Thời hạn nhận nuôi: {(item as BuyNowItem).years}{" "}
                                năm
                              </p>
                            )}
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-600">
                              Đơn giá: {formatPrice(item.price)}
                            </p>
                            <p className="text-lg font-bold text-main">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                  <h2 className="text-lg font-bold">Tóm tắt đơn hàng</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Tạm tính ({buyNowItem ? displayCount : cartCount} sản
                        phẩm):
                      </span>
                      <span className="font-semibold">
                        {formatPrice(buyNowItem ? displayTotal : cartTotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold text-green-600">
                        Miễn phí
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <span>Giảm giá:</span>
                      <span className="font-semibold">0 ₫</span>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Tổng thanh toán:
                        </span>
                        <span className="text-2xl font-bold text-main">
                          {formatPrice(buyNowItem ? displayTotal : cartTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-main hover:bg-green-600 text-white"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      "Xác nhận đặt hàng"
                    )}
                  </button>
                  {/* Back Button */}
                  <button
                    onClick={() =>
                      navigate("/checkout", {
                        state: buyNowItem ? { buyNowItem } : undefined,
                      })
                    }
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-main hover:text-main transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Quay lại chỉnh sửa
                  </button>
                  {/* Policy Notice */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-gray-700">
                      Bằng việc nhấn "Xác nhận đặt hàng", bạn đồng ý với{" "}
                      <a
                        href="/policy"
                        className="text-main underline hover:text-green-700"
                      >
                        Điều khoản & Chính sách
                      </a>{" "}
                      của GrowMate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutReviewPage
