import { useState, useEffect } from "react"
import { useAppSelector } from "../hooks/reduxHooks"
import { useNavigate } from "react-router-dom"
import CustomInput from "../components/CustomInput"
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget"
import {
  profileUpdateSchema,
  parseZodErrors,
  type ProfileUpdateForm,
} from "../types/schemas/profileValidation"
import { updateProfile } from "../services/API/userAPI"
import { getErrorMessage } from "../hooks/getErrorMessage"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  // Form state
  const [formData, setFormData] = useState<ProfileUpdateForm>({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    profileImageUrl: user?.profileImageUrl || "",
  })

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
        profileImageUrl: user.profileImageUrl || "",
      })
    }
  }, [user])

  const handleInputChange =
    (field: keyof ProfileUpdateForm) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  const handleImageUpload = (result: { publicId: string; url: string }) => {
    console.log(result.url)
    setFormData((prev) => ({ ...prev, profileImageUrl: result.url }))
    setSuccessMessage("Ảnh đại diện đã được tải lên!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage("")

    // Validate form
    const validation = profileUpdateSchema.safeParse(formData)
    if (!validation.success) {
      setErrors(parseZodErrors(validation.error))
      return
    }

    if (!user) return

    try {
      setIsSubmitting(true)

      // Call API to update profile
      const res = await updateProfile(user.userId, {
        fullName: formData.fullName,
        phone: formData.phone || undefined,
        email: formData.email,
        profileImageUrl: formData.profileImageUrl || undefined,
      })
      setSuccessMessage(res?.message || "Cập nhật thông tin thành công!")
    } catch (error) {
      const errorMsg = getErrorMessage(error)
      setErrors({ form: errorMsg })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Thông tin cá nhân
          </h1>
          <p className="text-lg text-gray-600">Quản lý thông tin của bạn</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg text-green-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.form && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{errors.form}</span>
            </div>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 sticky top-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group mb-4">
                  {formData.profileImageUrl ? (
                    <img
                      src={formData.profileImageUrl}
                      alt={formData.fullName}
                      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-green-100"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-white shadow-xl ring-4 ring-green-100">
                      <span className="text-white text-6xl font-bold">
                        {formData.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Upload Button Overlay */}
                  <div className="absolute bottom-0 right-0 w-12 h-12">
                    <CloudinaryUploadWidget
                      onUploaded={handleImageUpload}
                      accept="image/*"
                      showAsButton={true}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
                  {formData.fullName || "Người dùng"}
                </h2>

                {/* User Info */}
                <div className="w-full mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-sm font-medium truncate">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 flex-shrink-0 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {formData.phone && (
                    <div className="flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <svg
                        className="w-5 h-5 flex-shrink-0 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {formData.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-gray-100">
                Chỉnh sửa thông tin
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
                <div>
                  <CustomInput
                    label="Họ và tên"
                    placeholder="Nhập họ và tên của bạn"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange("fullName")}
                    required
                    helperText={errors.fullName}
                    helperTextColor={errors.fullName ? "red" : "gray"}
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomInput
                      label="Số điện thoại"
                      placeholder="Nhập số điện thoại"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={handleInputChange("phone")}
                      helperText={errors.phone}
                      helperTextColor={errors.phone ? "red" : "gray"}
                    />
                  </div>

                  <div>
                    <CustomInput
                      label="Email"
                      placeholder="Nhập email của bạn"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange("email")}
                      required
                      helperText={errors.email}
                      helperTextColor={errors.email ? "red" : "gray"}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ nhà ở
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 7, Đường Đỗ Khủ Công nghiệp cao, Phường Tăng Nhơn Phú, TP. HCM"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition-all duration-300 outline-none hover:border-green-400 focus:border-green-500 focus:bg-white bg-gray-50 text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
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
                        <span>Đang lưu thay đổi...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
