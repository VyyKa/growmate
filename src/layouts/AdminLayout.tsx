import { Outlet } from "react-router-dom"
import { Search } from "lucide-react"
import AdminSidebar from "../components/Admin/AdminSidebar"
import AvatarDropdown from "../components/AvatarDropdown"
import AuthAlertDialog from "../components/AuthAlertDialog"
import { useSessionMonitor } from "../hooks/useSessionMonitor"

const AdminLayout = () => {
  const { showExpiryDialog, closeDialog } = useSessionMonitor()
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm user, sản phẩm, đơn hàng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-6">
            {/* Avatar Dropdown */}
            <AvatarDropdown />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <AuthAlertDialog
        isOpen={showExpiryDialog}
        onClose={closeDialog}
        countdown={10}
      />
    </div>
  )
}

export default AdminLayout
