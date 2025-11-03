import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import CustomInput from "../components/CustomInput"
import Breadcrumb from "../components/Breadcrumb"
import Logo from "../assets/Logo.png"
import { forgotPassword, resetPassword } from "../services/API/authAPI"
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../types/schemas/authValidation"
import getErrorMessage from "../hooks/getErrorMessage"
import OTPInput from "../components/OTPInput"

type Step = "email" | "verify" | "reset" | "success"

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSendCode = async () => {
    const parsed = forgotPasswordSchema.safeParse({ email: email.trim() })
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      toast.error(first?.message || "Email không hợp lệ")
      return
    }

    setIsLoading(true)
    try {
      await forgotPassword(email.trim())
      toast.success("Mã xác thực đã được gửi đến email của bạn")
      setStep("verify")
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = () => {
    if (!code.trim()) {
      toast.error("Vui lòng nhập mã xác thực")
      return
    }
    setStep("reset")
  }

  const handleResetPassword = async () => {
    const parsed = resetPasswordSchema.safeParse({
      email: email.trim(),
      code: code.trim(),
      password,
      confirmPassword,
    })
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      toast.error(first?.message || "Dữ liệu không hợp lệ")
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(email.trim(), code.trim(), password)
      toast.success("Đặt lại mật khẩu thành công")
      setStep("success")
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await forgotPassword(email.trim())
      toast.success("Mã xác thực mới đã được gửi")
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Quên mật khẩu
              </h1>
              <p className="text-gray-600">
                Nhập email của bạn để nhận mã xác thực
              </p>
            </div>

            <div className="space-y-6">
              <CustomInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Nhập email của bạn"
                required
              />

              <button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 cursor-pointer focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
              </button>
            </div>
          </>
        )

      case "verify":
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Xác thực email
              </h1>
              <p className="text-gray-600">
                Nhập mã xác thực đã được gửi đến{" "}
                <span className="font-medium text-green-600">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã xác thực
                </label>
                <OTPInput value={code} onChange={setCode} length={6} />
              </div>

              <button
                onClick={handleVerifyCode}
                disabled={!code.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 cursor-pointer focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Xác thực
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Không nhận được mã?{" "}
                  <button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Đang gửi..." : "Gửi lại"}
                  </button>
                </p>
              </div>
            </div>
          </>
        )

      case "reset":
        return (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đặt lại mật khẩu
              </h1>
              <p className="text-gray-600">
                Nhập mật khẩu mới cho tài khoản của bạn
              </p>
            </div>

            <div className="space-y-6">
              <CustomInput
                label="Mật khẩu mới"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Nhập mật khẩu mới"
                required
              />

              <CustomInput
                label="Xác nhận mật khẩu"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                required
              />

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none cursor-pointer focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
              </button>
            </div>
          </>
        )

      case "success":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-8 w-8 text-green-600"
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
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Thành công!
              </h1>
              <p className="text-gray-600 mb-8">
                Mật khẩu của bạn đã được đặt lại thành công
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Đăng nhập ngay
              </button>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb />

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <img src={Logo} alt="GrowMate" className="h-20 w-auto" />
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {renderStepContent()}

            {/* Back to login */}
            {step !== "success" && (
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer"
                >
                  ← Quay lại đăng nhập
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
