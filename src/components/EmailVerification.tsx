import { useState, useEffect } from "react"
import { formatTime } from "../utils/helpers/timeHelpers"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { resendVerificationCode, verifyEmail } from "../services/API/authAPI"
import getErrorMessage from "../hooks/getErrorMessage"
import OTPInput from "./OTPInput"

interface EmailVerificationProps {
  email: string
  onBack: () => void
}

const EmailVerification = ({ email, onBack }: EmailVerificationProps) => {
  const minutes = 10

  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(60 * minutes)

  const navigate = useNavigate()

  // Start countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleVerifyEmail = async (code: string) => {
    if (code.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ mã xác thực 6 số")
      return
    }
    setIsVerifying(true)
    try {
      const res = await verifyEmail(email, code)
      const { success, message } = res.data

      if (success) {
        toast.success(message || "Xác thực email thành công!")
        navigate("/login")
        return
      }

      // Trường hợp hiếm khi status 200 nhưng success=false
      toast.error(message || "Mã xác thực không hợp lệ hoặc đã hết hạn.")
    } catch (error: unknown) {
      // Lỗi 400: { success:false, message }
      type AxiosLikeError = { response?: { data?: { message?: string } } }
      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in (error as AxiosLikeError) &&
        typeof (error as AxiosLikeError).response?.data?.message === "string"
          ? (error as AxiosLikeError).response!.data!.message
          : undefined
      console.error("Email verification failed:", error)
      toast.error(
        apiMessage ||
          getErrorMessage(error, "Xác thực email thất bại. Vui lòng thử lại.")
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    await resendVerificationCode(email)
    toast.success("Mã xác thực mới đã được gửi đến email của bạn.")
    setCountdown(60 * minutes)
  }

  return (
    <>
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Xác thực Email
        </h1>
        <p className="text-gray-600 text-sm mb-2">
          Chúng tôi đã gửi mã xác thực 6 số đến email:
        </p>
        <p className="text-green-600 font-medium text-sm mb-4">{email}</p>
        <p className="text-sm text-gray-500">
          Mã có hiệu lực trong:{" "}
          <span className="font-medium text-red-500">
            {formatTime(countdown)}
          </span>
        </p>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-4 text-center">
          Nhập mã xác thực
        </p>
        <OTPInput
          length={6}
          value={verificationCode}
          onChange={setVerificationCode}
          onComplete={handleVerifyEmail}
        />
      </div>

      <button
        onClick={() => handleVerifyEmail(verificationCode)}
        disabled={
          isVerifying || verificationCode.length !== 6 || countdown === 0
        }
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isVerifying ? "Đang xác thực..." : "Xác thực Email"}
      </button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Không nhận được mã?{" "}
          <button
            onClick={handleResendCode}
            className={`font-medium text-green-600 hover:text-green-700 cursor-pointer`}
          >
            Gửi lại
          </button>
        </p>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mt-2"
        >
          ← Quay lại đăng ký
        </button>
      </div>
    </>
  )
}

export default EmailVerification
