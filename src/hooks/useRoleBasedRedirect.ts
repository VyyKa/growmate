import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "./reduxHooks"
import { UserRole } from "../types/enums/UserRole"

/**
 * Hook to automatically redirect users to role-specific pages after login
 * @param shouldRedirect - Optional condition to control when redirect happens (default: true)
 * @returns Object with redirect function for manual triggering
 */
export const useRoleBasedRedirect = (shouldRedirect = true) => {
  const navigate = useNavigate()
  const auth = useAppSelector((state) => state.auth)
  const isLoggedIn = !!auth.user && !!auth.token
  const role = auth.user?.role as UserRole | undefined

  const redirectByRole = (userRole: UserRole) => {
    switch (userRole) {
      case UserRole.Admin:
        navigate("/admin/", { replace: true })
        break
      case UserRole.Farmer:
        navigate("/farmer/", { replace: true })
        break
      case UserRole.Customer:
        navigate("/", { replace: true })
        break
      case UserRole.Guest:
      default:
        navigate("/", { replace: true })
        break
    }
  }

  useEffect(() => {
    if (!shouldRedirect || !isLoggedIn || role === undefined) return

    redirectByRole(role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, role, shouldRedirect])

  return {
    redirectByRole,
    currentRole: role,
    isLoggedIn,
  }
}

/**
 * Get the default landing page path for a given role
 * @param role - UserRole value
 * @returns Path string for the role's landing page
 */
export const getRoleBasedPath = (role: UserRole | undefined): string => {
  switch (role) {
    case UserRole.Admin:
      return "/admin/"
    case UserRole.Farmer:
      return "/farmer/"
    case UserRole.Customer:
      return "/"
    case UserRole.Guest:
    default:
      return "/"
  }
}

export default useRoleBasedRedirect
