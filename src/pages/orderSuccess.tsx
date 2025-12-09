import { useSearchParams, useNavigate, useLocation } from "react-router-dom"
import Breadcrumb from "../components/Breadcrumb"
import { formatPrice } from "../utils/helpers/priceHelpers"
import CheckCircleIconSvg from "../assets/svgs/CheckCircleIconSvg"

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Try to get data from location.state (used for trial orders)
  const stateData = location.state as { orderCode?: string; total?: number; status?: string } | null

  const orderCode = stateData?.orderCode || searchParams.get("orderCode") || "N/A"
  const total = stateData?.total ?? Number(searchParams.get("total") || 0)
  const status = stateData?.status || searchParams.get("status") || "success" // success | failed
  const errorMessage = "Đã có lỗi xảy ra trong quá trình xử lý đơn hàng"

  // Check if order failed
  const isFailed = status === "failed"

  // If order failed, show error page
  if (isFailed) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            {
              label: "Đặt hàng thất bại",
              path: "/order/success",
              isActive: true,
            },
          ]}
        />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Error Icon & Header */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white px-8 py-12 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                  <svg
                    className="w-16 h-16 text-white"
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
                <h1 className="text-3xl font-bold mb-2">Đặt hàng thất bại!</h1>
                <p className="text-red-100 text-lg">
                  Rất tiếc, đơn hàng của bạn chưa được xử lý thành công
                </p>
              </div>

              {/* Error Details */}
              <div className="p-8">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-bold text-red-900 mb-1">Lỗi xảy ra:</p>
                      <p className="text-red-800">{errorMessage}</p>
                    </div>
                  </div>
                </div>

                {/* Possible Reasons */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">❓</span>
                    Nguyên nhân có thể
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-4">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Thông tin thanh toán không hợp lệ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Kết nối mạng không ổn định</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Sản phẩm đã hết hàng hoặc không còn khả dụng</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>Lỗi hệ thống tạm thời</span>
                    </li>
                  </ul>
                </div>

                {/* What to do next */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    Bạn có thể làm gì?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-main font-bold mt-0.5">1.</span>
                      <span>Kiểm tra lại thông tin và thử đặt hàng lại</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-main font-bold mt-0.5">2.</span>
                      <span>Kiểm tra kết nối internet của bạn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-main font-bold mt-0.5">3.</span>
                      <span>Thử lại với phương thức thanh toán khác</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-main font-bold mt-0.5">4.</span>
                      <span>
                        Liên hệ với bộ phận hỗ trợ nếu vấn đề vẫn tiếp diễn
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="flex-1 py-4 bg-main hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    🔄 Thử lại đặt hàng
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-main hover:text-main transition-all duration-300"
                  >
                    🛒 Quay về giỏ hàng
                  </button>
                </div>

                {/* Support */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Cần hỗ trợ ngay?{" "}
                    <a
                      href="/contact"
                      className="text-main font-semibold hover:underline"
                    >
                      Liên hệ với chúng tôi
                    </a>{" "}
                    hoặc gọi{" "}
                    <a
                      href="tel:1900xxxx"
                      className="text-main font-semibold hover:underline"
                    >
                      1900 xxxx
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Why choose us - even after failure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <p className="text-sm font-semibold text-gray-900">
                  An toàn & Bảo mật
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Thông tin được mã hóa
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
                <div className="text-3xl mb-2">💚</div>
                <p className="text-sm font-semibold text-gray-900">
                  Hỗ trợ 24/7
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Luôn sẵn sàng giúp đỡ
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-sm font-semibold text-gray-900">
                  Xử lý nhanh
                </p>
                <p className="text-xs text-gray-600 mt-1">Đặt hàng dễ dàng</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          {
            label: "Đặt hàng thành công",
            path: "/order/success",
            isActive: true,
          },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Success Icon & Header */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white px-8 py-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 animate-bounce">
                <CheckCircleIconSvg size={64} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
              <p className="text-green-100 text-lg">
                Cảm ơn bạn đã tin tưởng GrowMate 🌱
              </p>
            </div>

            {/* Order Details */}
            <div className="p-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orderCode}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-600 mb-1">
                      Tổng thanh toán
                    </p>
                    <p className="text-2xl font-bold text-main">
                      {formatPrice(total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <span className="text-2xl">📧</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      Thông tin đơn hàng đã được gửi đến email của bạn
                    </p>
                    <p className="text-sm text-gray-600">
                      Vui lòng kiểm tra email (kể cả hộp thư spam) để biết thêm
                      chi tiết về đơn hàng và hướng dẫn thanh toán.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Các bước tiếp theo
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-main font-bold mt-0.5">1.</span>
                    <span>
                      Kiểm tra email để xác nhận thông tin đơn hàng và hướng dẫn
                      thanh toán
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-main font-bold mt-0.5">2.</span>
                    <span>
                      Hoàn tất thanh toán theo hướng dẫn (nếu chưa thanh toán)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-main font-bold mt-0.5">3.</span>
                    <span>
                      Theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-main font-bold mt-0.5">4.</span>
                    <span>
                      Nhận hàng và thưởng thức sản phẩm từ trang trại uy tín
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/orders/${orderCode}`)}
                  className="flex-1 py-4 bg-main hover:bg-green-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  📦 Xem chi tiết đơn hàng
                </button>
                <button
                  onClick={() => navigate("/adopt")}
                  className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:border-main hover:text-main transition-all duration-300"
                >
                  🌱 Tiếp tục nhận nuôi
                </button>
              </div>

              {/* Support */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Cần hỗ trợ?{" "}
                  <a
                    href="/contact"
                    className="text-main font-semibold hover:underline"
                  >
                    Liên hệ với chúng tôi
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
              <div className="text-3xl mb-2">🚚</div>
              <p className="text-sm font-semibold text-gray-900">
                Miễn phí vận chuyển
              </p>
              <p className="text-xs text-gray-600 mt-1">Toàn quốc</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <p className="text-sm font-semibold text-gray-900">
                Thanh toán an toàn
              </p>
              <p className="text-xs text-gray-600 mt-1">Bảo mật thông tin</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 text-center">
              <div className="text-3xl mb-2">💚</div>
              <p className="text-sm font-semibold text-gray-900">Hỗ trợ 24/7</p>
              <p className="text-xs text-gray-600 mt-1">Luôn sẵn sàng</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderSuccessPage
