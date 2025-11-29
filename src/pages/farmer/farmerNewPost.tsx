import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import type { Dayjs } from "dayjs"
import {
  Sprout,
  Calendar,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Trash2,
  Upload,
} from "lucide-react"
import { useAppSelector } from "../../hooks/reduxHooks"
import CustomInput from "../../components/CustomInput"
import CustomSelect from "../../components/CustomSelect"
import CloudinaryUploadWidget from "../../components/CloudinaryUploadWidget"
import CustomDateRangePicker from "../../components/CustomDateRangePicker"
import { createPost } from "../../services/API/postAPI"
import { getUsers } from "../../services/API/userAPI"
import type {
  CreatePostPayload,
  CreateMediaPostRequest,
} from "../../types/apiResponse/postResponse"
import { createPostSchema } from "../../types/schemas/postValidation"
import getErrorMessage from "../../hooks/getErrorMessage"

const FarmerNewPost = () => {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  // Farmer data
  const [farmerId, setFarmerId] = useState<number | null>(null)
  const [isLoadingFarmer, setIsLoadingFarmer] = useState(true)

  // Form state
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("")
  const [productVariety, setProductVariety] = useState("")
  const [farmName, setFarmName] = useState("")
  const [origin, setOrigin] = useState("")
  const [pricePerYear, setPricePerYear] = useState("")
  const [harvestWeight, setHarvestWeight] = useState("")
  const [unit, setUnit] = useState("kg")
  const [harvestFrequency, setHarvestFrequency] = useState("")
  const [treeQuantity, setTreeQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [harvestDateRange, setHarvestDateRange] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null])

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<
    CreateMediaPostRequest[]
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch farmer information on mount
  useEffect(() => {
    const fetchFarmerInfo = async () => {
      if (!user?.userId) {
        toast.error("Không tìm thấy thông tin người dùng")
        navigate("/login")
        return
      }

      try {
        setIsLoadingFarmer(true)
        const response = await getUsers({ id: user.userId })
        const userData = response

        if (
          "farmer" in userData &&
          userData.farmer &&
          userData.farmer.farmerId
        ) {
          setFarmerId(userData.farmer.farmerId)
        } else {
          toast.error("Tài khoản của bạn chưa được đăng ký làm farmer")
          navigate("/farmer")
        }
      } catch (error) {
        console.error("Failed to fetch farmer info:", error)
        toast.error("Không thể tải thông tin farmer. Vui lòng thử lại.")
        navigate("/farmer")
      } finally {
        setIsLoadingFarmer(false)
      }
    }

    fetchFarmerInfo()
  }, [user?.userId, navigate])

  const handleImageUpload = (result: { publicId: string; url: string }) => {
    const newMedia: CreateMediaPostRequest = {
      mediaUrl: result.url,
      mediaType: "IMAGE",
    }
    setUploadedImages((prev) => [...prev, newMedia])
    toast.success("Tải ảnh lên thành công!")
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setErrors({})

    // Prepare data for validation
    const formData = {
      productName: productName.trim(),
      productType: productType.trim(),
      productVariety: productVariety.trim(),
      farmName: farmName.trim(),
      origin: origin.trim(),
      pricePerYear: parseFloat(pricePerYear) || 0,
      harvestWeight: parseFloat(harvestWeight) || 0,
      unit: unit.trim(),
      harvestFrequency: parseInt(harvestFrequency) || 0,
      treeQuantity: parseInt(treeQuantity) || 0,
      description: description.trim(),
    }

    // Validate with Zod
    const parsed = createPostSchema.safeParse(formData)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (key) {
          fieldErrors[key] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ")
      return
    }

    // Check images
    if (uploadedImages.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh sản phẩm")
      return
    }

    // Check farmerId
    if (!farmerId) {
      toast.error("Không tìm thấy thông tin farmer. Vui lòng thử lại.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload: CreatePostPayload = {
        farmerId,
        ...formData,
        media: uploadedImages,
      }

      await createPost(payload)
      toast.success("Tạo bài đăng nhận nuôi thành công!")
      navigate("/farmer/adoptions")
    } catch (error: unknown) {
      console.error("Create post failed:", error)
      toast.error(
        getErrorMessage(error, "Tạo bài đăng thất bại. Vui lòng thử lại.")
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while fetching farmer info
  if (isLoadingFarmer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 mx-auto text-main mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 font-medium">
            Đang tải thông tin farmer...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-main transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Form đăng nhận nuôi cây trồng
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Thông tin sản phẩm
              </h2>

              <div className="space-y-4">
                {/* Row 1: 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomInput
                    label="Tên sản phẩm"
                    placeholder="VD: Xoài cát..."
                    value={productName}
                    onChange={(v) => {
                      setProductName(v)
                      if (errors.productName)
                        setErrors((prev) => ({ ...prev, productName: "" }))
                    }}
                    required
                    helperText={errors.productName}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Loại sản phẩm"
                    placeholder="VD: Cây ăn quả..."
                    value={productType}
                    onChange={(v) => {
                      setProductType(v)
                      if (errors.productType)
                        setErrors((prev) => ({ ...prev, productType: "" }))
                    }}
                    required
                    helperText={errors.productType}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Giống sản phẩm"
                    placeholder="VD: Xoài cát..."
                    value={productVariety}
                    onChange={(v) => {
                      setProductVariety(v)
                      if (errors.productVariety)
                        setErrors((prev) => ({ ...prev, productVariety: "" }))
                    }}
                    required
                    helperText={errors.productVariety}
                    helperTextColor="red"
                  />
                </div>

                {/* Row 2: 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Tên nhà vườn"
                    placeholder="VD: Nhà Vườn Bê Bất..."
                    value={farmName}
                    onChange={(v) => {
                      setFarmName(v)
                      if (errors.farmName)
                        setErrors((prev) => ({ ...prev, farmName: "" }))
                    }}
                    required
                    helperText={errors.farmName}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Xuất xứ sản phẩm"
                    placeholder="VD: Tiền Giang..."
                    value={origin}
                    onChange={(v) => {
                      setOrigin(v)
                      if (errors.origin)
                        setErrors((prev) => ({ ...prev, origin: "" }))
                    }}
                    required
                    helperText={errors.origin}
                    helperTextColor="red"
                  />
                </div>

                {/* Row 3: 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomInput
                    label="Giá sản phẩm / 1 năm"
                    placeholder="VD: 700,000..."
                    value={pricePerYear}
                    onChange={(v) => {
                      const sanitized = v.replace(/[^0-9.]/g, "")
                      setPricePerYear(sanitized)
                      if (errors.pricePerYear)
                        setErrors((prev) => ({ ...prev, pricePerYear: "" }))
                    }}
                    required
                    helperText={errors.pricePerYear}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Khối lượng thu hoạch"
                    placeholder="VD: 20"
                    value={harvestWeight}
                    onChange={(v) => {
                      const sanitized = v.replace(/[^0-9.]/g, "")
                      setHarvestWeight(sanitized)
                      if (errors.harvestWeight)
                        setErrors((prev) => ({ ...prev, harvestWeight: "" }))
                    }}
                    required
                    helperText={errors.harvestWeight}
                    helperTextColor="red"
                  />

                  <CustomSelect
                    label="Đơn vị"
                    value={unit}
                    onChange={(v) => {
                      setUnit(v)
                      if (errors.unit)
                        setErrors((prev) => ({ ...prev, unit: "" }))
                    }}
                    options={[
                      { label: "Kilogram", value: "kg" },
                      { label: "Tấn", value: "Tấn" },
                      { label: "Cái", value: "Cái" },
                    ]}
                    required
                    helperText={errors.unit}
                    helperTextColor="red"
                  />
                </div>

                {/* Row 4: 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Số lượng cây"
                    placeholder="VD: 5"
                    value={treeQuantity}
                    onChange={(v) => {
                      const sanitized = v.replace(/[^0-9]/g, "")
                      setTreeQuantity(sanitized)
                      if (errors.treeQuantity)
                        setErrors((prev) => ({ ...prev, treeQuantity: "" }))
                    }}
                    required
                    helperText={errors.treeQuantity}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Tần suất thu hoạch (lần)"
                    placeholder="VD: 3"
                    value={harvestFrequency}
                    onChange={(v) => {
                      const sanitized = v.replace(/[^0-9]/g, "")
                      setHarvestFrequency(sanitized)
                      if (errors.harvestFrequency)
                        setErrors((prev) => ({
                          ...prev,
                          harvestFrequency: "",
                        }))
                    }}
                    required
                    helperText={errors.harvestFrequency}
                    helperTextColor="red"
                  />
                </div>
              </div>
            </div>

            {/* Thời gian thu hoạch dự kiến */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Thời gian dự kiến thu hoạch
              </h2>

              <CustomDateRangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                value={harvestDateRange}
                onChange={setHarvestDateRange}
                format="DD/MM/YYYY"
              />
            </div>

            {/* Mô tả sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Mô tả sản phẩm
              </h2>

              <div>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }))
                  }}
                  placeholder="Mô tả sản phẩm ở đây nhé..."
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg transition-colors outline-none resize-none ${
                    errors.description
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 focus:border-main focus:ring-2 focus:ring-main/20"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-12 py-3 bg-main text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-main/30"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  "Tiếp tục"
                )}
              </button>
            </div>
          </div>

          {/* Image Upload Section - 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-main mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Ảnh sản phẩm
              </h2>

              {/* Upload Button */}
              <div className="mb-6">
                <CloudinaryUploadWidget
                  onUploaded={handleImageUpload}
                  accept="image/*"
                  showAsButton
                  className="w-full h-48"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Nhấn để tải ảnh lên (tối đa 10MB)
                </p>
              </div>

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Đã tải lên ({uploadedImages.length} ảnh)
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {uploadedImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border-2 border-gray-200 hover:border-main transition-all duration-300"
                      >
                        <img
                          src={img.mediaUrl}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedImages.length === 0 && (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">
                    Chưa có ảnh nào được tải lên
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

export default FarmerNewPost
