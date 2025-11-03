import { useNavigate, useLocation } from "react-router-dom"
import { LayoutDashboard, TreePine } from "lucide-react"

const FarmerNavBar = () => {
  const nav = useNavigate()
  const location = useLocation()

  const NavButtons = [
    {
      name: "Dashboard",
      path: "/farmer",
      icon: LayoutDashboard,
    },
    {
      name: "Quản lý bài đăng",
      path: "/farmer/adoptions",
      icon: TreePine,
    },
  ]

  const isActive = (path: string) => {
    if (path === "/farmer") {
      return location.pathname === "/farmer"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="flex items-center gap-2">
      {NavButtons.map((button, index) => {
        const Icon = button.icon
        return (
          <button
            key={index}
            onClick={() => nav(button.path)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium
              transition-all duration-300 relative overflow-hidden group
              ${
                isActive(button.path)
                  ? "bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-[var(--color-main)]"
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="font-semibold">{button.name}</span>

            {/* Animated background on hover for non-active items */}
            {!isActive(button.path) && (
              <span className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export default FarmerNavBar
