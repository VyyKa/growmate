import { useEffect, useState } from "react"
import { BarChart3, Users, DollarSign } from "lucide-react"
import AdminUserStatistic from "../../components/Admin/Statistic/AdminUserStatistic"
import AdminProductStatistic from "../../components/Admin/Statistic/AdminProductStatistic"
import AdminPaymentStatistic from "../../components/Admin/Statistic/AdminPaymentStatistic"
import { getUsers } from "../../services/API/userAPI"
import {
  getApprovedProducts,
  getPendingProducts,
} from "../../services/API/productAPI"
import { getPayments } from "../../services/API/paymentAPI"
import type {
  UserWithRelations,
  UsersListResponse,
} from "../../types/apiResponse/userResponse"
import type { ProductItem } from "../../types/apiResponse/productResponse"
import type { PaymentResponse } from "../../types/apiResponse/paymentResponse"

type TabKey = "users" | "products" | "payments"

const AdminReport = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("users")
  const [users, setUsers] = useState<UserWithRelations[]>([])
  const [products, setProducts] = useState<ProductItem[]>([])
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch users, products, and payments in parallel
        const [userRes, approvedRes, pendingRes, paymentRes] =
          await Promise.all([
            getUsers({ page: 1, pageSize: 500 }),
            getApprovedProducts({ page: 1, pageSize: 500 }),
            getPendingProducts({ page: 1, pageSize: 500 }),
            getPayments({ page: 1, pageSize: 500 }),
          ])

        // Handle users response
        const usersData: UserWithRelations[] =
          "items" in (userRes as UsersListResponse)
            ? (userRes as UsersListResponse).items
            : [userRes as UserWithRelations]
        setUsers(usersData)

        // Combine approved and pending products
        const allProducts = [
          ...(approvedRes.data.items || []),
          ...(pendingRes.data.items || []),
        ]
        setProducts(allProducts)

        // Handle payments response
        const paymentsData = paymentRes.data.items || []
        setPayments(paymentsData)
      } catch (error) {
        console.error("Failed to fetch report data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Báo cáo & Thống kê
            </h1>
            <p className="text-gray-600 mt-1">
              Tổng quan dữ liệu người dùng và sản phẩm
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "users"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Users className="w-5 h-5" />
            Người dùng
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "products"
                ? "bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Sản phẩm
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "payments"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Thanh toán
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[var(--color-main)] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Đang tải dữ liệu báo cáo...
          </p>
        </div>
      ) : (
        <div className="animate-fadeIn">
          {activeTab === "users" ? (
            <AdminUserStatistic users={users} />
          ) : activeTab === "products" ? (
            <AdminProductStatistic products={products} />
          ) : (
            <AdminPaymentStatistic payments={payments} />
          )}
        </div>
      )}
    </div>
  )
}

export default AdminReport
