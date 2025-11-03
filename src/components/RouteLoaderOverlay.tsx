import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import Logo from "../assets/Logo.png"

// Centered fullscreen overlay loader for route transitions
export default function RouteLoaderOverlay() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const hideTimerRef = useRef<number | null>(null)

  useEffect(() => {
    // show overlay on any pathname change
    setVisible(true)
    setFading(false)

    // Hide after a short grace period; if route content takes longer,
    // the overlay will still be shown for at least this duration
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      // fade out before unmount
      setFading(true)
      const t = window.setTimeout(() => setVisible(false), 200)
      return () => window.clearTimeout(t)
    }, 700)

    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [location.pathname])

  if (!visible) return null

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff", // opaque to fully hide underlying page while loading
        backdropFilter: "blur(2px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 200ms ease",
        opacity: fading ? 0 : 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: 96, height: 96 }}>
          {/* spinning ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "6px solid rgba(16,185,129,0.25)",
              borderTopColor: "#10b981",
              borderRightColor: "#06b6d4",
              animation: "route-spin 900ms linear infinite",
            }}
          />
          {/* logo at center */}
          <img
            src={Logo}
            alt="GrowMate"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 56,
              height: 56,
              objectFit: "contain",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
            }}
          />
        </div>
        <div style={{ fontWeight: 700, color: "#065f46" }}>Loading...</div>
      </div>

      {/* simple keyframes */}
      <style>
        {`@keyframes route-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  )
}


