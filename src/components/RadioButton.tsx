import React from "react"

/**
 * RadioButton component
 *
 * Tạo nút chọn dạng radio với hiệu ứng động, icon, tiêu đề, mô tả và trạng thái chọn/disabled.
 * Dùng cho các lựa chọn như phương thức thanh toán, địa chỉ, ...
 *
 * Props:
 * - title: Tiêu đề chính của button
 * - description: Mô tả phụ (optional)
 * - icon: Icon bên phải (ReactNode hoặc img URL, optional)
 * - isSelected: Trạng thái được chọn
 * - onClick: Callback khi click
 * - className: Custom className (optional)
 * - disabled: Disable button (optional)
 */
interface RadioButtonProps {
  title: string
  description?: string
  icon?: React.ReactNode
  isSelected: boolean
  onClick: () => void
  className?: string
  disabled?: boolean
}

const RadioButton: React.FC<RadioButtonProps> = ({
  title,
  description,
  icon,
  isSelected,
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300
        ${
          isSelected
            ? "border-main bg-green-50 shadow-md"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Radio Circle */}
      <div
        className={`
        flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
        ${
          isSelected
            ? "border-main bg-main"
            : "border-gray-300 bg-white group-hover:border-gray-400"
        }
      `}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 bg-white rounded-full bounceIn"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <h3
          className={`font-semibold text-base ${
            isSelected ? "text-main" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        )}
      </div>

      {/* Icon */}
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
      )}
    </button>
  )
}

export default RadioButton
