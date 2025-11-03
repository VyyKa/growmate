import { useState } from "react"
import { toast } from "react-toastify"
import { GoogleIcon } from "../assets/svgs/GoogleIcon"
import { API_BASE_URL } from "../services/axiosClient"
import getErrorMessage from "../hooks/getErrorMessage"

type GoogleLoginButtonProps = {
  className?: string
  label?: string
}

const GoogleLoginButton = ({
  className = "",
  label = "Google",
}: GoogleLoginButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    if (loading) return
    setLoading(true)
    try {
      window.location.href = `${API_BASE_URL}/auth/login-google`
    } catch (e) {
      console.error(e)
      toast.error(getErrorMessage(e, "Không khởi tạo được đăng nhập Google"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-60 cursor-pointer ${className}`}
    >
      <span className="w-5 h-5 mr-3 inline-block align-middle">
        <GoogleIcon />
      </span>
      {loading ? "Đang mở Google..." : label}
    </button>
  )
}

export default GoogleLoginButton
