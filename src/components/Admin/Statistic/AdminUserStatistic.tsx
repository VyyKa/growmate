import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts"
import type { UserWithRelations } from "../../../types/apiResponse/userResponse"
import { UserRole } from "../../../types/enums/UserRole"

interface AdminUserStatisticProps {
  users: UserWithRelations[]
}

const AdminUserStatistic = ({ users }: AdminUserStatisticProps) => {
  // Statistics calculations
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    customers: users.filter((u) => u.role === UserRole.Customer).length,
    farmers: users.filter((u) => u.role === UserRole.Farmer).length,
    admins: users.filter((u) => u.role === UserRole.Admin).length,
    newThisMonth: users.filter((u) => {
      const created = new Date(u.createdAt)
      const now = new Date()
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      )
    }).length,
  }

  // Role distribution data
  const roleData = [
    { name: "Customer", value: stats.customers, color: "#3B82F6" },
    { name: "Farmer", value: stats.farmers, color: "#10B981" },
    { name: "Admin", value: stats.admins, color: "#8B5CF6" },
  ]

  // Status distribution data
  const statusData = [
    { name: "Hoạt động", value: stats.active, color: "#10B981" },
    { name: "Vô hiệu hóa", value: stats.inactive, color: "#EF4444" },
  ]

  // User growth by month (last 6 months)
  const getMonthlyGrowth = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("vi-VN", { month: "short" })
      const count = users.filter((u) => {
        const created = new Date(u.createdAt)
        return (
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        )
      }).length
      months.push({ month: monthName, users: count })
    }
    return months
  }

  // User registration trend (last 7 days)
  const getDailyRegistrations = () => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString("vi-VN", { weekday: "short" })
      const count = users.filter((u) => {
        const created = new Date(u.createdAt)
        return created.toDateString() === date.toDateString()
      }).length
      days.push({
        day: dayName,
        registrations: count,
        active: Math.floor(count * 0.85), // Mock active rate
      })
    }
    return days
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{payload[0].name}</p>
          <p className="text-sm text-gray-600">Số lượng: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.total}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  +{stats.newThisMonth} tháng này
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
              <h3 className="text-3xl font-bold text-green-600">
                {stats.active}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {((stats.active / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vô hiệu hóa</p>
              <h3 className="text-3xl font-bold text-red-600">
                {stats.inactive}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {((stats.inactive / stats.total) * 100).toFixed(1)}% tổng số
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Phân loại</p>
              <div className="space-y-1 mt-2">
                <p className="text-sm">
                  <span className="font-semibold text-blue-600">
                    {stats.customers}
                  </span>{" "}
                  Khách hàng
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-green-600">
                    {stats.farmers}
                  </span>{" "}
                  Nông dân
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-purple-600">
                    {stats.admins}
                  </span>{" "}
                  Admin
                </p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Role Distribution & Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Role Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phân bổ theo vai trò
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-bold text-gray-900">{stats.customers}</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Farmer</p>
              <p className="font-bold text-gray-900">{stats.farmers}</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Admin</p>
              <p className="font-bold text-gray-900">{stats.admins}</p>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phân bổ theo trạng thái
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Hoạt động</p>
              <p className="font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Vô hiệu hóa</p>
              <p className="font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Monthly Growth */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Tăng trưởng người dùng (6 tháng gần nhất)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getMonthlyGrowth()}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              name="Người dùng mới"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 3: Daily Registrations */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Đăng ký mới (7 ngày gần nhất)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getDailyRegistrations()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="registrations"
              name="Đăng ký mới"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="active"
              name="Đã kích hoạt"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminUserStatistic
