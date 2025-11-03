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

  return (
    <nav className="relative bg-amber-50 text-black shadow-md ">
      <div className="container mx-auto px-6 py-4 flex justify-center">
        <div className="flex justify-between items-center gap-24">
          {/* Navigation buttons */}
          <div className="flex space-x-8 gap-10">
            {NavButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => nav(button.path)}
                className={`${
                  isActive(button.path)
                    ? "text-black font-bold border-b-2 border-green-500"
                    : "text-gray-400 hover:text-black"
                } hover:font-bold transition-all duration-300 font-medium relative group cursor-pointer`}
              >
                {button.name}
                {/* Underline effect - only show for non-active items */}
                {!isActive(button.path) && (
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full "></span>
                )}
              </button>
            ))}
          </div>

          {/* Cart button */}
          <div>
            <CartButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
