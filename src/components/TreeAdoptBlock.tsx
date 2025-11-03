import { useNavigate } from "react-router-dom"
import type { AdoptionListItem } from "../types/apiResponse/adoptionResponse"
import {
  getAdoptionStatusColor,
  getAdoptionStatusText,
} from "../types/enums/AdoptionStatus"

interface TreeAdoptBlockProps {
  adoption: AdoptionListItem
}

export default function TreeAdoptBlock({ adoption }: TreeAdoptBlockProps) {
  const navigate = useNavigate()

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("vi-VN")
  }

  // use shared helpers for status label/color

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[var(--color-main)] overflow-hidden">
      {/* Horizontal Layout: Image Left, Content Right */}
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Left Side */}
        <div className="relative w-full sm:w-56 h-52 sm:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-green-100">
          <img
            src={adoption.primaryImageUrl || "/placeholder-tree.jpg"}
            alt={adoption.treeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-main)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section - Right Side */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-green-50/20">
          {/* Header with Title and Status */}
          <div className="mb-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-main)] transition-colors leading-tight flex-1">
                {adoption.treeName} - {adoption.farmerName}
              </h3>
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 whitespace-nowrap shadow-sm ${getAdoptionStatusColor(
                  adoption.status
                )}`}
              >
                {getAdoptionStatusText(adoption.status)}
              </span>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-[var(--color-main)] to-emerald-400 rounded-full group-hover:w-24 transition-all duration-300"></div>
          </div>

          {/* Info List */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-main)]"></div>
              <span className="text-sm text-gray-600 font-medium min-w-[150px]">
                Nông trại:
              </span>
              <span className="text-sm font-bold text-[var(--color-main)] bg-green-50 px-3 py-1 rounded-lg">
                {adoption.farmerName}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 font-medium min-w-[150px]">
                Ngày nhận nuôi:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-blue-50 px-3 py-1 rounded-lg">
                {formatDate(adoption.startDate)}
              </span>
            </div>

            <div className="flex items-center gap-3 group/item hover:translate-x-1 transition-transform duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 font-medium min-w-[150px]">
                Ngày hết hạn hợp đồng:
              </span>
              <span className="text-sm font-semibold text-gray-800 bg-purple-50 px-3 py-1 rounded-lg">
                {formatDate(adoption.endDate)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => navigate(`/adopt/${adoption.adoptionId}/camera`)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
            >
              📹 Xem camera
            </button>

            <button
              onClick={() => navigate(`/adopt/${adoption.adoptionId}`)}
              className="px-5 py-2.5 bg-gradient-to-r from-[var(--color-main)] to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
            >
              📋 Thông tin chi tiết
            </button>

            <button
              onClick={() => navigate(`/adopt/${adoption.adoptionId}/contact`)}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
            >
              💬 Liên hệ chủ vườn
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-main)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  )
}
