import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Package,
  BarChart3,
  Sprout,
} from "lucide-react"
import logoImg from "../../assets/Logo.png"

const AdminSidebar = () => {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin",
      exact: true,
    },
    {
      icon: Users,
      label: "Quản lý User",
      path: "/admin/users",
    },
    {
      icon: Package,
      label: "Quản lý sản phẩm",
      path: "/admin/products",
    },
    {
      icon: Sprout,
      label: "Duyệt bài đăng",
      path: "/admin/posts",
    },
    {
      icon: BarChart3,
      label: "Báo cáo & Thống kê",
      path: "/admin/reports",
    },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-evenly border-b border-gray-200 bg-gradient-to-r from-[var(--color-main)] to-emerald-600">
        <div className="flex items-center gap-7">
          <img src={logoImg} alt="GrowMate Logo" className="h-21 w-21" />
          <span className="text-xl font-bold text-white">Admin</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[var(--color-main)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[var(--color-main)]"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 font-medium">
            GrowMate Admin v1.0
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © 2025 All rights reserved
          </p>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
