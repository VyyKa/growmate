import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Scrolls to top on route path change. Compatible with non-data routers.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If navigating to an anchor, try to scroll to it
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    // Fallback: scroll to top
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}
