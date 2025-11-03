import { useAppSelector } from "../../hooks/reduxHooks"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Package,
  ShoppingCart,
  Sprout,
  DollarSign,
  Plus,
  TreePine,
  ChevronRight,
  Hand,
} from "lucide-react"
import { getPosts } from "../../services/API/postAPI"
import { getUsers } from "../../services/API/userAPI"
import type { PostItem } from "../../types/apiResponse/postResponse"

const FarmerHome = () => {
  const nav = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch farmer ID and recent posts
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return

      try {
        // Get farmer ID
        const response = await getUsers({ id: user.userId })
        const userData = response

        if (
          "farmer" in userData &&
          userData.farmer &&
          userData.farmer.farmerId
        ) {
          const id = userData.farmer.farmerId

          // Fetch recent posts
          const postsResponse = await getPosts({
            farmerId: id,
            page: 1,
            pageSize: 5,
          })
          const postsData = postsResponse.data
          if (postsData && "items" in postsData) {
            setRecentPosts(postsData.items)
          }
        }
      } catch (error) {
        console.error("Failed to fetch farmer data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.userId])

  // Mock data - replace with real API calls
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: "24",
      change: "+2 tuần này",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Bài đăng mới",
      value: "12",
      change: "+5 hôm nay",
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Cây được nhận nuôi",
      value: "48",
      change: "+8 tháng này",
      icon: Sprout,
      color: "bg-emerald-500",
    },
    {
      title: "Doanh thu tháng",
      value: "15.5M",
      change: "+12% so tháng trước",
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ]

  const quickActions = [
    {
      title: "Thêm cây cho nhận nuôi",
      description: "Đăng sản phẩm mới lên cửa hàng",
      icon: Plus,
      path: "/farmer/adoptions/new",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      title: "Cây nhận nuôi",
      description: "Quản lý cây được khách nhận nuôi",
      icon: TreePine,
      path: "/farmer/adoptions",
      color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    },
  ]

  const getPostStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPostStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Bị từ chối"
      default:
        return status
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  return (
    <div className="container mx-auto py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Xin chào, {user?.fullName || "Farmer"}!
          </h1>
          <Hand className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-gray-600">
          Chào mừng bạn quay trở lại với bảng điều khiển của mình
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-green-600 font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Thao tác nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={() => nav(action.path)}
                className={`${action.color} rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <IconComponent className="w-10 h-10 mb-3" />
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bài đăng gần đây</h2>
          <button
            onClick={() => nav("/farmer/adoptions")}
            className="text-main hover:text-green-700 font-semibold text-sm flex items-center gap-2"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-main)]"></div>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-12">
            <TreePine className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-2">
              Chưa có bài đăng nào
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Hãy tạo bài đăng đầu tiên để bắt đầu
            </p>
            <button
              onClick={() => nav("/farmer/adoptions/new")}
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Tạo bài đăng mới
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Mã bài đăng
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Tên sản phẩm
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Loại/Giống
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Số lượng cây
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Giá/năm
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr
                    key={post.postId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => nav(`/farmer/adoptions`)}
                  >
                    <td className="py-4 px-4 font-mono text-sm text-gray-900">
                      #{post.postId.toString().padStart(3, "0")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                      {post.productName}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {post.productType} / {post.productVariety}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-700">
                      {post.treeQuantity} cây
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-purple-700">
                      {formatPrice(post.pricePerYear)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`${getPostStatusColor(
                          post.status
                        )} px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {getPostStatusText(post.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmerHome
