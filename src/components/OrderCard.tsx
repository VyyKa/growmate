import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  MapPin,
  Calendar,
  TreeDeciduous,
  ShoppingBag,
  Eye,
} from "lucide-react"
import type {
  Order,
  AnyOrderItem,
  ProductOrderItem,
  TreeOrderItem,
} from "../types/apiResponse/orderResponse"

interface OrderCardProps {
  order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get order status styling
  const getOrderStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          icon: <Clock className="w-4 h-4" />,
          label: "Chờ xử lý",
        }
      case "confirmed":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-300",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Đã xác nhận",
        }
      case "processing":
        return {
          bg: "bg-indigo-100",
          text: "text-indigo-800",
          border: "border-indigo-300",
          icon: <Package className="w-4 h-4" />,
          label: "Đang xử lý",
        }
      case "shipped":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-300",
          icon: <Truck className="w-4 h-4" />,
          label: "Đang giao hàng",
        }
      case "delivered":
      case "completed":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
          icon: <CheckCircle className="w-4 h-4" />,
          label: "Hoàn thành",
        }
      case "cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          icon: <XCircle className="w-4 h-4" />,
          label: "Đã hủy",
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          icon: <Clock className="w-4 h-4" />,
          label: status,
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
          label: "Chờ thanh toán",
        }
      case "paid":
      case "success":
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          label: "Đã thanh toán",
        }
      case "failed":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          label: "Thanh toán thất bại",
        }
      case "refunded":
        return {
          bg: "bg-purple-50",
          text: "text-purple-700",
          label: "Đã hoàn tiền",
        }
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
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

  const orderStatus = getOrderStatusStyle(order.status)
  const paymentStatus = getPaymentStatusStyle(order.paymentStatus)

  // Count items by type
  const productCount = order.orderItems.filter(isProductItem).length
  const treeCount = order.orderItems.filter(isTreeItem).length

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Order ID and Date */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Đơn hàng #{order.orderId}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </div>
            </div>
          </div>

          {/* Statuses */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Order Status */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${orderStatus.bg} ${orderStatus.text} border ${orderStatus.border}`}
            >
              {orderStatus.icon}
              {orderStatus.label}
            </span>

            {/* Payment Status */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${paymentStatus.bg} ${paymentStatus.text}`}
            >
              <CreditCard className="w-4 h-4" />
              {paymentStatus.label}
            </span>
          </div>
        </div>

        {/* Summary Row */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {/* Items count */}
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>
              {order.orderItems.length} sản phẩm
              {productCount > 0 && treeCount > 0 && (
                <span className="text-gray-400 ml-1">
                  ({productCount} hàng, {treeCount} cây)
                </span>
              )}
            </span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">|</span>
            <span>Người bán: {order.sellerName}</span>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">|</span>
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-xs">{order.shippingAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Summary */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div>
            <span className="text-gray-500">Tạm tính:</span>
            <span className="ml-2 font-medium text-gray-900">
              {order.subtotalFormatted}
            </span>
          </div>
          {order.shippingFee > 0 && (
            <div>
              <span className="text-gray-500">Phí vận chuyển:</span>
              <span className="ml-2 font-medium text-gray-900">
                {order.shippingFeeFormatted}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-medium">Tổng cộng:</span>
          <span className="text-2xl font-bold text-[var(--color-main)]">
            {order.totalAmountFormatted}
          </span>
        </div>

        {/* View Detail Button */}
        <button
          onClick={() => navigate(`/orders/${order.orderId}`)}
          className="px-4 py-2 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Eye className="w-4 h-4" />
          Xem chi tiết
        </button>
      </div>

      {/* Expandable Items Section */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span>Xem chi tiết đơn hàng</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-4">
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {/* Image */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-white border border-gray-200">
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                      {isTreeItem(item) ? (
                        <TreeDeciduous className="w-8 h-8 text-green-500" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      {isTreeItem(item) && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            <TreeDeciduous className="w-3 h-3" />
                            Nhận nuôi
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.productType} - {item.productVariety}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      x{item.quantity}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {isTreeItem(item) ? (
                        <span>
                          {item.treeQuantity} cây ×{" "}
                          {item.treeUnitPriceFormatted}
                        </span>
                      ) : isProductItem(item) ? (
                        <span>{item.unitPriceFormatted}</span>
                      ) : null}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {isTreeItem(item)
                        ? item.treeTotalPriceFormatted
                        : isProductItem(item)
                        ? item.totalPriceFormatted
                        : ""}
                    </div>
                  </div>

                  {isTreeItem(item) && item.farmName && (
                    <div className="mt-1 text-xs text-gray-500">
                      Nhà vườn: {item.farmName}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Notes */}
            {order.notes && (
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Ghi chú:</span> {order.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard
