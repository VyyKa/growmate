import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { GoogleIcon } from "../assets/svgs/GoogleIcon"
import getErrorMessage from "../hooks/getErrorMessage"
import { loginWithGoogleCode } from "../services/API/authAPI"
import { setAuthToken } from "../services/axiosClient"
import { useAppDispatch } from "../hooks/reduxHooks"
import { setCredentials } from "../store/slices/authSlice"
import { getRoleBasedPath } from "../hooks/useRoleBasedRedirect"
import type { LoginPayload } from "../types/apiResponse/authResponse"
import type { UserRole } from "../types/enums/UserRole"

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initCodeClient: (config: GoogleCodeClientConfig) => GoogleCodeClient
        }
      }
    }
  }
}

type GoogleCodeClient = {
  requestCode: () => void
}

type GoogleCodeClientConfig = {
  client_id: string
  scope: string
  ux_mode?: "popup" | "redirect"
  prompt?: string
  callback: (response: {
    code?: string
    scope?: string
    error?: string
    error_description?: string
  }) => void
}

// TODO: Move to .env file for production
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

type GoogleLoginButtonProps = {
  className?: string
  label?: string
}

const GoogleLoginButton = ({
  className = "",
  label = "Google",
}: GoogleLoginButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(
    typeof window !== "undefined" &&
      !!window.google?.accounts?.oauth2?.initCodeClient
  )
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (scriptReady) return

    const scriptId = "google-identity-services"
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null

    const handleLoad = () => setScriptReady(true)
    const handleError = () => {
      toast.error("Không thể tải Google Identity Services. Vui lòng thử lại sau.")
      setScriptReady(false)
    }

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad)
      existingScript.addEventListener("error", handleError)
      return () => {
        existingScript.removeEventListener("load", handleLoad)
        existingScript.removeEventListener("error", handleError)
      }
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.addEventListener("load", handleLoad)
    script.addEventListener("error", handleError)
    document.head.appendChild(script)

    return () => {
      script.removeEventListener("load", handleLoad)
      script.removeEventListener("error", handleError)
    }
  }, [scriptReady])

  const handleGoogleLogin = async () => {
    if (loading) return

    if (!GOOGLE_CLIENT_ID) {
      toast.error("Google Client ID chưa được cấu hình. Vui lòng đặt biến VITE_GOOGLE_CLIENT_ID.")
      return
    }

    if (!scriptReady || !window.google?.accounts?.oauth2?.initCodeClient) {
      toast.error("Google Identity Services chưa sẵn sàng. Vui lòng thử lại.")
      return
    }

    setLoading(true)

    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: async (response) => {
          if (response.error) {
            setLoading(false)
            toast.error(`Google đăng nhập thất bại: ${response.error_description ?? response.error}`)
            return
          }

          if (!response.code) {
            setLoading(false)
            toast.error("Google không trả về authorization code.")
            return
          }

          try {
            const res = await loginWithGoogleCode(response.code)
            const packet = res.data as { data?: LoginPayload } & Partial<LoginPayload>
            const payload: LoginPayload | undefined =
              packet.data ??
              (packet.token && packet.user ? { token: packet.token, user: packet.user } : undefined)

            const token = payload?.token
            const user = payload?.user

            if (!token || !user) {
              throw new Error("Phản hồi đăng nhập từ server không hợp lệ.")
            }

            setAuthToken(token)
            dispatch(setCredentials({ user, token, rememberMe: true }))

            toast.success("Đăng nhập Google thành công!")
            const targetPath = getRoleBasedPath(user.role as UserRole)
            navigate(targetPath, { replace: true })
          } catch (error) {
            console.error("Google login exchange failed:", error)
            toast.error(getErrorMessage(error, "Đăng nhập Google thất bại. Vui lòng thử lại."))
          } finally {
            setLoading(false)
          }
        },
      })

      client.requestCode()
    } catch (e) {
      console.error(e)
      toast.error(getErrorMessage(e, "Không khởi tạo được đăng nhập Google"))
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
