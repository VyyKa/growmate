import { useNavigate } from "react-router-dom"
import { MoreVertical, Edit, Trash2, Eye, TreePine } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import type { PostItem } from "../../types/apiResponse/postResponse"

interface FarmerTreeCardProps {
  post: PostItem
  onEdit?: (postId: number) => void
  onDelete?: (postId: number) => void
}

export default function FarmerTreeCard({
  post,
  onEdit,
  onDelete,
}: FarmerTreeCardProps) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
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

  // Handle edit post
  const handleEdit = (postId: number) => {
    navigate(`/farmer/posts/${postId}?edit=true`)
  }

  // Handle delete post
  const handleDelete = (postId: number) => {
    onDelete?.(postId)
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--color-main)] overflow-hidden">
      {/* Horizontal Layout: Image Left, Content Right */}
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Left Side */}
        <div className="relative w-full sm:w-56 h-52 sm:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-green-100">
          <img
            src={
              post.primaryImageUrl ||
              post.mainImageUrl ||
              "/placeholder-tree.jpg"
            }
            alt={post.productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tree count badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md flex items-center gap-2">
            <TreePine className="w-4 h-4 text-[var(--color-main)]" />
            <span className="text-sm font-bold text-gray-900">
              {post.treeQuantity} cây
            </span>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-main)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-green-50/20">
          {/* Header with Title, Status and Menu */}
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-main)] transition-colors leading-tight flex-1">
                {post.productName} - {post.productVariety}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 whitespace-nowrap shadow-sm ${getStatusColor(
                    post.status
                  )}`}
                >
                  {getStatusText(post.status)}
                </span>

                {/* Menu Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Menu"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 animate-fadeIn">
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          navigate(`/farmer/posts/${post.postId}`)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          onEdit?.(post.postId)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false)
                          handleDelete(post.postId)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-main)] to-emerald-400 rounded-full group-hover:w-24 transition-all duration-300"></div>
          </div>

          {/* Info Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-main)]"></div>
              <span className="text-sm text-gray-600 font-medium">
                Nông trại:
              </span>
              <span className="text-sm font-bold text-[var(--color-main)] bg-green-50 px-2 py-0.5 rounded">
                {post.farmName}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 font-medium">
                Loại cây:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded">
                {post.productType}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 font-medium">
                Giá/năm:
              </span>
              <span className="text-sm font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {formatPrice(post.pricePerYear)}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600 font-medium">
                Sản lượng:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-orange-50 px-2 py-0.5 rounded">
                {post.harvestWeight} {post.unit}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600 font-medium">
                Xuất xứ:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-emerald-50 px-2 py-0.5 rounded">
                {post.origin}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              <span className="text-sm text-gray-600 font-medium">
                Ngày tạo:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-pink-50 px-2 py-0.5 rounded">
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => navigate(`/farmer/posts/${post.postId}`)}
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Xem chi tiết
            </button>

            <button
              onClick={() => handleEdit(post.postId)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </button>

            {/* <button
              onClick={() => navigate(`/farmer/posts/${post.postId}/adoptions`)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform flex items-center gap-2"
            >
              <TreePine className="w-4 h-4" />
              Xem danh sách nhận nuôi
            </button> */}
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  )
}
