import { useState } from "react"

export interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  required?: boolean
  helperText?: string
  helperTextColor?: "green" | "red" | "gray"
  disabled?: boolean
  disabledMessage?: string
}

/**
 * CustomSelect - Component select dropdown có floating label
 *
 * Tính năng:
 * - Floating label: Label nổi nằm giữa border, tự động thu nhỏ khi focus hoặc có giá trị.
 * - Dropdown options với search/filter.
 * - Hiệu ứng border xanh lá khi focus hoặc có giá trị.
 * - Responsive, dễ dàng tái sử dụng.
 * - Tích hợp với sub-vn cho địa chỉ Việt Nam.
 * - Tooltip chỉ dẫn khi select bị disabled.
 *
 * Props:
 * @param {string} label - Nhãn hiển thị cho select (sẽ làm placeholder khi chưa chọn).
 * @param {string} value - Giá trị hiện tại (value của option được chọn).
 * @param {(value: string) => void} onChange - Hàm callback khi giá trị thay đổi.
 * @param {SelectOption[]} options - Danh sách options để chọn.
 * @param {boolean} [required] - Có hiển thị dấu * đỏ không.
 * @param {string} [helperText] - Text hướng dẫn hoặc báo lỗi.
 * @param {"green"|"red"|"gray"} [helperTextColor] - Màu của helper text.
 * @param {boolean} [disabled] - Vô hiệu hóa select.
 * @param {string} [disabledMessage] - Thông báo hiển thị khi click vào select bị disabled.
 */
const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  required = false,
  helperText,
  helperTextColor = "gray",
  disabled = false,
  disabledMessage,
}: CustomSelectProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDisabledTooltip, setShowDisabledTooltip] = useState(false)

  const helperColorClasses = {
    green: "text-green-600",
    red: "text-red-500",
    gray: "text-gray-500",
  }

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value)
  const displayText = selectedOption?.label || ""

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    } else if (disabledMessage) {
      // Show tooltip when clicking disabled select
      setShowDisabledTooltip(true)
      setTimeout(() => setShowDisabledTooltip(false), 3000)
    }
  }

  return (
    <div className="w-full space-y-2">
      {/* Select Container with Floating Label */}
      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          // We intentionally do NOT use the native disabled attribute so we can still capture clicks
          // to show the guidance tooltip. Instead we emulate disabled behavior with aria-disabled,
          // styling, and removing the element from the tab order.
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click on option
            setTimeout(() => setIsFocused(false), 200)
          }}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 outline-none text-left flex items-center justify-between ${
            disabled
              ? "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-300"
              : helperText && helperTextColor === "red"
              ? "border-red-500 bg-red-50"
              : isFocused || value || isOpen
              ? "border-green-500 bg-white"
              : "border-gray-300 bg-gray-50"
          } ${
            !disabled && "hover:border-green-400 focus:border-green-500"
          } text-gray-900`}
        >
          <span className={displayText ? "text-gray-900" : "text-transparent"}>
            {displayText || "placeholder"}
          </span>
          {/* Arrow Icon */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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

        {/* Floating Label */}
        <label
          className={`absolute left-3 transition-all duration-300 pointer-events-none ${
            isFocused || value || isOpen
              ? "top-0 -translate-y-1/2 text-xs bg-white px-2 text-green-500 font-medium"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Disabled Tooltip */}
        {disabled && showDisabledTooltip && (
          <div className="absolute left-0 top-full mt-1 w-full bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-medium">{disabledMessage}</span>
            </div>
          </div>
        )}

        {/* Dropdown Options */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-green-500 rounded-lg shadow-xl max-h-64 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-green-500 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors duration-150 ${
                      option.value === value
                        ? "bg-green-100 text-main font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className={`text-xs ${helperColorClasses[helperTextColor]} ml-1`}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export default CustomSelect
