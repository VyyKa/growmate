import { useEffect, useState } from "react"
import {
  TreeDeciduous,
  Search,
  Filter,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Scale,
  Trees,
  Leaf,
} from "lucide-react"
import { getPosts, updatePostStatus } from "../../services/API/postAPI"
import type { PostItem } from "../../types/apiResponse/postResponse"
import { toast } from "react-toastify"
import {
  VerificationStatus,
  VerificationStatusAPI,
} from "../../types/enums/VerificationStatus"

const AdminPostApprove = () => {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [filteredPosts, setFilteredPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 20

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await getPosts({
        page: currentPage,
        pageSize,
      })

      const data = response.data
      if (data && "items" in data) {
        setPosts(data.items)
        setTotalPages(data.totalPages)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
      toast.error("Không thể tải danh sách bài đăng")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...posts]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.productName?.toLowerCase().includes(query) ||
          p.farmName?.toLowerCase().includes(query) ||
          p.productType?.toLowerCase().includes(query) ||
          p.productVariety?.toLowerCase().includes(query) ||
          p.origin?.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(filtered)
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, posts])

  const handleApprove = async (postId: number) => {
    try {
      setIsUpdating(true)
      await updatePostStatus(postId, VerificationStatusAPI.Approved)
      toast.success("Duyệt bài đăng thành công!")
      fetchPosts()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to approve post:", error)
      toast.error("Duyệt bài đăng thất bại!")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleReject = async (postId: number) => {
    try {
      setIsUpdating(true)
      await updatePostStatus(postId, VerificationStatusAPI.Rejected)
      toast.success("Từ chối bài đăng thành công!")
      fetchPosts()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to reject post:", error)
      toast.error("Từ chối bài đăng thất bại!")
    } finally {
      setIsUpdating(false)
    }
  }

  const openModal = (post: PostItem) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPost(null)
  }

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === VerificationStatus.Approved) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Đã duyệt
        </span>
      )
    } else if (lowerStatus === VerificationStatus.Pending) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Chờ duyệt
        </span>
      )
    } else if (lowerStatus === VerificationStatus.Rejected) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3" />
          Từ chối
        </span>
      )
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const stats = {
    total: posts.length,
    approved: posts.filter(
      (p) => p.status.toLowerCase() === VerificationStatus.Approved
    ).length,
    pending: posts.filter(
      (p) => p.status.toLowerCase() === VerificationStatus.Pending
    ).length,
    rejected: posts.filter(
      (p) => p.status.toLowerCase() === VerificationStatus.Rejected
    ).length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <TreeDeciduous className="w-12 h-12 text-[var(--color-main)] animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Duyệt bài đăng nhận nuôi
          </h1>
          <p className="text-gray-600 mt-1">
            Xem và phê duyệt các bài đăng nhận nuôi cây trồng từ nông dân
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bài đăng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <TreeDeciduous className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã từ chối</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm, nhà vườn, xuất xứ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent appearance-none outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhà vườn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xuất xứ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá/năm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số cây
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <TreeDeciduous className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Không tìm thấy bài đăng nào</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.postId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.primaryImageUrl || post.mainImageUrl ? (
                        <img
                          src={post.primaryImageUrl || post.mainImageUrl}
                          alt={post.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                          <Leaf className="w-8 h-8 text-green-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {post.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {post.productType} - {post.productVariety}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                        {post.farmName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {post.origin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(post.pricePerYear)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {post.treeQuantity} cây
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {post.status.toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(post.postId)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Duyệt"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(post.postId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang trước
            </button>
            <span className="text-sm text-gray-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-lg">
                  <TreeDeciduous className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Chi tiết bài đăng
                  </h2>
                  <p className="text-sm text-gray-500">
                    Mã bài đăng: #{selectedPost.postId}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(selectedPost.status)}</div>
                <div className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tạo lúc: {formatDate(selectedPost.createdAt)}
                </div>
              </div>

              {/* Image */}
              <div className="flex justify-center">
                {selectedPost.primaryImageUrl || selectedPost.mainImageUrl ? (
                  <img
                    src={
                      selectedPost.primaryImageUrl || selectedPost.mainImageUrl
                    }
                    alt={selectedPost.productName}
                    className="max-w-full max-h-64 object-contain rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-48 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-green-500" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[var(--color-main)]" />
                  Thông tin sản phẩm
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Tên sản phẩm</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.productName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại sản phẩm</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.productType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giống</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.productVariety}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nhà vườn</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.farmName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Xuất xứ
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPost.origin}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Giá nhận nuôi/năm
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(selectedPost.pricePerYear)}
                  </p>
                </div>
              </div>

              {/* Harvest Info */}
              <div className="bg-amber-50 rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-600" />
                  Thông tin thu hoạch
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Sản lượng</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.harvestWeight} {selectedPost.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tần suất thu hoạch</p>
                    <p className="font-medium text-gray-900">
                      {selectedPost.harvestFrequency} lần/năm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số lượng cây</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Trees className="w-4 h-4" />
                      {selectedPost.treeQuantity} cây
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-4">
                  {selectedPost.description || "Không có mô tả"}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                {selectedPost.status.toLowerCase() === "pending" && (
                  <>
                    <button
                      onClick={() => handleReject(selectedPost.postId)}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleApprove(selectedPost.postId)}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Duyệt bài đăng
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPostApprove
