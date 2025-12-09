import { useState, useMemo } from "react"
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
  const [isLoading] = useState(false)

  const MOCK_DATA: Record<ChartPeriod, ChartDataPoint[]> = {
    "7days": [
      { date: "T2", revenue: 300_000, orders: 1 },
      { date: "T3", revenue: 800_000, orders: 3 },
      { date: "T4", revenue: 500_000, orders: 2 },
      { date: "T5", revenue: 1_200_000, orders: 5 },
      { date: "T6", revenue: 900_000, orders: 4 },
      { date: "T7", revenue: 700_000, orders: 3 },
      { date: "CN", revenue: 1_500_000, orders: 5 },
    ],
    "30days": [
      { date: "Tuần 1", revenue: 2_000_000, orders: 6 },
      { date: "Tuần 2", revenue: 1_800_000, orders: 5 },
      { date: "Tuần 3", revenue: 2_400_000, orders: 7 },
      { date: "Tuần 4", revenue: 1_900_000, orders: 5 },
    ],
    "90days": [
      { date: "Tháng 1", revenue: 5_500_000, orders: 8 },
      { date: "Tháng 2", revenue: 4_800_000, orders: 7 },
      { date: "Tháng 3", revenue: 6_200_000, orders: 8 },
    ],
  }

  const chartData = useMemo((): ChartDataPoint[] => MOCK_DATA[period], [period])

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
