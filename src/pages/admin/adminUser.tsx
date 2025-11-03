import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Mail,
  Phone,
  Shield,
  MapPin,
  Briefcase,
} from "lucide-react"
import {
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
} from "../../services/API/userAPI"
import type {
  UserWithRelations,
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
} from "../../types/apiResponse/userResponse"
import { UserRole } from "../../types/enums/UserRole"
import { getErrorMessage } from "../../hooks/getErrorMessage"

type UserListItem = UserWithRelations

const AdminUser = () => {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<number | "all">("all")
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all")

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  )
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    role: UserRole.Customer as number,
    profileImageUrl: "",
    isActive: true,
    // Customer fields
    shippingAddress: "",
    walletBalance: 0,
    // Farmer fields
    farmName: "",
    farmAddress: "",
    contactPhone: "",
    verificationStatus: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await getUsers({ page: currentPage, pageSize })
      if ("items" in response) {
        setUsers(response.items)
        setFilteredUsers(response.items)
        setTotalPages(Math.ceil(response.total / pageSize))
      } else {
        setUsers([response])
        setFilteredUsers([response])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error(getErrorMessage(error, "Không thể tải danh sách user"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  // Filter users
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.isActive === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, roleFilter, statusFilter, users])

  // Get role name
  const getRoleName = (role: number) => {
    switch (role) {
      case UserRole.Guest:
        return "Guest"
      case UserRole.Customer:
        return "Customer"
      case UserRole.Farmer:
        return "Farmer"
      case UserRole.Admin:
        return "Admin"
      default:
        return "Unknown"
    }
  }

  // Get role color
  const getRoleColor = (role: number) => {
    switch (role) {
      case UserRole.Guest:
        return "bg-gray-100 text-gray-700"
      case UserRole.Customer:
        return "bg-blue-100 text-blue-700"
      case UserRole.Farmer:
        return "bg-green-100 text-green-700"
      case UserRole.Admin:
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  // Open modal
  const openModal = (mode: "create" | "edit" | "view", user?: UserListItem) => {
    setModalMode(mode)
    setSelectedUser(user || null)

    if (mode === "create") {
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phone: "",
        role: UserRole.Customer as number,
        profileImageUrl: "",
        isActive: true,
        shippingAddress: "",
        walletBalance: 0,
        farmName: "",
        farmAddress: "",
        contactPhone: "",
        verificationStatus: "",
      })
    } else if (user) {
      setFormData({
        email: user.email,
        password: "",
        fullName: user.fullName,
        phone: user.phone || "",
        role: user.role as number,
        profileImageUrl: user.profileImageUrl || "",
        isActive: user.isActive,
        shippingAddress: user.customer?.shippingAddress || "",
        walletBalance: user.customer?.walletBalance || 0,
        farmName: user.farmer?.farmName || "",
        farmAddress: user.farmer?.farmAddress || "",
        contactPhone: user.farmer?.contactPhone || "",
        verificationStatus: user.farmer?.verificationStatus || "",
      })
    }

    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.email || !formData.fullName) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    if (modalMode === "create" && !formData.password) {
      toast.error("Vui lòng nhập mật khẩu")
      return
    }

    try {
      if (modalMode === "create") {
        const payload: AdminCreateUserRequest = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: formData.role,
          profileImageUrl: formData.profileImageUrl,
        }

        if (formData.role === UserRole.Customer) {
          payload.customerRequest = {
            shippingAddress: formData.shippingAddress,
            walletBalance: formData.walletBalance,
          }
        } else if (formData.role === UserRole.Farmer) {
          payload.farmerRequest = {
            farmName: formData.farmName,
            farmAddress: formData.farmAddress,
            contactPhone: formData.contactPhone,
            verificationStatus: formData.verificationStatus,
          }
        }

        await createUserByAdmin(payload)
        toast.success("Tạo user thành công!")
      } else if (modalMode === "edit" && selectedUser) {
        const payload: AdminUpdateUserRequest = {
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          profileImageUrl: formData.profileImageUrl,
          role: formData.role,
          isActive: formData.isActive,
        }

        if (formData.role === UserRole.Customer) {
          payload.updateCustomer = {
            shippingAddress: formData.shippingAddress,
            walletBalance: formData.walletBalance,
          }
        } else if (formData.role === UserRole.Farmer) {
          payload.updateFarmer = {
            farmName: formData.farmName,
            farmAddress: formData.farmAddress,
            contactPhone: formData.contactPhone,
            verificationStatus: formData.verificationStatus,
          }
        }

        await updateUserByAdmin(selectedUser.userId, payload)
        toast.success("Cập nhật user thành công!")
      }

      closeModal()
      fetchUsers()
    } catch (error) {
      console.error("Failed to save user:", error)
      toast.error(getErrorMessage(error, "Lưu user thất bại"))
    }
  }

  // Handle delete (soft delete)
  const handleDelete = async (user: UserListItem) => {
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn vô hiệu hóa user "${user.fullName}"?`
      )
    ) {
      return
    }

    try {
      await updateUserByAdmin(user.userId, { isActive: false })
      toast.success("Vô hiệu hóa user thành công!")
      fetchUsers()
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error(getErrorMessage(error, "Vô hiệu hóa user thất bại"))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý User</h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal("create")}
          className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm User Mới
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-1">Tổng user</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600 mb-1">Đang hoạt động</p>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-600 mb-1">Đã vô hiệu hóa</p>
          <p className="text-2xl font-bold text-gray-900">
            {users.filter((u) => !u.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200"
            />
          </div>

          {/* Role Filter */}
          <div className="relative lg:w-48">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value === "all" ? "all" : parseInt(e.target.value)
                )
              }
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value={UserRole.Customer}>Customer</option>
              <option value={UserRole.Farmer}>Farmer</option>
              <option value={UserRole.Admin}>Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative lg:w-48">
            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={
                statusFilter === "all" ? "all" : statusFilter ? "true" : "false"
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "all" ? "all" : e.target.value === "true"
                )
              }
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[var(--color-main)] focus:ring-2 focus:ring-[var(--color-main)]/20 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Đã vô hiệu hóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[var(--color-main)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách user...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-200">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Không tìm thấy user
          </h3>
          <p className="text-gray-500">
            {searchQuery || roleFilter !== "all" || statusFilter !== "all"
              ? "Không có user nào phù hợp với bộ lọc"
              : "Chưa có user nào trong hệ thống"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email & Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {user.profileImageUrl ? (
                            <img
                              src={user.profileImageUrl}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {user.userId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal("view", user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openModal("edit", user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Vô hiệu hóa"
                          disabled={!user.isActive}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create"
                  ? "Thêm User Mới"
                  : modalMode === "edit"
                  ? "Chỉnh Sửa User"
                  : "Chi Tiết User"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--color-main)]" />
                  Thông tin cơ bản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      required
                    />
                  </div>

                  {modalMode === "create" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: parseInt(e.target.value),
                        })
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                    >
                      <option value={UserRole.Customer}>Customer</option>
                      <option value={UserRole.Farmer}>Farmer</option>
                      <option value={UserRole.Admin}>Admin</option>
                    </select>
                  </div>

                  {modalMode !== "create" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.value === "true",
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      >
                        <option value="true">Hoạt động</option>
                        <option value="false">Vô hiệu hóa</option>
                      </select>
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL ảnh đại diện
                    </label>
                    <input
                      type="url"
                      value={formData.profileImageUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          profileImageUrl: e.target.value,
                        })
                      }
                      disabled={modalMode === "view"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              {formData.role === UserRole.Customer && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Thông tin Customer
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ giao hàng
                      </label>
                      <input
                        type="text"
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: e.target.value,
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số dư ví (VND)
                      </label>
                      <input
                        type="number"
                        value={formData.walletBalance}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            walletBalance: parseFloat(e.target.value) || 0,
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Farmer Info */}
              {formData.role === UserRole.Farmer && (
                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    Thông tin Farmer
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên nông trại
                      </label>
                      <input
                        type="text"
                        value={formData.farmName}
                        onChange={(e) =>
                          setFormData({ ...formData, farmName: e.target.value })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ nông trại
                      </label>
                      <input
                        type="text"
                        value={formData.farmAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            farmAddress: e.target.value,
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại liên hệ
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactPhone: e.target.value,
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái xác minh
                      </label>
                      <input
                        type="text"
                        value={formData.verificationStatus}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            verificationStatus: e.target.value,
                          })
                        }
                        disabled={modalMode === "view"}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent outline-none disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode !== "view" && (
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {modalMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUser
