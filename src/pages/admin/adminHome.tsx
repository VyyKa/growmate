import { useState } from "react"
import {
  Users,
  TreePine,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
} from "lucide-react"
import RevenueChart from "../../components/Admin/RevenueChart"

const AdminHome = () => {
  const [stats] = useState({
    totalUsers: 1245,
    userGrowth: 12.5,
    totalTrees: 3420,
    treeGrowth: 8.3,
    totalOrders: 892,
    orderGrowth: -3.2,
    totalRevenue: 45678000,
    revenueGrowth: 15.7,
  })

  const [recentActivities] = useState([
    {
      id: 1,
      type: "user",
      action: "Người dùng mới đăng ký",
      user: "Nguyễn Văn A",
      time: "5 phút trước",
    },
    {
      id: 2,
      type: "order",
      action: "Đơn hàng mới",
      user: "Trần Thị B",
      time: "12 phút trước",
    },
    {
      id: 3,
      type: "tree",
      action: "Bài đăng cây mới",
      user: "Farmer Vườn Xanh",
      time: "25 phút trước",
    },
    {
      id: 4,
      type: "user",
      action: "Người dùng cập nhật profile",
      user: "Lê Văn C",
      time: "1 giờ trước",
    },
    {
      id: 5,
      type: "order",
      action: "Đơn hàng hoàn thành",
      user: "Phạm Thị D",
      time: "2 giờ trước",
    },
  ])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers.toLocaleString(),
      growth: stats.userGrowth,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Tổng cây trồng",
      value: stats.totalTrees.toLocaleString(),
      growth: stats.treeGrowth,
      icon: TreePine,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toLocaleString(),
      growth: stats.orderGrowth,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      growth: stats.revenueGrowth,
      icon: DollarSign,
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1">
                  {stat.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      stat.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {Math.abs(stat.growth)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    so với tháng trước
                  </span>
                </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-[var(--color-main)] hover:bg-green-50 transition-all duration-200 group">
            <Users className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-main)] transition-colors mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-main)] transition-colors">
              Thêm User
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-[var(--color-main)] hover:bg-green-50 transition-all duration-200 group">
            <TreePine className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-main)] transition-colors mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-main)] transition-colors">
              Quản lý cây
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-[var(--color-main)] hover:bg-green-50 transition-all duration-200 group">
            <Package className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-main)] transition-colors mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-main)] transition-colors">
              Xem đơn hàng
            </p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-[var(--color-main)] hover:bg-green-50 transition-all duration-200 group">
            <Activity className="w-8 h-8 text-gray-400 group-hover:text-[var(--color-main)] transition-colors mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 group-hover:text-[var(--color-main)] transition-colors">
              Xem báo cáo
            </p>
          </button>
        </div>
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <RevenueChart className="xl:col-span-2" />

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Hoạt động gần đây
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "user"
                      ? "bg-blue-100"
                      : activity.type === "order"
                      ? "bg-purple-100"
                      : "bg-green-100"
                  }`}
                >
                  {activity.type === "user" ? (
                    <Users className="w-4 h-4 text-blue-600" />
                  ) : activity.type === "order" ? (
                    <Package className="w-4 h-4 text-purple-600" />
                  ) : (
                    <TreePine className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
