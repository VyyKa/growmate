import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAppDispatch } from "../hooks/reduxHooks"
import { setCredentials } from "../store/slices/authSlice"
import { setAuthToken } from "../services/axiosClient"
import { getUserIdFromToken } from "../utils/helpers/jwtHelpers"
import { getUsers } from "../services/API/userAPI"
import type { User } from "../types/interfaces/model/User"

/**
 * GoogleCallback page
 * - Backend redirect về FE với query ?token=... (hoặc ?Token=...)
 * - Component này sẽ:
 *   1. Đọc token từ query params
 *   2. Decode JWT để lấy userId
 *   3. Gọi API để lấy user info
 *   4. Lưu token và user vào Redux + localStorage
 *   5. Xóa query params khỏi URL
 *   6. Navigate về trang chủ
 */
export default function GoogleCallback() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        // Chấp nhận cả Token (chữ hoa) và token (chữ thường)
        const token = params.get("Token") || params.get("token") || undefined

        if (!token) {
          toast.error("Không nhận được token từ Google")
          navigate("/login")
          return
        }

        // Lưu token vào axios client và localStorage
        setAuthToken(token)

        // Decode JWT để lấy userId
        const userId = getUserIdFromToken(token)
        if (!userId) {
          toast.error("Không thể lấy thông tin user từ token")
          navigate("/login")
          return
        }

        // Gọi API để lấy user info
        try {
          const userResponse = await getUsers({ id: userId, includeCustomer: true })
          // getUsers trả về UserWithRelations khi có id, hoặc UsersListResponse khi không có id
          // Vì đã truyền id, nên response sẽ là UserWithRelations
          if (!userResponse || typeof userResponse !== 'object' || !('userId' in userResponse)) {
            toast.error("Không tìm thấy thông tin user")
            navigate("/login")
            return
          }

          // UserWithRelations extends User, nên có thể cast trực tiếp
          const user = userResponse as User

          // Lưu vào Redux (sẽ tự động lưu vào localStorage qua authSlice)
          dispatch(setCredentials({ user, token }))

          // Xóa query params khỏi URL
          const url = new URL(window.location.href)
          url.searchParams.delete("Token")
          url.searchParams.delete("token")
          window.history.replaceState({}, "", url.pathname)

          toast.success("Đăng nhập Google thành công")
          navigate("/", { replace: true })
        } catch (apiError: any) {
          console.error("Error fetching user info:", apiError)
          toast.error("Không thể lấy thông tin user từ server")
          navigate("/login")
        }
      } catch (error: any) {
        console.error("Error processing Google callback:", error)
        toast.error("Xử lý Google callback thất bại")
        navigate("/login")
      } finally {
        setIsProcessing(false)
      }
    }

    processGoogleCallback()
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 animate-pulse">
        {isProcessing ? "Đang xử lý đăng nhập Google..." : "Hoàn tất"}
      </div>
    </div>
  )
}
