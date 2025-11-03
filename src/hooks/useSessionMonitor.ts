import { useEffect, useState, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "./reduxHooks"
import { logout } from "../store/slices/authSlice"

/**
 * Hook to monitor session expiry and trigger alerts
 * Checks localStorage expiry field and current auth state
 */
export const useSessionMonitor = () => {
  const [showExpiryDialog, setShowExpiryDialog] = useState(false)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)

  const checkSession = useCallback(() => {
    // If user is not logged in, no need to check
    if (!user || !token) {
      setShowExpiryDialog(false)
      return
    }

    try {
      const raw = localStorage.getItem("auth")
      if (!raw) {
        // Auth data missing but user in state - session expired
        dispatch(logout())
        setShowExpiryDialog(true)
        return
      }

      const parsed = JSON.parse(raw)
      const expiresAt = parsed?.expiresAt

      if (typeof expiresAt === "number" && Date.now() > expiresAt) {
        // Session has expired
        dispatch(logout())
        setShowExpiryDialog(true)
      }
    } catch (error) {
      console.error("Session check error:", error)
      // On error, assume session is invalid
      dispatch(logout())
      setShowExpiryDialog(true)
    }
  }, [user, token, dispatch])

  useEffect(() => {
    // Check immediately on mount
    checkSession()

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000)

    // Also check when window regains focus (user comes back to tab)
    const handleFocus = () => checkSession()
    window.addEventListener("focus", handleFocus)

    return () => {
      clearInterval(interval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [checkSession])

  const closeDialog = useCallback(() => {
    setShowExpiryDialog(false)
  }, [])

  return {
    showExpiryDialog,
    closeDialog,
  }
}
