import { useState, useEffect, useMemo } from "react"
import {
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Loader2 } from "lucide-react"
import { getPayments } from "../../services/API/paymentAPI"
import type { PaymentResponse } from "../../types/apiResponse/paymentResponse"

type ChartPeriod = "7days" | "30days" | "90days"

interface ChartDataPoint {
  date: string
  revenue: number
  orders: number
}

interface RevenueChartProps {
  className?: string
}

const RevenueChart = ({ className = "" }: RevenueChartProps) => {
  const [period, setPeriod] = useState<ChartPeriod>("7days")
  const [payments, setPayments] = useState<PaymentResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true)
      try {
        const res = await getPayments({ page: 1, pageSize: 1000 })
        const allPayments = res.data?.items || []
        // Only SUCCESS payments
        const successPayments = allPayments.filter(
          (p) => p.status?.toUpperCase() === "SUCCESS"
        )
        setPayments(successPayments)
      } catch (error) {
        console.error("Failed to fetch payments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  // Process payments into chart data based on period
  const chartData = useMemo((): ChartDataPoint[] => {
    if (payments.length === 0) return []

    const now = new Date()
    let daysBack: number
    let groupBy: "day" | "week" | "month"

    switch (period) {
      case "7days":
        daysBack = 7
        groupBy = "day"
        break
      case "30days":
        daysBack = 30
        groupBy = "week"
        break
      case "90days":
        daysBack = 90
        groupBy = "month"
        break
      default:
        daysBack = 7
        groupBy = "day"
    }

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysBack)

    // Filter payments within the period
    const filteredPayments = payments.filter((p) => {
      const paymentDate = new Date(p.paymentDate || p.createdAt || "")
      return paymentDate >= startDate && paymentDate <= now
    })

    // Group payments
    const groups: Record<string, { revenue: number; orders: number }> = {}

    if (groupBy === "day") {
      // Last 7 days
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split("T")[0]
        const dayName = dayNames[d.getDay()]
        groups[key] = { revenue: 0, orders: 0 }
        // Store dayName for display
        ;(
          groups[key] as { revenue: number; orders: number; label?: string }
        ).label = dayName
      }

      filteredPayments.forEach((p) => {
        const paymentDate = new Date(p.paymentDate || p.createdAt || "")
        const key = paymentDate.toISOString().split("T")[0]
        if (groups[key]) {
          groups[key].revenue += p.amount || 0
          groups[key].orders += 1
        }
      })

      return Object.entries(groups).map(([, value]) => ({
        date: (value as { label?: string }).label || "",
        revenue: value.revenue,
        orders: value.orders,
      }))
    } else if (groupBy === "week") {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekLabel = `Tuần ${4 - i}`
        groups[weekLabel] = { revenue: 0, orders: 0 }
      }

      filteredPayments.forEach((p) => {
        const paymentDate = new Date(p.paymentDate || p.createdAt || "")
        const daysDiff = Math.floor(
          (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        const weekIndex = Math.min(3, Math.floor(daysDiff / 7))
        const weekLabel = `Tuần ${4 - weekIndex}`
        if (groups[weekLabel]) {
          groups[weekLabel].revenue += p.amount || 0
          groups[weekLabel].orders += 1
        }
      })

      return Object.entries(groups).map(([key, value]) => ({
        date: key,
        revenue: value.revenue,
        orders: value.orders,
      }))
    } else {
      // Last 3 months
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now)
        d.setMonth(d.getMonth() - i)
        const monthLabel = `Tháng ${d.getMonth() + 1}`
        groups[monthLabel] = { revenue: 0, orders: 0 }
      }

      filteredPayments.forEach((p) => {
        const paymentDate = new Date(p.paymentDate || p.createdAt || "")
        const monthLabel = `Tháng ${paymentDate.getMonth() + 1}`
        if (groups[monthLabel]) {
          groups[monthLabel].revenue += p.amount || 0
          groups[monthLabel].orders += 1
        }
      })

      return Object.entries(groups).map(([key, value]) => ({
        date: key,
        revenue: value.revenue,
        orders: value.orders,
      }))
    }
  }, [payments, period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: { date: string }; value: number }>
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {payload[0].payload.date}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-main)]"></div>
              <span className="text-xs text-gray-600">Doanh thu:</span>
              <span className="text-sm font-bold text-gray-900">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(payload[0].value)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-600">Đơn hàng:</span>
              <span className="text-sm font-bold text-gray-900">
                {payload[1].value}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-100 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Biểu đồ doanh thu</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod("7days")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              period === "7days"
                ? "bg-[var(--color-main)] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            7 ngày
          </button>
          <button
            onClick={() => setPeriod("30days")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              period === "30days"
                ? "bg-[var(--color-main)] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => setPeriod("90days")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              period === "90days"
                ? "bg-[var(--color-main)] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            90 ngày
          </button>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[320px]">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[320px] text-gray-500">
          Chưa có dữ liệu thanh toán
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#08A045" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#08A045" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tickLine={false}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
              iconType="circle"
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#08A045"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              name="Đơn hàng"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Tổng doanh thu</p>
          <p className="text-lg font-bold text-[var(--color-main)]">
            {isLoading
              ? "..."
              : formatCurrency(
                  chartData.reduce((sum, item) => sum + item.revenue, 0)
                )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Tổng đơn hàng</p>
          <p className="text-lg font-bold text-blue-600">
            {isLoading
              ? "..."
              : chartData.reduce((sum, item) => sum + item.orders, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart
