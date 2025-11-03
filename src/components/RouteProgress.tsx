import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

// Lightweight top progress bar that appears during route changes (BrowserRouter-compatible).
// It shows on path change and auto-hides shortly after for smooth UX.
export default function RouteProgress() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<number | null>(null)
  const widthRef = useRef<number>(0)

  useEffect(() => {
    // On every pathname change, start progress
    setVisible(true)
    if (timerRef.current) window.clearInterval(timerRef.current)
    widthRef.current = 10
    const bar = document.getElementById("route-progress-bar")
    if (bar) bar.style.width = `10%`

    timerRef.current = window.setInterval(() => {
      // ease to 90%
      widthRef.current = Math.min(90, widthRef.current + Math.max(1, (95 - widthRef.current) * 0.03))
      const inner = document.getElementById("route-progress-bar")
      if (inner) inner.style.width = `${widthRef.current}%`
    }, 100)

    // complete after short delay (works for instantaneous route components)
    const done = window.setTimeout(() => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      const inner = document.getElementById("route-progress-bar")
      if (inner) inner.style.width = `100%`
      const hide = window.setTimeout(() => {
        setVisible(false)
        const again = document.getElementById("route-progress-bar")
        if (again) again.style.width = `0%`
      }, 200)
      return () => window.clearTimeout(hide)
    }, 600)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      window.clearTimeout(done)
    }
  }, [location.pathname])

  if (!visible) return null

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        background: "transparent",
      }}
    >
      <div
        id="route-progress-bar"
        style={{
          height: "100%",
          width: "0%",
          background: "linear-gradient(90deg, #10b981, #06b6d4)",
          boxShadow: "0 0 8px rgba(16,185,129,0.6)",
          transition: "width 120ms ease-out",
        }}
      />
    </div>
  )
}


