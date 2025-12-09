import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  TreePine,
  Package,
  DollarSign,
  Activity,
  Calendar,
  Loader2,
} from "lucide-react"
import RevenueChart from "../../components/Admin/RevenueChart"
import { getUsers } from "../../services/API/userAPI"
import { getTrees } from "../../services/API/treeAPI"
import { getPayments } from "../../services/API/paymentAPI"
import type { UsersListResponse } from "../../types/apiResponse/userResponse"
import { UserRole } from "../../types/enums/UserRole"

const AdminHome = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrees: 0,
    totalRevenue: 0,
  })

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const [usersRes, treesRes, paymentsRes] = await Promise.all([
          getUsers({ page: 1, pageSize: 1000 }),
          getTrees({ page: 1, pageSize: 1000 }),
          getPayments({ page: 1, pageSize: 1000 }),
        ])

        const usersData = usersRes as UsersListResponse
        const totalUsers =
          usersData.items?.filter((u) => u.role === UserRole.Customer).length ||
          0
        const totalTrees = treesRes.data?.totalItems || 0

        // Calculate total revenue from SUCCESS payments only
        const payments = paymentsRes.data?.items || []
        const totalRevenue = payments
          .filter((p) => p.status?.toUpperCase() === "SUCCESS")
          .reduce((sum, p) => sum + (p.amount || 0), 0)

        setStats({
          totalUsers,
          totalTrees,
          totalRevenue,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const statCards = [
    {
      title: "Tổng khách hàng",
      value: isLoading ? "..." : stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Tổng cây trồng",
      value: isLoading ? "..." : stats.totalTrees.toLocaleString(),
      icon: TreePine,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Tổng doanh thu",
      value: isLoading ? "..." : formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ]

  const quickActions = [
    {
      title: "Thêm User",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Xem đơn hàng",
      icon: Package,
      path: "/admin/products",
    },
    {
      title: "Xem báo cáo",
      icon: Activity,
      path: "/admin/reports",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống GrowMate</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium mb-2">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  ) : (
                    stat.value
                  )}
                </h3>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-[var(--color-main)] hover:bg-green-50 transition-all duration-200 group"
            >
              <action.icon className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-main)] transition-colors mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-main)] transition-colors">
                {action.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart className="xl:col-span-2" />
    </div>
  )
}

export default AdminHome
