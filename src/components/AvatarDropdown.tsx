import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks"
import { logout } from "../store/slices/authSlice"
import { setAuthToken } from "../services/axiosClient"
import defaultAvatar from "../assets/imgs/defaultAvatar.png"
import ProfileIconSvg from "../assets/svgs/ProfileIconSvg"
import ManagePlantIconSvg from "../assets/svgs/ManagePlantIconSvg"
import { AnimatedDoorIconSvg } from "../assets/svgs/AnimatedDoorIconSvg"
import { getRoleBasedPath } from "../hooks/useRoleBasedRedirect"
import { UserRole } from "../types/enums/UserRole"

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setAuthToken(undefined)
    dispatch(logout())
    setIsOpen(false)
    navigate("/")
  }

  const menuItems = [
    {
      icon: (
        <ProfileIconSvg
          size={20}
          className="text-gray-700 group-hover:text-main transition-colors duration-300"
        />
      ),
      label: "Thông tin cá nhân",
      onClick: () => {
        setIsOpen(false)
        navigate(`${getRoleBasedPath(user?.role as UserRole)}profile`)
      },
    },
    ...(user?.role === UserRole.Customer
      ? [
          {
            icon: (
              <ManagePlantIconSvg
                size={20}
                className="text-gray-700 group-hover:text-main transition-colors duration-300"
              />
            ),
            label: "Quản lí nhân nuôi",
            onClick: () => {
              setIsOpen(false)
              navigate("/adopt-management")
            },
          },
        ]
      : []),
    {
      icon: (
        <AnimatedDoorIconSvg
          size={20}
          className="text-red-600 group-hover:scale-110 transition-transform duration-300"
        />
      ),
      label: "Đăng xuất",
      onClick: handleLogout,
      isLogout: true,
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Menu người dùng"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-300 hover:border-green-500 transition-colors duration-200">
          <img
            src={user?.profileImageUrl || defaultAvatar}
            alt="Avatar người dùng"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = defaultAvatar
            }}
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user?.fullName || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-300">
                <img
                  src={user?.profileImageUrl || defaultAvatar}
                  alt="Avatar người dùng"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = defaultAvatar
                  }}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.fullName || "Người dùng"}
                </p>
                <p className="text-sm text-gray-500">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`group w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left hover:bg-gradient-to-r transition-all duration-300 transform hover:translate-x-1 ${
                  item.isLogout
                    ? "text-red-600 hover:from-red-50 hover:to-red-100 border-t border-gray-100 hover:border-red-200"
                    : "text-gray-700 hover:from-green-50 hover:to-emerald-50"
                }`}
              >
                <span className="flex-shrink-0 transform transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="font-medium transition-all duration-300 group-hover:font-semibold">
                  {item.label}
                </span>
                {/* Arrow indicator on hover */}
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AvatarDropdown
