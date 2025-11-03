import { useState } from "react"
import { DatePicker } from "antd"
import type { Dayjs } from "dayjs"
import { Calendar } from "lucide-react"

const { RangePicker } = DatePicker

interface CustomDateRangePickerProps {
  placeholder?: [string, string]
  value: [Dayjs | null, Dayjs | null]
  onChange: (dates: [Dayjs | null, Dayjs | null]) => void
  helperText?: string
  helperTextColor?: "green" | "red" | "gray"
  format?: string
  disabled?: boolean
}

/**
 * CustomDateRangePicker - Component chọn khoảng thời gian với floating label
 *
 * Tính năng:
 * - Floating label: Label nổi nằm giữa border, tự động thu nhỏ khi focus hoặc có giá trị
 * - Sử dụng RangePicker của Ant Design bên trong
 * - Style giống với CustomInput component
 * - Hiệu ứng border xanh lá khi focus hoặc có giá trị
 * - Responsive, dễ dàng tái sử dụng
 *
 * Props:
 * @param {[string, string]} placeholder - Placeholder cho [start date, end date]
 * @param {[Dayjs | null, Dayjs | null]} value - Giá trị hiện tại [start, end]
 * @param {(dates: [Dayjs | null, Dayjs | null]) => void} onChange - Callback khi giá trị thay đổi
 * @param {string} helperText - Text hướng dẫn hoặc lỗi
 * @param {"green"|"red"|"gray"} helperTextColor - Màu của helper text
 * @param {string} format - Format hiển thị ngày (mặc định: "DD/MM/YYYY")
 * @param {boolean} disabled - Vô hiệu hóa input
 *
 * Ví dụ sử dụng:
 *
 * const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])
 *
 * <CustomDateRangePicker
 *   label="Thời gian dự kiến thu hoạch"
 *   placeholder={["Từ ngày", "Đến ngày"]}
 *   value={dateRange}
 *   onChange={setDateRange}
 *   required
 *   format="DD/MM/YYYY"
 * />
 */
const CustomDateRangePicker = ({
  placeholder = ["dd/mm/yyyy", "dd/mm/yyyy"],
  value,
  onChange,
  helperText,
  helperTextColor = "gray",
  format = "DD/MM/YYYY",
  disabled = false,
}: CustomDateRangePickerProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const hasValue = value[0] !== null || value[1] !== null

  const helperColorClasses = {
    green: "text-green-600",
    red: "text-red-500",
    gray: "text-gray-500",
  }

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    onChange(dates || [null, null])
  }

  return (
    <div className="w-full space-y-2">
      {/* DateRangePicker Container with Floating Label */}
      <div className="relative">
        <div
          className={`border-2 rounded-lg transition-all duration-300 ${
            helperText && helperTextColor === "red"
              ? "border-red-500 bg-red-50"
              : isFocused || hasValue
              ? "border-green-500 bg-white"
              : "border-gray-300 bg-gray-50"
          } hover:border-green-400 focus-within:border-green-500 focus-within:bg-white`}
        >
          <RangePicker
            value={value[0] && value[1] ? [value[0], value[1]] : null}
            onChange={handleChange}
            format={format}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            suffixIcon={<Calendar className="w-4 h-4 text-gray-400" />}
            className="w-full custom-range-picker"
            style={{
              border: "none",
              boxShadow: "none",
              padding: "10px 16px",
            }}
          />
        </div>
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className={`text-xs ${helperColorClasses[helperTextColor]} ml-1`}>
          {helperText}
        </p>
      )}

      {/* Custom styles for Ant Design RangePicker */}
      <style>{`
        .custom-range-picker .ant-picker-input > input {
          font-size: 14px;
          color: #111827;
        }
        
        .custom-range-picker .ant-picker-input > input::placeholder {
          color: #9ca3af;
        }
        
        .custom-range-picker.ant-picker-focused {
          border: none !important;
          box-shadow: none !important;
        }
        
        .custom-range-picker:hover {
          border: none !important;
        }
        
        .custom-range-picker .ant-picker-active-bar {
          background: #08A045 !important;
        }
        
        .custom-range-picker .ant-picker-separator {
          color: #6b7280;
        }
      `}</style>
    </div>
  )
}

export default CustomDateRangePicker
