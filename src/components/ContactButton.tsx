import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeadphoneIconSvg from "../assets/svgs/HeadphoneIconSvg"
import EmailIconSvg from "../assets/svgs/EmailIconSvg"
import PhoneIconSvg from "../assets/svgs/PhoneIconSvg"
import LocationIconSvg from "../assets/svgs/LocationIconSvg"

const ContactButton = () => {
  const slideDuration = 1000
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  const icons = [
    { Component: HeadphoneIconSvg, label: "Headphone" },
    { Component: EmailIconSvg, label: "Email" },
    { Component: PhoneIconSvg, label: "Phone" },
    { Component: LocationIconSvg, label: "Location" },
  ]

  useEffect(() => {
    if (!isHovered) {
      setCurrentIconIndex(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length)
    }, slideDuration)

    return () => clearInterval(interval)
  }, [isHovered, icons.length])

  const CurrentIcon = icons[currentIconIndex].Component
  const nextIconIndex = (currentIconIndex + 1) % icons.length
  const NextIcon = icons[nextIconIndex].Component

  return (
    <button
      onClick={() => navigate("/contact")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-main via-green-500 to-emerald-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden hover:scale-110 active:scale-95"
      aria-label="Liên hệ"
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Pulsing ring effect */}
      <div className="absolute inset-0 rounded-full border-2 border-green-300/50 animate-ping opacity-75 group-hover:opacity-0"></div>

      {/* Rotating outer ring on hover */}
      <div
        className="absolute inset-[-4px] rounded-full border-2 border-green-300/30 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500"
        style={{ animationDuration: "3s" }}
      ></div>

      {/* Icons container with z-index to stay on top */}
      <div className="relative z-10">
        {/* Current Icon - slides down when transitioning */}
        <span
          key={`current-${currentIconIndex}`}
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform"
          style={{
            transform: isHovered
              ? "translateY(120%) scale(0.8)"
              : "translateY(0) scale(1)",
            opacity: isHovered ? 0 : 1,
          }}
        >
          <CurrentIcon size={22} className="text-white drop-shadow-lg" />
        </span>

        {/* Next Icon - slides up from top when transitioning */}
        <span
          key={`next-${nextIconIndex}`}
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform"
          style={{
            transform: isHovered
              ? "translateY(0) scale(1)"
              : "translateY(-120%) scale(0.8)",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <NextIcon size={22} className="text-white drop-shadow-lg" />
        </span>

        {/* Placeholder for layout */}
        <div className="w-6 h-6"></div>
      </div>

      {/* Tooltip with enhanced styling */}
      <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-75 group-hover:scale-100">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs font-medium rounded-lg py-2 px-3 whitespace-nowrap shadow-xl border border-gray-700/50 backdrop-blur-sm">
          Liên hệ với chúng tôi
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-[6px] border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full"
        style={{ transitionDuration: "1s" }}
      ></div>
    </button>
  )
}

export default ContactButton
