import { useState } from "react"
import Breadcrumb from "../components/Breadcrumb"
import CustomInput from "../components/CustomInput"
import { toast } from "react-toastify"
import {
  contactSchema,
  type ContactForm,
} from "../types/schemas/contactValidation"
import { ZodError } from "zod"
import InfoIconSvg from "../assets/svgs/InfoIconSvg"
import ClockIconSvg from "../assets/svgs/ClockIconSvg"
import LocationIconSvg from "../assets/svgs/LocationIconSvg"
import EmailIconSvg from "../assets/svgs/EmailIconSvg"
import PhoneIconSvg from "../assets/svgs/PhoneIconSvg"

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactForm>({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      // Validate form data
      contactSchema.parse(formData)

      setSubmitting(true)
      // Simulate API call
      await new Promise((r) => setTimeout(r, 800))

      toast.success("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.")

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        message: "",
      })
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof ContactForm, string>> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ContactForm] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error("Vui lòng kiểm tra lại thông tin")
      } else {
        toast.error("Gửi liên hệ thất bại, vui lòng thử lại")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: LocationIconSvg,
      text: "FPT UNIVERSITY - Lô E2a-7, Đường D1, Long Thạnh Mỹ, TP. Thủ Đức",
    },
    {
      icon: EmailIconSvg,
      text: "growmate.work@gmail.com",
    },
    {
      icon: PhoneIconSvg,
      text: "CSKH: 0941430391",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Trang chủ", path: "/" },
          { label: "Liên hệ", path: "/contact", isActive: true },
        ]}
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
              Liên hệ với GrowMate
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="text-sm text-gray-500">
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong 24h
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CustomInput
                    label="Họ và tên"
                    placeholder="Nhập họ và tên của bạn"
                    type="text"
                    value={formData.fullName}
                    onChange={(value) => handleInputChange("fullName", value)}
                    required
                    helperText={errors.fullName}
                    helperTextColor="red"
                  />
                </div>
                <div>
                  <CustomInput
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    required
                    helperText={errors.phone}
                    helperTextColor="red"
                  />
                </div>
              </div>

              <CustomInput
                label="Email"
                placeholder="Nhập địa chỉ email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
                helperText={errors.email}
                helperTextColor="red"
              />

              <div>
                <div className="relative">
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    rows={5}
                    placeholder="Nhập nội dung liên hệ..."
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 outline-none resize-none ${
                      errors.message
                        ? "border-red-500"
                        : "border-gray-300 focus:border-green-500 hover:border-green-400"
                    } bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400`}
                  />
                  <label className="absolute left-3 top-0 -translate-y-1/2 text-xs bg-white px-2 text-gray-600 font-medium">
                    Nội dung liên hệ <span className="text-red-500">*</span>
                  </label>
                </div>
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {formData.message.length}/1000 ký tự
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-main hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi liên hệ"
                )}
              </button>
            </form>
          </div>

          {/* Map & Contact Info */}
          <div className="space-y-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg h-[340px]">
              <iframe
                title="GrowMate Location"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=FPT%20UNIVERSITY%20-%20L%C3%B4%20E2a-7%2C%20%C4%90%C6%B0%E1%BB%9Dng%20D1%2C%20Long%20Th%E1%BA%A1nh%20M%E1%BB%B9%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c&output=embed"
              />
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-1">
                <InfoIconSvg className="w-6 h-6 text-main" />
                Thông tin liên hệ
              </h3>
              <ul className="">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <IconComponent className="w-6 h-6 mt-0.5 flex-shrink-0 text-main" />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {item.text}
                      </span>
                    </li>
                  )
                })}
                <li className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ClockIconSvg className="w-6 h-6 text-main" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Giờ làm việc
                    </p>
                    <p className="text-sm text-gray-600">
                      Thứ 2 - Thứ 6: 8:30 - 17:30
                    </p>
                    <p className="text-sm text-gray-600">
                      Thứ 7 - Chủ nhật: Nghỉ
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
