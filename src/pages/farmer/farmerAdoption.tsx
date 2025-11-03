import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  Sprout,
  Filter,
  Search,
  Calendar,
  TreeDeciduous,
  Plus,
} from "lucide-react"
import { useAppSelector } from "../../hooks/reduxHooks"
import { getPosts, deletePost } from "../../services/API/postAPI"
import { getUsers } from "../../services/API/userAPI"
import FarmerTreeCard from "../../components/Farmer/FarmerTreeCard"
import Pagination from "../../components/Pagination"
import type { PostItem } from "../../types/apiResponse/postResponse"
import { getErrorMessage } from "../../hooks/getErrorMessage"

const FarmerAdoption = () => {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  // State
  const [farmerId, setFarmerId] = useState<number | null>(null)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 12

  // Fetch farmer ID
  useEffect(() => {
    const fetchFarmerId = async () => {
      if (!user?.userId) {
        toast.error("Không tìm thấy thông tin người dùng")
        navigate("/login")
        return
      }

      try {
        const response = await getUsers({ id: user.userId })
        const userData = response

        if (
          "farmer" in userData &&
          userData.farmer &&
          userData.farmer.farmerId
        ) {
          setFarmerId(userData.farmer.farmerId)
        } else {
          toast.error("Tài khoản của bạn chưa được liên kết với farmer")
          navigate("/farmer")
        }
      } catch (error) {
        console.error("Failed to fetch farmer info:", error)
        toast.error("Không thể tải thông tin farmer")
        navigate("/farmer")
      }
    }

    fetchFarmerId()
  }, [user?.userId, navigate])

  // Fetch posts when farmerId is available
  useEffect(() => {
    const fetchPosts = async () => {
      if (!farmerId) return

      try {
        setIsLoading(true)
        const response = await getPosts({
          farmerId,
          page: currentPage,
          pageSize,
        })
        const data = response.data
        if (data && "items" in data) {
          setPosts(data.items)
          setFilteredPosts(data.items)
          setTotalPages(data.totalPages)
          setTotalItems(data.totalItems)
        } else {
          setPosts([])
          setFilteredPosts([])
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error)
        toast.error(getErrorMessage(error, "Không thể tải danh sách bài đăng"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [farmerId, currentPage])

  // Filter posts when search or status filter changes
  useEffect(() => {
    let filtered = [...posts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.productName.toLowerCase().includes(query) ||
          post.productVariety.toLowerCase().includes(query) ||
          post.farmName.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, statusFilter, posts])

  // Get unique statuses for filter
  const availableStatuses = Array.from(new Set(posts.map((p) => p.status)))

  // Handle edit post
  const handleEdit = (postId: number) => {
    navigate(`/farmer/posts/${postId}/edit`)
  }

  // Handle delete post
  const handleDelete = async (postId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) return

    try {
      await deletePost(postId)
      toast.success("Xóa bài đăng thành công!")
      // Reload posts
      setPosts((prev) => prev.filter((p) => p.postId !== postId))
      setFilteredPosts((prev) => prev.filter((p) => p.postId !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
      toast.error(getErrorMessage(error, "Xóa bài đăng thất bại"))
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-[var(--color-main)]/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-main)] rounded-full animate-spin"></div>
            <Sprout className="w-10 h-10 text-[var(--color-main)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            Đang tải danh sách bài đăng...
          </p>
          <p className="text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-2xl shadow-lg">
                <TreeDeciduous className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  Quản Lý Bài Đăng Nhận Nuôi
                </h1>
                <p className="text-gray-600 text-lg">
                  Quản lý các bài đăng sản phẩm và cây trồng của bạn
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/farmer/adoptions/new")}
              className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Tạo bài đăng mới
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-[var(--color-main)]">
              <p className="text-sm text-gray-600 mb-1">Tổng bài đăng</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Hiển thị</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredPosts.length}
              </p>
            </div>
            <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500">
              <p className="text-sm text-gray-600 mb-1">Trang hiện tại</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentPage} / {totalPages}
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm, giống, tên nông trại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative lg:w-64">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || statusFilter !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 font-medium">
                Bộ lọc đang áp dụng:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  Tìm kiếm: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold flex items-center gap-2">
                  Trạng thái: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                  >
                    ✕
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

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Sprout className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Không tìm thấy bài đăng
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Không có bài đăng nào phù hợp với bộ lọc của bạn"
                : "Chưa có bài đăng nào. Hãy tạo bài đăng mới!"}
            </p>
            {searchQuery || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
                className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Xóa bộ lọc
              </button>
            ) : (
              <button
                onClick={() => navigate("/farmer/adoptions/new")}
                className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Tạo bài đăng mới
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mb-8">
              {filteredPosts.map((post) => (
                <FarmerTreeCard
                  key={post.postId}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showFirstLast={true}
              maxVisiblePages={5}
              className="mt-8"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default FarmerAdoption
