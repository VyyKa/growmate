import { useNavigate, useLocation } from "react-router-dom"
import CartButton from "./CartButton"

const NavBar = () => {
  const nav = useNavigate()
  const location = useLocation()

  const NavButtons = [
    { name: "Trang chủ", path: "/" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Cửa hàng", path: "/products" },
    { name: "Nhận nuôi", path: "/adopt" },
    { name: "Tin tức", path: "/blog" },
  ]

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    )
  }

  /* <div className="container mx-auto px-6 py-4 flex justify-center">
  <div className="flex justify-between items-center gap-24">
  {/* Navigation buttons */
  /*<div className="flex space-x-8 gap-10">
    */

  return (
    <nav className="relative bg-amber-50 text-black shadow-md ">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navigation buttons - centered */}
          <div className="flex-1 flex justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {NavButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => nav(button.path)}
                className="relative group cursor-pointer font-medium transition-all duration-500 ease-in-out"
              >
                <span
                  className={`relative z-10 inline-block transition-all duration-500 ease-in-out ${
                    isActive(button.path)
                      ? "font-bold"
                      : "text-black"
                  }`}
                  style={
                    isActive(button.path)
                      ? ({
                          backgroundImage:
                            "linear-gradient(to right, rgb(34 197 94), rgb(16 185 129))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        } as React.CSSProperties)
                      : {
                          color: "#000000",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(button.path)) {
                      const target = e.currentTarget
                      target.style.backgroundImage =
                        "linear-gradient(to right, rgb(34 197 94), rgb(16 185 129))"
                      ;(target.style as any).WebkitBackgroundClip = "text"
                      ;(target.style as any).WebkitTextFillColor = "transparent"
                      target.style.backgroundClip = "text"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(button.path)) {
                      const target = e.currentTarget
                      target.style.backgroundImage = ""
                      ;(target.style as any).WebkitBackgroundClip = ""
                      ;(target.style as any).WebkitTextFillColor = ""
                      target.style.backgroundClip = ""
                      target.style.color = "#000000"
                    }
                  }}
                >
                  {button.name}
                </span>
                {/* Animated underline effect */}
                <span
                  className={`absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-in-out ${
                    isActive(button.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
            ))}
          </div>

          {/* Cart button - right aligned */}
          <div className="flex-shrink-0 ml-4">
            <CartButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
