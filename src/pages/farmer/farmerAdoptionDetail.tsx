import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  TreePine,
  MapPin,
  DollarSign,
  Weight,
  Calendar,
  Package,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { getPostById, updatePost } from "../../services/API/postAPI"
import { getUsers } from "../../services/API/userAPI"
import { useAppSelector } from "../../hooks/reduxHooks"
import type {
  PostItem,
  UpdatePostPayload,
} from "../../types/apiResponse/postResponse"
import { getErrorMessage } from "../../hooks/getErrorMessage"

const FarmerAdoptionDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const user = useAppSelector((state) => state.auth.user)

  const [post, setPost] = useState<PostItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [farmerId, setFarmerId] = useState<number | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    productVariety: "",
    farmName: "",
    origin: "",
    pricePerYear: 0,
    harvestWeight: 0,
    unit: "",
    harvestFrequency: 0,
    treeQuantity: 0,
    description: "",
    media: [
      {
        mediaUrl: "",
        mediaType: "",
      },
    ],
  })

  // Check if should auto-edit from URL params
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true)
    }
  }, [searchParams])

  // Fetch farmer ID
  useEffect(() => {
    const fetchFarmerId = async () => {
      if (!user?.userId) return

      try {
        const response = await getUsers({ id: user.userId })
        const userData = response

        if (
          "farmer" in userData &&
          userData.farmer &&
          userData.farmer.farmerId
        ) {
          setFarmerId(userData.farmer.farmerId)
        }
      } catch (error) {
        console.error("Failed to fetch farmer info:", error)
        toast.error("Không thể tải thông tin farmer")
      }
    }

    fetchFarmerId()
  }, [user?.userId])

  // Fetch post detail
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await getPostById(Number(id))
        const postData = response.data

        if (postData) {
          setPost(postData)
          setFormData({
            productName: postData.productName,
            productType: postData.productType,
            productVariety: postData.productVariety,
            farmName: postData.farmName,
            origin: postData.origin,
            pricePerYear: postData.pricePerYear,
            harvestWeight: postData.harvestWeight,
            unit: postData.unit,
            harvestFrequency: postData.harvestFrequency,
            treeQuantity: postData.treeQuantity,
            description: postData.description,
            media: [
              {
                mediaUrl:
                  postData.primaryImageUrl || postData.mainImageUrl || "",
                mediaType: "IMAGE",
              },
            ],
          })
        } else {
          toast.error("Không tìm thấy bài đăng")
          navigate("/farmer/adoptions")
        }
      } catch (error) {
        console.error("Failed to fetch post:", error)
        toast.error(getErrorMessage(error, "Không thể tải thông tin bài đăng"))
        navigate("/farmer/adoptions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id, navigate])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!post || !farmerId) return

    try {
      setIsSaving(true)

      const payload: UpdatePostPayload = {
        farmerId,
        ...formData,
      }

      await updatePost(post.postId, payload)
      toast.success("Cập nhật bài đăng thành công!")

      // Refresh post data
      const response = await getPostById(post.postId)
      if (response.data) {
        setPost(response.data)
      }

      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update post:", error)
      toast.error(getErrorMessage(error, "Cập nhật bài đăng thất bại"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (post) {
      setFormData({
        productName: post.productName,
        productType: post.productType,
        productVariety: post.productVariety,
        farmName: post.farmName,
        origin: post.origin,
        pricePerYear: post.pricePerYear,
        harvestWeight: post.harvestWeight,
        unit: post.unit,
        harvestFrequency: post.harvestFrequency,
        treeQuantity: post.treeQuantity,
        description: post.description,
        media: [
          {
            mediaUrl: post.primaryImageUrl || post.mainImageUrl || "",
            mediaType: "IMAGE",
          },
        ],
      })
    }
    setIsEditing(false)
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-5 h-5" />
      case "pending":
        return <Clock className="w-5 h-5" />
      case "rejected":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-[var(--color-main)]/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--color-main)] rounded-full animate-spin"></div>
            <TreePine className="w-10 h-10 text-[var(--color-main)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-lg font-semibold text-gray-700">
            Đang tải thông tin bài đăng...
          </p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/farmer/adoptions")}
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-main)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`${getStatusColor(
            post.status
          )} border-2 rounded-xl p-4 mb-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(post.status)}
            <div>
              <p className="font-semibold text-lg">
                Trạng thái: {getStatusText(post.status)}
              </p>
              <p className="text-sm opacity-80">
                Mã bài đăng: #{post.postId.toString().padStart(3, "0")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Ngày tạo</p>
            <p className="font-semibold">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-6">
              <div className="relative h-80 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100">
                {post.primaryImageUrl || post.mainImageUrl ? (
                  <img
                    src={post.primaryImageUrl || post.mainImageUrl}
                    alt={post.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-24 h-24 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-md flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-[var(--color-main)]" />
                  <span className="font-bold text-gray-900">
                    {post.treeQuantity} cây
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Cập nhật lần cuối
                </p>
                <p className="font-semibold text-gray-900">
                  {formatDate(post.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-[var(--color-main)] to-emerald-600 rounded-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin sản phẩm
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.productName}
                      onChange={(e) =>
                        handleInputChange("productName", e.target.value)
                      }
                      placeholder="Nhập tên sản phẩm"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.productName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại cây
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.productType}
                      onChange={(e) =>
                        handleInputChange("productType", e.target.value)
                      }
                      placeholder="Nhập loại cây"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.productType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giống
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.productVariety}
                      onChange={(e) =>
                        handleInputChange("productVariety", e.target.value)
                      }
                      placeholder="Nhập giống"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.productVariety}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên nông trại
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.farmName}
                      onChange={(e) =>
                        handleInputChange("farmName", e.target.value)
                      }
                      placeholder="Nhập tên nông trại"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.farmName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Xuất xứ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) =>
                        handleInputChange("origin", e.target.value)
                      }
                      placeholder="Nhập xuất xứ"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.origin}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn vị
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) =>
                        handleInputChange("unit", e.target.value)
                      }
                      placeholder="Nhập đơn vị (kg, tấn,...)"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.unit}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing & Harvest Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Giá & Sản lượng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá mỗi năm
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.pricePerYear}
                      onChange={(e) =>
                        handleInputChange(
                          "pricePerYear",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Nhập giá"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 text-lg font-semibold"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-purple-600 bg-purple-50 px-4 py-2.5 rounded-lg">
                      {formatPrice(post.pricePerYear)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    Sản lượng thu hoạch
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.harvestWeight}
                      onChange={(e) =>
                        handleInputChange(
                          "harvestWeight",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Nhập sản lượng"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.harvestWeight} {post.unit}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tần suất thu hoạch (tháng)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.harvestFrequency}
                      onChange={(e) =>
                        handleInputChange(
                          "harvestFrequency",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Nhập tần suất"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.harvestFrequency} tháng/lần
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <TreePine className="w-4 h-4" />
                    Số lượng cây
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.treeQuantity}
                      onChange={(e) =>
                        handleInputChange(
                          "treeQuantity",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Nhập số lượng cây"
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg">
                      {post.treeQuantity} cây
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mô tả</h2>
              </div>

              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 resize-none"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {post.description || "Chưa có mô tả"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmerAdoptionDetail
