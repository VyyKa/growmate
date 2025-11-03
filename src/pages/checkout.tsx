import { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../hooks/reduxHooks"
import { selectCartItems, selectCartCount } from "../store/slices/cartSlice"
import { selectIsLoggedIn } from "../store/slices/authSlice"
import { formatPrice } from "../utils/helpers/priceHelpers"
import Breadcrumb from "../components/Breadcrumb"
import CustomInput from "../components/CustomInput"
import CustomSelect from "../components/CustomSelect"
import RadioButton from "../components/RadioButton"
import VietNamBankIconSvg from "../assets/svgs/VietNamBankIconSvg"
import GarbageCanIconSvg from "../assets/svgs/GarbageCanIconSvg"
import {
  shippingSchema,
  type ShippingForm,
} from "../types/schemas/shippingValidation"
import { useVietnamAddress } from "../hooks/useVietnamAddress"
import VnPayQR from "../assets/icons/VNPayQR.png"
import { LogIn } from "lucide-react"

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  // const cartTotal = useAppSelector(selectCartTotal) // replaced by displayTotal when Buy Now is used

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

  // Vietnam address hook
  const { provinces, getDistrictOptions, getWardOptions } = useVietnamAddress()

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "atm">("qr")

  // State for shipping form
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  })

  // State for form errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingForm, string>>
  >({})

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setShippingForm((prev) => ({ ...prev, [field]: value }))

    // Reset dependent fields when province or district changes
    if (field === "province") {
      setShippingForm((prev) => ({ ...prev, district: "", ward: "" }))
    } else if (field === "district") {
      setShippingForm((prev) => ({ ...prev, ward: "" }))
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmitOrder = () => {
    const result = shippingSchema.safeParse(shippingForm)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ShippingForm, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ShippingForm
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      })
      setErrors(fieldErrors)
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector(
          '[class*="border-red-500"]'
        )
        firstErrorElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }, 100)
      return
    }

    setErrors({})

    navigate("/checkout/review", {
      state: {
        shipping: shippingForm,
        payment: paymentMethod,
        // Preserve Buy Now selection across to the review page
        buyNowItem: buyNowItem,
      },
    })
  }

  const handleLoginRedirect = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: location.pathname },
      })
    }
  }

  // Redirect if cart is empty
  if (!buyNowItem && cartCount === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <GarbageCanIconSvg size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn cần có sản phẩm trong giỏ hàng để thanh toán
            </p>
            <button
              onClick={() => navigate("/product")}
              className="px-8 py-3 bg-main text-white rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Thông tin vận chuyển</h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <CustomInput
                    label="Họ và tên"
                    placeholder="Nhập họ và tên người nhận"
                    type="text"
                    value={shippingForm.fullName}
                    onChange={(value) => handleInputChange("fullName", value)}
                    required
                    helperText={errors.fullName}
                    helperTextColor={errors.fullName ? "red" : "gray"}
                  />

                  {/* Phone */}
                  <CustomInput
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại người nhận"
                    type="tel"
                    value={shippingForm.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    required
                    helperText={errors.phone}
                    helperTextColor={errors.phone ? "red" : "gray"}
                  />

                  {/* Email */}
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Email người nhận"
                      placeholder="Nhập email để nhận thông tin đơn hàng"
                      type="email"
                      value={shippingForm.email}
                      onChange={(value) => handleInputChange("email", value)}
                      required
                      helperText={errors.email}
                      helperTextColor={errors.email ? "red" : "gray"}
                    />
                  </div>

                  {/* Province */}
                  <CustomSelect
                    label="Tỉnh / Thành phố"
                    value={shippingForm.province}
                    onChange={(value) => handleInputChange("province", value)}
                    options={provinces}
                    required
                    helperText={errors.province}
                    helperTextColor={errors.province ? "red" : "gray"}
                  />

                  {/* District */}
                  <CustomSelect
                    label="Quận / Huyện"
                    value={shippingForm.district}
                    onChange={(value) => handleInputChange("district", value)}
                    options={getDistrictOptions(shippingForm.province)}
                    required
                    helperText={errors.district}
                    helperTextColor={errors.district ? "red" : "gray"}
                    disabled={!shippingForm.province}
                    disabledMessage="⚠️ Vui lòng chọn Tỉnh/Thành phố trước"
                  />

                  {/* Ward */}
                  <div className="md:col-span-2">
                    <CustomSelect
                      label="Phường / Xã / Thị trấn"
                      value={shippingForm.ward}
                      onChange={(value) => handleInputChange("ward", value)}
                      options={getWardOptions(shippingForm.district)}
                      required
                      helperText={errors.ward}
                      helperTextColor={errors.ward ? "red" : "gray"}
                      disabled={!shippingForm.district}
                      disabledMessage="⚠️ Vui lòng chọn Quận/Huyện trước"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <CustomInput
                      label="Số nhà, tên đường"
                      placeholder="Nhập địa chỉ chi tiết"
                      type="text"
                      value={shippingForm.address}
                      onChange={(value) => handleInputChange("address", value)}
                      required
                      helperText={errors.address}
                      helperTextColor={errors.address ? "red" : "gray"}
                    />
                  </div>

                  {/* Note */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Lời nhắn nhủ cùng cây trồng{" "}
                      <span className="text-gray-500 font-normal">
                        (không bắt buộc)
                      </span>
                    </label>
                    <textarea
                      value={shippingForm.note || ""}
                      onChange={(e) =>
                        handleInputChange("note", e.target.value)
                      }
                      placeholder="Nhập lời nhắn hoặc ghi chú đặc biệt cho cây trồng..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-300 outline-none hover:border-green-400 focus:border-green-500 focus:bg-white text-gray-900 placeholder-gray-400 resize-none"
                    />
                    {errors.note && (
                      <p className="text-xs text-red-500 ml-1 mt-1">
                        {errors.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
              </div>

              <div className="p-6 space-y-3">
                <RadioButton
                  title="Quét mã QR chuyển khoản"
                  description="Hỗ trợ tất cả ngân hàng và ví điện tử tại Việt Nam"
                  isSelected={paymentMethod === "qr"}
                  onClick={() => setPaymentMethod("qr")}
                  icon={
                    <img
                      src={VnPayQR}
                      alt="QR Code"
                      className="w-10 h-10 object-contain"
                    />
                  }
                />

                <RadioButton
                  title="Tài khoản ngân hàng nội địa"
                  description="Hỗ trợ ngân hàng có đăng ký Internet Banking"
                  isSelected={paymentMethod === "atm"}
                  onClick={() => setPaymentMethod("atm")}
                  icon={<VietNamBankIconSvg size={40} />}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-4">
              <div className="flex justify-between bg-gradient-to-r from-main to-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Đơn hàng</h2>
                <span className="bg-white text-main px-2.5 py-0.5 rounded-full text-sm font-bold">
                  {displayCount} đơn
                </span>
              </div>

              <div className="p-6">
                {/* Items (Buy Now or Cart) */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {displayItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                    >
                      <img
                        src={item.imageUrl || "/src/assets/imgs/product1.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {item.quantity} {item.unitName} ×{" "}
                          {formatPrice(item.price)}
                        </p>
                        {"years" in item &&
                          typeof (item as BuyNowItem).years === "number" &&
                          (item as BuyNowItem).years! > 0 && (
                            <p className="text-[11px] text-green-700 mt-1">
                              Thời hạn nhận nuôi: {(item as BuyNowItem).years}{" "}
                              năm
                            </p>
                          )}
                        <p className="text-sm font-bold text-main mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">
                      {formatPrice(displayTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">
                      Miễn phí
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span className="text-2xl text-main">
                        {formatPrice(displayTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {isLoggedIn ? (
                  <button
                    onClick={handleSubmitOrder}
                    className="w-full mt-6 py-4 bg-main hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    Kiểm tra đơn hàng
                  </button>
                ) : (
                  <div className="perspective-1000 mt-6">
                    <div className="flip-card-x group">
                      {/* Front - Normal checkout button */}
                      <button
                        onClick={handleLoginRedirect}
                        className="flip-card-front w-full py-4 bg-main hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                      >
                        Kiểm tra đơn hàng
                      </button>

                      {/* Back - Login required button */}
                      <button
                        onClick={handleLoginRedirect}
                        className="flip-card-back w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <LogIn size={20} />
                        Vui lòng đăng nhập
                      </button>
                    </div>
                  </div>
                )}

                {/* Back to Cart */}
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full mt-3 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-main hover:text-main transition-all duration-300"
                >
                  ← Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckoutPage
