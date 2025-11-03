import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
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
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts"
import type { PaymentResponse } from "../../../types/apiResponse/paymentResponse"

interface AdminPaymentStatisticProps {
  payments: PaymentResponse[]
}

const AdminPaymentStatistic = ({ payments }: AdminPaymentStatisticProps) => {
  // Payment statistics
  const stats = {
    total: payments.length,
    completed: payments.filter(
      (p) =>
        p.status?.toLowerCase() === "completed" ||
        p.status?.toLowerCase() === "success"
    ).length,
    pending: payments.filter((p) => p.status?.toLowerCase() === "pending")
      .length,
    failed: payments.filter(
      (p) =>
        p.status?.toLowerCase() === "failed" ||
        p.status?.toLowerCase() === "cancelled"
    ).length,
    totalRevenue: payments
      .filter(
        (p) =>
          p.status?.toLowerCase() === "completed" ||
          p.status?.toLowerCase() === "success"
      )
      .reduce((sum, p) => sum + p.amount, 0),
    avgPayment:
      payments.length > 0
        ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length
        : 0,
  }

  // Payment status distribution
  const getPaymentStatusData = () => {
    return [
      { name: "Thành công", value: stats.completed, color: "#10B981" },
      { name: "Chờ xử lý", value: stats.pending, color: "#F59E0B" },
      { name: "Thất bại", value: stats.failed, color: "#EF4444" },
    ]
  }

  // Payment methods distribution
  const getPaymentMethodData = () => {
    const methodMap = new Map<string, number>()
    payments.forEach((p) => {
      const method = p.paymentMethod || "Không xác định"
      const count = methodMap.get(method) || 0
      methodMap.set(method, count + 1)
    })
    return Array.from(methodMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  // Revenue by month (last 6 months)
  const getMonthlyRevenue = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("vi-VN", { month: "short" })
      const revenue = payments
        .filter((p) => {
          const paymentDate = new Date(p.paymentDate)
          return (
            paymentDate.getMonth() === date.getMonth() &&
            paymentDate.getFullYear() === date.getFullYear() &&
            (p.status?.toLowerCase() === "completed" ||
              p.status?.toLowerCase() === "success")
          )
        })
        .reduce((sum, p) => sum + p.amount, 0)
      months.push({ month: monthName, revenue })
    }
    return months
  }

  // Daily payments trend (last 7 days)
  const getDailyPayments = () => {
    const days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString("vi-VN", { weekday: "short" })
      const completed = payments.filter((p) => {
        const paymentDate = new Date(p.paymentDate)
        return (
          paymentDate.toDateString() === date.toDateString() &&
          (p.status?.toLowerCase() === "completed" ||
            p.status?.toLowerCase() === "success")
        )
      }).length
      const pending = payments.filter((p) => {
        const paymentDate = new Date(p.paymentDate)
        return (
          paymentDate.toDateString() === date.toDateString() &&
          p.status?.toLowerCase() === "pending"
        )
      }).length
      days.push({ day: dayName, completed, pending })
    }
    return days
  }

  // Amount range distribution
  const getAmountRangeData = () => {
    const ranges = [
      { name: "<100k", min: 0, max: 100000, count: 0 },
      { name: "100k-500k", min: 100000, max: 500000, count: 0 },
      { name: "500k-1M", min: 500000, max: 1000000, count: 0 },
      { name: "1M-5M", min: 1000000, max: 5000000, count: 0 },
      { name: ">5M", min: 5000000, max: Infinity, count: 0 },
    ]

    payments.forEach((p) => {
      const range = ranges.find((r) => p.amount >= r.min && p.amount < r.max)
      if (range) range.count++
    })

    return ranges
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
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
      {/* Payment Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng giao dịch</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats.total}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Trên hệ thống</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thành công</p>
              <h3 className="text-3xl font-bold text-green-600">
                {stats.completed}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {stats.total > 0
                  ? ((stats.completed / stats.total) * 100).toFixed(1)
                  : 0}
                % tổng số
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.totalRevenue)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Từ giao dịch</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Trung bình</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.avgPayment)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Mỗi giao dịch</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Status & Payment Methods */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Payment Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phân bổ theo trạng thái
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPaymentStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getPaymentStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-600">Thành công</p>
              <p className="font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600">Chờ xử lý</p>
              <p className="font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm text-gray-600">Thất bại</p>
              <p className="font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phương thức thanh toán
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPaymentMethodData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Monthly Revenue */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Doanh thu theo tháng (6 tháng gần nhất)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getMonthlyRevenue()}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [
                formatCurrency(value),
                "Doanh thu",
              ]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 3: Daily Payments & Amount Range */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Daily Payments Trend */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Giao dịch theo ngày (7 ngày gần nhất)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getDailyPayments()}>
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
                dataKey="completed"
                name="Thành công"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="pending"
                name="Chờ xử lý"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: "#F59E0B", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Amount Range Distribution */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phân bổ theo khoảng giá trị
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getAmountRangeData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminPaymentStatistic
