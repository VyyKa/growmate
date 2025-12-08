import { useEffect, useState } from "react"
import { useAppSelector } from "../hooks/reduxHooks"
import { getAdoptions } from "../services/API/adoptionAPI"
import type {
  AdoptionListItem,
  AdoptionPaged,
} from "../types/apiResponse/adoptionResponse"
import TreeAdoptBlock from "../components/TreeAdoptBlock"
import Breadcrumb from "../components/Breadcrumb"
import Pagination from "../components/Pagination"
import { getErrorMessage } from "../hooks/getErrorMessage"
import type { AdoptionFilterStatus } from "../types/enums/AdoptionStatus"

type FilterStatus = AdoptionFilterStatus

export default function AdoptManagement() {
  const user = useAppSelector((state) => state.auth.user)
  const [adoptions, setAdoptions] = useState<AdoptionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 3

  // Filter
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchAdoptions = async () => {
    if (!user?.userId) return

    setLoading(true)
    setError(null)

    try {
      const response = await getAdoptions({
        customerId: user.userId,
        page: currentPage,
        pageSize: pageSize,
      })

      // getAdoptions already normalizes envelope/plain responses and returns AdoptionPaged
      const raw: unknown = response

      const isPaged = (obj: unknown): obj is AdoptionPaged => {
        return (
          !!obj &&
          typeof obj === "object" &&
          "items" in (obj as Record<string, unknown>) &&
          "totalItems" in (obj as Record<string, unknown>) &&
          "pageNumber" in (obj as Record<string, unknown>)
        )
      }

      const isEnvelope = (
        obj: unknown
      ): obj is {
        data: AdoptionPaged
        success?: boolean
        message?: string
      } => {
        return (
          !!obj &&
          typeof obj === "object" &&
          "data" in (obj as Record<string, unknown>)
        )
      }

      let paged: AdoptionPaged | null = null
      if (isPaged(raw)) {
        paged = raw
      } else if (isEnvelope(raw) && isPaged(raw.data)) {
        paged = raw.data
      }

      if (paged) {
        const { items, totalPages: total, totalItems: count } = paged
        setAdoptions(items)
        setTotalPages(total)
        setTotalItems(count)
      } else {
        setError("Không thể tải danh sách cây nhận nuôi")
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.userId) {
      fetchAdoptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, filterStatus])

  // Filter adoptions by status and search
  const filteredAdoptions = adoptions.filter((adoption) => {
    const matchesStatus =
      filterStatus === "ALL" || adoption.status.toUpperCase() === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      adoption.treeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adoption.postCode.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusCount = (status: FilterStatus) => {
    if (status === "ALL") return totalItems
    return adoptions.filter((a) => a.status.toUpperCase() === status).length
  }

  const filterOptions: { label: string; value: FilterStatus; color: string }[] =
    [
      {
        label: "Tất cả",
        value: "ALL",
        color: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      {
        label: "Đang nuôi",
        value: "ACTIVE",
        color: "bg-green-100 text-green-700 hover:bg-green-200",
      },
      {
        label: "Chờ xử lý",
        value: "PENDING",
        color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
      {
        label: "Hoàn thành",
        value: "COMPLETED",
        color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      },
      {
        label: "Đã hủy",
        value: "CANCELLED",
        color: "bg-red-100 text-red-700 hover:bg-red-200",
      },
    ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Vui lòng đăng nhập để xem danh sách cây nhận nuôi
          </h2>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Breadcrumb />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">🌳 Quản Lý Cây Nhận Nuôi</h1>
          <p className="text-lg text-green-50">
            Theo dõi và quản lý các cây bạn đang nhận nuôi tại GrowMate
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng số cây</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {totalItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌲</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đang nuôi</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {getStatusCount("ACTIVE")}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Chờ xử lý</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {getStatusCount("PENDING")}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Hoàn thành</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {getStatusCount("COMPLETED")}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterStatus(option.value)
                    setCurrentPage(1)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filterStatus === option.value
                      ? `${option.color} shadow-md ring-2 ring-offset-2 ring-${
                          option.value === "ALL"
                            ? "gray"
                            : option.value.toLowerCase()
                        }-300`
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                  {option.value === "ALL" && (
                    <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên cây, nhà vườn, mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-main)] focus:border-transparent transition-all duration-200"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-main)] border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">
              Đang tải danh sách cây...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-red-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Có lỗi xảy ra</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchAdoptions}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAdoptions.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-100 rounded-full mb-6">
              <span className="text-6xl">🌱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm || filterStatus !== "ALL"
                ? "Không tìm thấy cây phù hợp"
                : "Bạn chưa nhận nuôi cây nào"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "ALL"
                ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                : "Hãy bắt đầu nhận nuôi một cây để bảo vệ môi trường!"}
            </p>
            {!searchTerm && filterStatus === "ALL" && (
              <a
                href="/adopt"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Khám phá cây để nhận nuôi
              </a>
            )}
          </div>
        )}

        {/* Adoptions Grid */}
        {!loading && !error && filteredAdoptions.length > 0 && (
          <>
            <div className="grid grid-cols-1  gap-6 mb-8">
              {filteredAdoptions.map((adoption) => (
                <TreeAdoptBlock key={adoption.adoptionId} adoption={adoption} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="justify-center"
                />
              </div>
            )}

            {/* Results Info */}
            <div className="text-center text-gray-600 mt-4">
              Hiển thị {filteredAdoptions.length} / {totalItems} cây
            </div>
          </>
        )}
      </div>
    </div>
  )
}
