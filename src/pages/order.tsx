import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Package,
  Search,
  Filter,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { getOrders } from "../services/API/orderAPI"
import type { Order } from "../types/apiResponse/orderResponse"
import Breadcrumb from "../components/Breadcrumb"
import OrderCard from "../components/OrderCard"
import { toast } from "react-toastify"

const OrderPage = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await getOrders()
      const data = response.data
      if (Array.isArray(data)) {
        // Sort by createdAt desc (newest first)
        const sorted = [...data].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setOrders(sorted)
        setFilteredOrders(sorted)
      } else {
        setOrders([])
        setFilteredOrders([])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Không thể tải danh sách đơn hàng")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...orders]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.orderId.toString().includes(query) ||
          order.sellerName?.toLowerCase().includes(query) ||
          order.shippingAddress?.toLowerCase().includes(query) ||
          order.orderItems.some((item) =>
            item.productName?.toLowerCase().includes(query)
          )
      )
    }

    setFilteredOrders(filtered)
  }, [searchQuery, statusFilter, orders])

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status.toLowerCase() === "pending").length,
    processing: orders.filter(
      (o) =>
        o.status.toLowerCase() === "processing" ||
        o.status.toLowerCase() === "confirmed"
    ).length,
    shipped: orders.filter((o) => o.status.toLowerCase() === "shipped").length,
    completed: orders.filter(
      (o) =>
        o.status.toLowerCase() === "completed" ||
        o.status.toLowerCase() === "delivered"
    ).length,
    cancelled: orders.filter((o) => o.status.toLowerCase() === "cancelled")
      .length,
  }

  if (isLoading) {
    return (
      <>
        <Breadcrumb
          breadcrumbItems={[
            { label: "Trang chủ", path: "/" },
            { label: "Đơn hàng của tôi", path: "/orders", isActive: true },
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
              Đang tải đơn hàng...
            </p>
            <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
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
          { label: "Đơn hàng của tôi", path: "/orders", isActive: true },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-2xl shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Đơn hàng của tôi
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Quản lý và theo dõi các đơn hàng của bạn
                  </p>
                </div>
              </div>

              <button
                onClick={fetchOrders}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                title="Làm mới"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Tổng đơn</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm text-gray-600">Chờ xử lý</p>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-indigo-500" />
                  <p className="text-sm text-gray-600">Đang xử lý</p>
                </div>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {stats.processing}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-500" />
                  <p className="text-sm text-gray-600">Đang giao</p>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {stats.shipped}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-gray-600">Đã hủy</p>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn, sản phẩm, người bán, địa chỉ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="relative md:w-64">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || statusFilter !== "all") && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">
                  Bộ lọc:
                </span>
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    Tìm kiếm: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-2">
                    Trạng thái: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-[var(--color-main)] font-medium transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                {orders.length === 0 ? (
                  <ShoppingBag className="w-12 h-12 text-gray-400" />
                ) : (
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {orders.length === 0
                  ? "Chưa có đơn hàng nào"
                  : "Không tìm thấy đơn hàng"}
              </h3>
              <p className="text-gray-500 mb-6">
                {orders.length === 0
                  ? "Hãy khám phá các sản phẩm và tạo đơn hàng đầu tiên của bạn!"
                  : "Không có đơn hàng nào phù hợp với bộ lọc của bạn"}
              </p>
              {orders.length === 0 ? (
                <button
                  onClick={() => navigate("/product")}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Khám phá sản phẩm
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.orderId} order={order} />
              ))}
            </div>
          )}

          {/* Results count */}
          {filteredOrders.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OrderPage
