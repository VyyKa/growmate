import { Package, CheckCircle, Clock, XCircle } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { ProductItem } from "../../../types/apiResponse/productResponse"

interface AdminProductStatisticProps {
  products: ProductItem[]
}

const AdminProductStatistic = ({ products }: AdminProductStatisticProps) => {
  // Product statistics
  const productStats = {
    total: products.length,
    approved: products.filter((p) => p.status?.toLowerCase() === "approved")
      .length,
    pending: products.filter((p) => p.status?.toLowerCase() === "pending")
      .length,
    rejected: products.filter((p) => p.status?.toLowerCase() === "rejected")
      .length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    avgPrice:
      products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0,
  }

  // Product status distribution
  const getProductStatusData = () => {
    return [
      { name: "Đã duyệt", value: productStats.approved, color: "#10B981" },
      { name: "Chờ duyệt", value: productStats.pending, color: "#F59E0B" },
      { name: "Từ chối", value: productStats.rejected, color: "#EF4444" },
    ]
  }

  // Products by category
  const getProductsByCategory = () => {
    const categoryMap = new Map<string, number>()
    products.forEach((p) => {
      const categoryName = p.categoryName || "Không xác định"
      const count = categoryMap.get(categoryName) || 0
      categoryMap.set(categoryName, count + 1)
    })
    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6) // Top 6 categories
  }

  // Price range distribution
  const getPriceRangeData = () => {
    const ranges = [
      { name: "<50k", min: 0, max: 50000, count: 0 },
      { name: "50k-100k", min: 50000, max: 100000, count: 0 },
      { name: "100k-200k", min: 100000, max: 200000, count: 0 },
      { name: "200k-500k", min: 200000, max: 500000, count: 0 },
      { name: ">500k", min: 500000, max: Infinity, count: 0 },
    ]

    products.forEach((p) => {
      const range = ranges.find((r) => p.price >= r.min && p.price < r.max)
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
      {/* Product Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tổng sản phẩm</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {productStats.total}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Trên hệ thống</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
              <h3 className="text-3xl font-bold text-green-600">
                {productStats.approved}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {productStats.total > 0
                  ? (
                      (productStats.approved / productStats.total) *
                      100
                    ).toFixed(1)
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
              <p className="text-sm text-gray-600 mb-1">Giá trị kho</p>
              <h3 className="text-2xl font-bold text-purple-600">
                {formatCurrency(productStats.totalValue)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Tổng giá trị</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Giá trung bình</p>
              <h3 className="text-2xl font-bold text-orange-600">
                {formatCurrency(productStats.avgPrice)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Trên sản phẩm</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Product Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Product Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Phân bổ theo trạng thái
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getProductStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {getProductStatusData().map((entry, index) => (
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
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="font-bold text-gray-900">{productStats.approved}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="font-bold text-gray-900">{productStats.pending}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm text-gray-600">Từ chối</p>
              <p className="font-bold text-gray-900">{productStats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Products by Category */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Sản phẩm theo danh mục (Top 6)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getProductsByCategory()}>
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

      {/* Price Range Distribution */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Phân bổ theo khoảng giá
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getPriceRangeData()}>
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
            <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminProductStatistic
