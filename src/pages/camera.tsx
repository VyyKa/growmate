import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Breadcrumb from "../components/Breadcrumb"
import { getAdoptionById } from "../services/API/adoptionAPI"
import { getErrorMessage } from "../hooks/getErrorMessage"
import type { AdoptionListItem } from "../types/apiResponse/adoptionResponse"

export default function CameraPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [adoption, setAdoption] = useState<AdoptionListItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<"auto" | "hd" | "sd">(
    "auto"
  )

  useEffect(() => {
    const fetchAdoption = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const data = await getAdoptionById(Number(id))
        if (data) {
          setAdoption(data)
        } else {
          setError("Không tìm thấy thông tin cây nhận nuôi")
        }
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    fetchAdoption()
  }, [id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Breadcrumb />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[var(--color-main)] border-t-transparent mb-4 mx-auto"></div>
            <p className="text-gray-600 font-medium">Đang tải camera...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !adoption) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <Breadcrumb />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Không thể tải thông tin camera"}
            </p>
            <button
              onClick={() => navigate("/adopt-management")}
              className="px-6 py-3 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Quay lại quản lý
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      <Breadcrumb />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Live Stream
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">📹 Camera Giám Sát</h1>
              <p className="text-blue-100">
                {adoption.treeName} - {adoption.farmerName}
              </p>
            </div>
            <button
              onClick={() => navigate("/adopt-management")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-medium transition-all duration-200"
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
              {/* Video Container */}
              <div className="relative bg-black aspect-video">
                {/* Placeholder for video - replace with actual video source */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <p className="text-white text-lg font-semibold mb-2">
                      Camera đang kết nối...
                    </p>
                    <p className="text-gray-400 text-sm">
                      Vui lòng đợi trong giây lát
                    </p>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold">LIVE</span>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                        </svg>
                      </button>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <input
                          type="range"
                          className="w-24 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                          min="0"
                          max="100"
                          defaultValue="70"
                        />
                      </div>
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quality Selector */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      Chất lượng:
                    </span>
                    <div className="flex gap-2">
                      {(["auto", "hd", "sd"] as const).map((quality) => (
                        <button
                          key={quality}
                          onClick={() => setSelectedQuality(quality)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                            selectedQuality === quality
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {quality.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Kết nối ổn định</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin camera
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    Độ phân giải
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    1920x1080 (Full HD)
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600 font-medium mb-1">FPS</p>
                  <p className="text-sm font-bold text-gray-800">
                    30 khung/giây
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-purple-600 font-medium mb-1">
                    Trạng thái
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    Đang phát trực tiếp
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-orange-600 font-medium mb-1">
                    Vị trí
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {adoption.farmerName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tree Info Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">🌳 Thông tin cây</h3>
                <p className="text-green-100 text-sm">
                  Mã: {adoption.postCode}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tên cây</p>
                  <p className="font-bold text-gray-800">{adoption.treeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nông trại</p>
                  <p className="font-semibold text-[var(--color-main)]">
                    {adoption.farmerName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ngày nhận nuôi</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatDate(adoption.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ngày hết hạn</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatDate(adoption.endDate)}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/adopt/${id}`)}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">
                ⚡ Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Chụp ảnh màn hình
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  Ghi hình
                </button>
                <button
                  onClick={() => navigate(`/adopt/${id}/contact`)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Liên hệ chủ vườn
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-5 border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Mẹo sử dụng</h4>
                  <ul className="text-sm text-gray-700 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>Nhấn nút toàn màn hình để xem rõ hơn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>Chọn chất lượng HD cho hình ảnh tốt nhất</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>Camera hoạt động 24/7 để bạn theo dõi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
