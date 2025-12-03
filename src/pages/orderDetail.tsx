import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  TreeDeciduous,
  ShoppingBag,
  User,
  FileText,
  Receipt,
  Wallet,
  Copy,
  RefreshCw,
  AlertCircle,
  CircleDollarSign,
  Store,
} from "lucide-react"
import Breadcrumb from "../components/Breadcrumb"
import { getOrderById } from "../services/API/orderAPI"
import type {
  Order,
  AnyOrderItem,
  ProductOrderItem,
  TreeOrderItem,
} from "../types/apiResponse/orderResponse"

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch order details
  const fetchOrder = async () => {
    if (!orderId) {
      setError("Mã đơn hàng không hợp lệ")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await getOrderById(Number(orderId))
      setOrder(response.data)
    } catch (err) {
      console.error("Failed to fetch order:", err)
      setError("Không thể tải thông tin đơn hàng")
      toast.error("Không thể tải thông tin đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  //   // Format short date
  //   const formatShortDate = (dateStr: string) => {
  //     const date = new Date(dateStr)
  //     return date.toLocaleDateString("vi-VN", {
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     })
  //   }

  // Get order status styling
  const getOrderStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          gradientFrom: "from-yellow-500",
          gradientTo: "to-orange-500",
          icon: <Clock className="w-5 h-5" />,
          label: "Chờ xử lý",
          description: "Đơn hàng đang chờ xác nhận từ người bán",
        }
      case "confirmed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-300",
          gradientFrom: "from-blue-500",
          gradientTo: "to-indigo-500",
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Đã xác nhận",
          description: "Đơn hàng đã được xác nhận và đang chuẩn bị",
        }
      case "processing":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-800",
          border: "border-indigo-300",
          gradientFrom: "from-indigo-500",
          gradientTo: "to-purple-500",
          icon: <Package className="w-5 h-5" />,
          label: "Đang xử lý",
          description: "Đơn hàng đang được đóng gói",
        }
      case "shipped":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-300",
          gradientFrom: "from-purple-500",
          gradientTo: "to-pink-500",
          icon: <Truck className="w-5 h-5" />,
          label: "Đang giao hàng",
          description: "Đơn hàng đang trên đường giao đến bạn",
        }
      case "delivered":
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
          gradientFrom: "from-green-500",
          gradientTo: "to-emerald-500",
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Hoàn thành",
          description: "Đơn hàng đã được giao thành công",
        }
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          gradientFrom: "from-red-500",
          gradientTo: "to-rose-500",
          icon: <XCircle className="w-5 h-5" />,
          label: "Đã hủy",
          description: "Đơn hàng đã bị hủy",
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          gradientFrom: "from-gray-500",
          gradientTo: "to-gray-600",
          icon: <Clock className="w-5 h-5" />,
          label: status,
          description: "",
        }
    }
  }

  // Get payment status styling
  const getPaymentStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: <Clock className="w-4 h-4" />,
          label: "Chờ thanh toán",
        }
      case "paid":
      case "success":
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Đã thanh toán",
        }
      case "failed":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          label: "Thanh toán thất bại",
        }
      case "refunded":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: <RefreshCw className="w-4 h-4" />,
          label: "Đã hoàn tiền",
        }
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <CreditCard className="w-4 h-4" />,
          label: status,
        }
    }
  }

  // Check if item is tree
  const isTreeItem = (item: AnyOrderItem): item is TreeOrderItem => {
    return item.itemType === "Tree"
  }

  // Check if item is product
  const isProductItem = (item: AnyOrderItem): item is ProductOrderItem => {
    return item.itemType === "Product"
  }

  // Copy order ID
  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId.toString())
      toast.success("Đã sao chép mã đơn hàng")
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            { label: "Đơn hàng của tôi", path: "/orders" },
            {
              label: `Đơn hàng #${orderId}`,
              path: `/orders/${orderId}`,
              isActive: true,
            },
          ]}
        />

        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-[var(--color-main)]/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-main)] rounded-full animate-spin"></div>
              <ShoppingBag className="w-10 h-10 text-[var(--color-main)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              Đang tải thông tin đơn hàng...
            </p>
            <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error || !order) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            { label: "Đơn hàng của tôi", path: "/orders" },
            { label: "Lỗi", path: "#", isActive: true },
          ]}
        />

        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Không tìm thấy đơn hàng
              </h2>
              <p className="text-gray-600">
                {error ||
                  "Đơn hàng không tồn tại hoặc bạn không có quyền xem đơn hàng này."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/orders")}
                className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
              >
                Quay lại danh sách đơn hàng
              </button>
              <button
                onClick={fetchOrder}
                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  const orderStatus = getOrderStatusStyle(order.status)
  const paymentStatus = getPaymentStatusStyle(order.paymentStatus)
  const productCount = order.orderItems.filter(isProductItem).length
  const treeCount = order.orderItems.filter(isTreeItem).length

  return (
    <>
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Đơn hàng của tôi", path: "/orders" },
          {
            label: `Đơn hàng #${order.orderId}`,
            path: `/orders/${order.orderId}`,
            isActive: true,
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate("/orders")}
            className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-[var(--color-main)] font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại danh sách đơn hàng
          </button>

          {/* Order Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
            {/* Status Banner */}
            <div
              className={`bg-gradient-to-r ${orderStatus.gradientFrom} ${orderStatus.gradientTo} text-white p-6`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    {orderStatus.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{orderStatus.label}</h1>
                    <p className="text-white/80 mt-1">
                      {orderStatus.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm`}
                  >
                    {paymentStatus.icon}
                    {paymentStatus.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-xl">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Đơn hàng #{order.orderId}
                      </h2>
                      <button
                        onClick={copyOrderId}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Sao chép mã đơn hàng"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={fetchOrder}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Package className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sản phẩm</p>
                      <p className="text-xl font-bold text-gray-900">
                        {order.orderItems.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center gap-3">
                    <CircleDollarSign className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Tổng tiền</p>
                      <p className="text-xl font-bold text-[var(--color-main)]">
                        {order.totalAmountFormatted}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Store className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Người bán</p>
                      <p className="text-lg font-bold text-gray-900 truncate">
                        {order.sellerName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Thanh toán</p>
                      <p className="text-lg font-bold text-gray-900">
                        {order.paymentMethod || "Chưa chọn"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-[var(--color-main)]" />
                      Chi tiết sản phẩm
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {productCount > 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          {productCount} sản phẩm
                        </span>
                      )}
                      {treeCount > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                          <TreeDeciduous className="w-3 h-3" />
                          {treeCount} cây
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          {item.productImageUrl ? (
                            <img
                              src={item.productImageUrl}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                              {isTreeItem(item) ? (
                                <TreeDeciduous className="w-10 h-10 text-green-500" />
                              ) : (
                                <Package className="w-10 h-10 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {item.productName}
                              </h4>
                              {isTreeItem(item) && (
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    <TreeDeciduous className="w-3.5 h-3.5" />
                                    Nhận nuôi
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {item.productType} - {item.productVariety}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              x{item.quantity}
                            </span>
                          </div>

                          <div className="mt-4 flex items-end justify-between">
                            <div className="text-sm text-gray-500">
                              {isTreeItem(item) ? (
                                <div className="space-y-1">
                                  <p>Số cây: {item.treeQuantity}</p>
                                  <p>Đơn giá: {item.treeUnitPriceFormatted}</p>
                                  {item.farmName && (
                                    <p className="flex items-center gap-1">
                                      <MapPin className="w-3.5 h-3.5" />
                                      Nhà vườn: {item.farmName}
                                    </p>
                                  )}
                                </div>
                              ) : isProductItem(item) ? (
                                <p>Đơn giá: {item.unitPriceFormatted}</p>
                              ) : null}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Thành tiền
                              </p>
                              <p className="text-xl font-bold text-[var(--color-main)]">
                                {isTreeItem(item)
                                  ? item.treeTotalPriceFormatted
                                  : isProductItem(item)
                                  ? item.totalPriceFormatted
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[var(--color-main)]" />
                      Ghi chú đơn hàng
                    </h3>
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Summary & Info */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[var(--color-main)]" />
                    Tổng thanh toán
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium text-gray-900">
                      {order.subtotalFormatted}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Phí vận chuyển
                    </span>
                    <span className="font-medium text-gray-900">
                      {order.shippingFee > 0
                        ? order.shippingFeeFormatted
                        : "Miễn phí"}
                    </span>
                  </div>

                  {order.platformFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Phí nền tảng</span>
                      <span className="font-medium text-gray-900">
                        {order.platformFeeFormatted}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-2xl font-bold text-[var(--color-main)]">
                        {order.totalAmountFormatted}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      (Đã bao gồm VAT nếu có)
                    </p>
                  </div>

                  {/* Payment Status */}
                  <div
                    className={`mt-4 p-4 rounded-xl border ${paymentStatus.bg} ${paymentStatus.border}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${paymentStatus.bg}`}>
                        {paymentStatus.icon}
                      </div>
                      <div>
                        <p className={`font-semibold ${paymentStatus.text}`}>
                          {paymentStatus.label}
                        </p>
                        {order.paymentMethod && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            {order.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--color-main)]" />
                    Địa chỉ giao hàng
                  </h3>
                </div>

                <div className="p-6">
                  {order.shippingAddress ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{order.shippingAddress}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Chưa có địa chỉ giao hàng
                    </p>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-[var(--color-main)]" />
                    Thông tin người bán
                  </h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-main)] to-emerald-600 flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {order.sellerName}
                      </p>
                      <p className="text-sm text-gray-500">Nhà cung cấp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6">
                <div className="space-y-3">
                  {order.paymentStatus.toLowerCase() === "pending" && (
                    <button
                      onClick={() =>
                        navigate(`/checkout/qr?orderId=${order.orderId}`)
                      }
                      className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <CreditCard className="w-5 h-5" />
                      Thanh toán ngay
                    </button>
                  )}

                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại danh sách
                  </button>

                  <button
                    onClick={() => navigate("/products")}
                    className="w-full py-3 px-4 border-2 border-[var(--color-main)] text-[var(--color-main)] hover:bg-[var(--color-main)] hover:text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetailPage
