import { useState, useEffect } from "react"
import { Divider } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useAppDispatch } from "../hooks/reduxHooks"
import { setCredentials } from "../store/slices/authSlice.ts"
import CustomInput from "../components/CustomInput.tsx"
import Breadcrumb from "../components/Breadcrumb"
import Logo from "../assets/Logo.png"
import { login as loginApi } from "../services/API/authAPI"
import { setAuthToken } from "../services/axiosClient.ts"
import GoogleLoginButton from "../components/GoogleLoginButton"
import LoadingButton from "../components/LoadingButton"
import type { LoginPayload } from "../types/apiResponse/authResponse.ts"
import getErrorMessage from "../hooks/getErrorMessage.ts"
import { loginSchema } from "../types/schemas/authValidation.ts"
import { getRoleBasedPath } from "../hooks/useRoleBasedRedirect"
import type { UserRole } from "../types/enums/UserRole"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<
    Partial<{ email: string; password: string }>
  >({})

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  // Xử lý error từ query params (từ OAuth redirect)
  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      toast.error(decodeURIComponent(error))
      // Xóa error khỏi URL
      searchParams.delete("error")
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleLogin = async () => {
    setErrors({})

    const parsed = loginSchema.safeParse({
      phone: "",
      email: email.trim(),
      password,
      rememberMe,
    })
    if (!parsed.success) {
      const first = parsed.error.issues[0]
      // Map field-level errors for helper text
      const fieldErrors: Partial<{ email: string; password: string }> = {}
      parsed.error.issues.forEach((issue) => {
        const key = issue.path?.[0]
        if (key === "email" || key === "password") {
          fieldErrors[key] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error(first?.message || "Dữ liệu không hợp lệ")
      return
    }
    try {
      const res = await loginApi(email, password)
      const data = res.data as { data?: LoginPayload } & Partial<LoginPayload>
      const payload: LoginPayload | undefined =
        data.data ??
        (data.token && data.user
          ? { token: data.token, user: data.user }
          : undefined)
      const token: string | undefined = payload?.token
      const user = payload?.user
      if (!token || !user) {
        throw new Error("Phản hồi đăng nhập không hợp lệ")
      }

      setAuthToken(token)
      dispatch(setCredentials({ user, token, rememberMe }))
      toast.success("Đăng nhập thành công!")

      // Redirect based on user role
      const targetPath = getRoleBasedPath(user.role as UserRole)
      navigate(targetPath)
    } catch (error: unknown) {
      console.error("Login failed:", error)
      toast.error(
        getErrorMessage(error, "Đăng nhập thất bại. Vui lòng thử lại.")
      )
    }
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

          {/* Right side - Login form */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto w-full">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Chào mừng đến với GrowMate
              </h1>
              <p className="text-gray-600 text-sm">
                Đăng nhập ngay để khám phá thế giới mới nhé!
              </p>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3 mb-6">
              <GoogleLoginButton />
            </div>

            <Divider className="text-gray-500">hoặc với Email cá nhân</Divider>

            {/* Email and password inputs */}
            <div className="space-y-4 mb-4">
              <CustomInput
                label="Email"
                placeholder="Nhập email của bạn để đăng nhập"
                type="email"
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
            </div>

            {/* Remember me checkbox and Forget password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700"
                >
                  Nhớ tài khoản
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate("/forgotPassword")}
                className="text-sm text-main hover:text-green-700 hover:underline transition-colors duration-200 cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login button */}
            <LoadingButton
              className="w-full !bg-main !border-main hover:!bg-green-700 !text-white"
              onClickAsync={handleLogin}
              loadingText="Đang đăng nhập..."
            >
              Đăng nhập
            </LoadingButton>

            {/* Sign up link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
