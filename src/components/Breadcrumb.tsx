import { useLocation, Link } from "react-router-dom"

interface BreadcrumbItem {
  label: string
  path: string
  isActive?: boolean
}

/**
 * Breadcrumb - Component điều hướng đường dẫn
 *
 * Tự động tạo breadcrumb dựa trên URL hiện tại
 * hoặc nhận props breadcrumbItems để custom
 */
interface BreadcrumbProps {
  breadcrumbItems?: BreadcrumbItem[]
  separator?: string
}

const Breadcrumb = ({ breadcrumbItems, separator = "/" }: BreadcrumbProps) => {
  const location = useLocation()

  // Mapping path to Vietnamese labels
  const pathLabels: Record<string, string> = {
    "": "Trang chủ",
    about: "Giới thiệu",
    forgotPassword: "Quên mật khẩu",
    services: "Tin tức",
    blog: "Tin tức",
    contact: "Liên hệ",
    login: "Đăng nhập",
    signup: "Đăng ký",
    profile: "Tài khoản",
    cart: "Giỏ hàng",
    orders: "Đơn hàng",
    products: "Sản phẩm",
    farmers: "Nông dân",
    trees: "Cây trồng",
    adoptions: "Nhận nuôi",
    checkout: "Thanh toán",
    review: "Xác nhận đơn hàng",
    callback: "Xác thực thanh toán",
    order: "Đơn hàng",
    success: "Hoàn tất",
    reports: "Báo cáo",
    policy: "Chính sách và điều khoản",
    "adopt-management": "Quản lý nhận nuôi",
  }

  // Auto-generate breadcrumb from current path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (breadcrumbItems) return breadcrumbItems

    const pathnames = location.pathname.split("/").filter((x) => x)

    const items: BreadcrumbItem[] = [
      { label: "Trang chủ", path: "/", isActive: pathnames.length === 0 },
    ]

    let currentPath = ""
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`
      const isLast = index === pathnames.length - 1

      items.push({
        label: pathLabels[pathname] || pathname,
        path: currentPath,
        isActive: isLast,
      })
    })

    return items
  }

  const items = generateBreadcrumbs()

  if (items.length <= 1) return null

  return (
    <nav className="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400 select-none">
                  {separator}
                </span>
              )}

              {item.isActive ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-500 hover:text-gray-700 hover:underline transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumb
