import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAppDispatch } from "../hooks/reduxHooks"
import { setCredentials } from "../store/slices/authSlice"
import { setAuthToken } from "../services/axiosClient"
import type { User } from "../types/interfaces/model/User"

/**
 * GoogleCallback page
 * - Backend redirect sẽ trả về query ?token=...&user=... (user là JSON encode hoặc id)
 * - Ở đây demo parse theo dạng token + base64 user json (tuỳ backend thật chỉnh lại)
 */
export default function GoogleCallback() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const token = params.get("token") || undefined
      const userEncoded = params.get("user")

      if (!token) {
        toast.error("Không nhận được token từ Google")
        navigate("/login")
        return
      }

      let user: User | null = null
      if (userEncoded) {
        try {
          // Giả định backend encode user info bằng base64(json)
          const json = atob(userEncoded)
          user = JSON.parse(json) as User
        } catch {
          // fallback nếu chỉ có token
          user = null
        }
      }

      setAuthToken(token)
      if (user) {
        dispatch(setCredentials({ user, token }))
      }
      toast.success("Đăng nhập Google thành công")
      navigate("/")
    } catch {
      toast.error("Xử lý Google callback thất bại")
      navigate("/login")
    }
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 animate-pulse">
        Đang xử lý đăng nhập Google...
      </div>
    </div>
  )
}
