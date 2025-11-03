import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import type { UserRole } from "../types/enums/UserRole"
import { UserRole as UserRoleEnum } from "../types/enums/UserRole"
import type { RootState } from "../store/store"
import { useSelector } from "react-redux"

interface ProtectedRouteProps {
  allowed?: UserRole[] | UserRole
  redirectPath?: string
  children: React.ReactNode
}

/**
 * Component bảo vệ route hoặc component con, chỉ cho phép truy cập khi thỏa mãn điều kiện allowed.
 * @param children: ReactNode - Component con sẽ được render nếu có quyền truy cập.
 * @param allowed: UserRole - Điều kiện cho phép truy cập (ví dụ: đã đăng nhập, đúng role, ...).
 * @param redirectPath: string - Đường dẫn sẽ chuyển hướng nếu không đủ quyền (mặc định: "/login").
 * @param fallback: ReactNode - Nếu không đủ quyền, sẽ hiển thị fallback này thay vì redirect (tùy chọn).
 *
 * Cách hoạt động:
 * - Nếu allowed = true: render children.
 * - Nếu allowed = false và có fallback: render fallback.
 * - Nếu allowed = false và không có fallback: redirect sang redirectPath.
 *
 * Ví dụ sử dụng:
 * <ProtectedRoute allowed={isAdmin}>
 *   <AdminPage />
 * </ProtectedRoute>
 *
 * <ProtectedRoute allowed={isLoggedIn} fallback={<div>Vui lòng đăng nhập!</div>}>
 *   <Profile />
 * </ProtectedRoute>
 */

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowed,
  redirectPath = "/login",
  children,
}) => {
  const location = useLocation()
  const auth = useSelector((state: RootState) => state.auth)
  const isLoggedIn = !!auth.user && !!auth.token
  const role = (auth.user?.role as UserRole | undefined) ?? undefined

  // If allowed not provided: require authentication but allow any role
  if (allowed === undefined) {
    if (!isLoggedIn) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />
    }
    return <>{children}</>
  }

  const requiredRoles = Array.isArray(allowed) ? allowed : [allowed]

  // Public route when Guest is allowed
  if (requiredRoles.includes(UserRoleEnum.Guest)) {
    return <>{children}</>
  }

  // Otherwise require login
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Check role authorization
  if (!role || !requiredRoles.includes(role)) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
