import { useState } from "react"
import { Divider } from "antd"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import CustomInput from "../components/CustomInput.tsx"
import Breadcrumb from "../components/Breadcrumb"
import EmailVerification from "../components/EmailVerification"
import Logo from "../assets/Logo.png"
import { signup as signupApi } from "../services/API/authAPI"
import GoogleLoginButton from "../components/GoogleLoginButton"
import LoadingButton from "../components/LoadingButton"
import getErrorMessage from "../hooks/getErrorMessage.ts"
import { signupSchema } from "../types/schemas/authValidation.ts"

const Signup = () => {
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<
    Partial<
      Record<
        "fullName" | "phone" | "email" | "password" | "confirmPassword",
        string
      >
    >
  >({})

  const [showVerification, setShowVerification] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async () => {
    // Clear previous errors before validating
    setErrors({})
    const parsed = signupSchema.safeParse({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      password,
      confirmPassword,
    })
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      // Map zod issues to field-level errors
      const fieldErrors: Partial<
        Record<
          "fullName" | "phone" | "email" | "password" | "confirmPassword",
          string
        >
      > = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path?.[0]
        if (
          key === "fullName" ||
          key === "phone" ||
          key === "email" ||
          key === "password" ||
          key === "confirmPassword"
        ) {
          fieldErrors[key] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error(first?.message || "Dữ liệu không hợp lệ")
      return
    }
    try {
      await signupApi(fullName, email, password)

      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      )
      setShowVerification(true)
    } catch (error: unknown) {
      console.error("Signup failed:", error)
      toast.error(getErrorMessage(error, "Đăng ký thất bại. Vui lòng thử lại."))
    } finally {
    }
  }

  const handleBackToSignup = () => {
    setShowVerification(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />

      <div className="container mx-auto px-2 py-8">
        <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Logo and slogan */}
          <div className="lg:text-left">
            <div className="flex justify-center">
              <img
                src={Logo}
                alt="GrowMate Logo"
                className="h-80 w-auto mx-auto lg:mx-0"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 italic text-center">
              "Từ khu vườn nhỏ đến giỏ trái cây tươi"
            </h2>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto w-full">
            {!showVerification ? (
              // Signup form
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Đăng Ký Tài Khoản GrowMate
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Đăng ký ngay để nhận hàng ngàn ưu đãi nhé!
                  </p>
                </div>

                {/* Social signup buttons */}
                <div className="space-y-3 mb-6">
                  <GoogleLoginButton label="Google" />
                </div>

                <Divider className="text-gray-500">
                  hoặc với Email cá nhân
                </Divider>

                {/* Signup form inputs */}
                <div className="space-y-4 mb-6">
                  <CustomInput
                    label="Họ và tên"
                    placeholder="Nhập họ và tên của bạn"
                    type="text"
                    value={fullName}
                    onChange={(v) => {
                      setFullName(v)
                      if (errors.fullName)
                        setErrors((prev) => ({ ...prev, fullName: "" }))
                    }}
                    required
                    helperText={errors.fullName}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Số điện thoại"
                    placeholder="Nhập số điện thoại"
                    type="tel"
                    value={phone}
                    onChange={(v) => {
                      setPhone(v)
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: "" }))
                    }}
                    required
                    helperText={errors.phone}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Email"
                    placeholder="Nhập email của bạn"
                    type="text"
                    value={email}
                    onChange={(v) => {
                      setEmail(v)
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }))
                    }}
                    required
                    helperText={errors.email}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    type="password"
                    value={password}
                    onChange={(v) => {
                      setPassword(v)
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }))
                    }}
                    required
                    helperText={errors.password}
                    helperTextColor="red"
                  />

                  <CustomInput
                    label="Xác nhận mật khẩu"
                    placeholder="Xác nhận mật khẩu của bạn"
                    type="password"
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v)
                      if (errors.confirmPassword)
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                    }}
                    required
                    helperText={errors.confirmPassword}
                    helperTextColor="red"
                  />
                </div>

                {/* Terms and conditions */}
                <div className="mb-6 text-sm text-gray-600">
                  Bằng việc đăng ký tài khoản, bạn đồng ý với{" "}
                  <button
                    className="text-green-600 hover:underline cursor-pointer"
                    onClick={() => navigate("/policy")}
                  >
                    Điều khoản sử dụng và Chính sách bảo mật
                  </button>{" "}
                  của chúng tôi.
                </div>

                {/* Signup button */}
                <LoadingButton
                  className="w-full !bg-main !border-main hover:!bg-green-700 !text-white"
                  onClickAsync={handleSignup}
                  loadingText="Đang đăng ký..."
                >
                  Đăng ký
                </LoadingButton>

                {/* Login link */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                    >
                      Đăng nhập
                    </button>
                  </p>
                </div>
              </>
            ) : (
              // Email verification form
              <EmailVerification email={email} onBack={handleBackToSignup} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
