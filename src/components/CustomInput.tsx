import { useState } from "react"

interface CustomInputProps {
  label: string
  placeholder: string
  type?: "text" | "password" | "tel" | "email"
  value: string
  onChange: (value: string) => void
  required?: boolean
  helperText?: string
  helperTextColor?: "green" | "red" | "gray"
}

/**
 * AuthInput - Component input có floating label, hỗ trợ nhập số điện thoại, mật khẩu, v.v.
 *
 * Tính năng:
 * - Floating label: Label nổi nằm giữa border, tự động thu nhỏ khi focus hoặc có giá trị.
 * - Hỗ trợ các loại input: text, password, tel, email.
 * - Hiển thị icon show/hide password cho trường mật khẩu.
 * - Hiệu ứng border xanh lá khi focus hoặc có giá trị.
 * - Responsive, dễ dàng tái sử dụng.
 *
 * Props:
 * @param {string} label - Nhãn hiển thị cho input (ví dụ: "Số điện thoại").
 * @param {string} placeholder - Placeholder hiển thị khi focus.
 * @param {"text"|"password"|"tel"|"email"} [type] - Loại input, mặc định là "text".
 * @param {string} value - Giá trị hiện tại của input (nên dùng state để control).
 * @param {(value: string) => void} onChange - Hàm callback khi giá trị thay đổi.
 * @param {boolean} [required] - Có hiển thị dấu * đỏ không (bắt buộc nhập).
 *
 * Ví dụ sử dụng:
 *
 * const [phone, setPhone] = useState("");
 * <AuthInput
 *   label="Số điện thoại"
 *   placeholder="Nhập SĐT của bạn để đăng nhập"
 *   type="tel"
 *   value={phone}
 *   onChange={setPhone}
 *   required
 * />
 *
 * const [password, setPassword] = useState("");
 * <AuthInput
 *   label="Mật khẩu"
 *   placeholder="Nhập mật khẩu"
 *   type="password"
 *   value={password}
 *   onChange={setPassword}
 *   required
 * />
 */
const CustomInput = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  helperText,
  helperTextColor = "gray",
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = type === "password" && showPassword ? "text" : type

  const helperColorClasses = {
    green: "text-green-600",
    red: "text-red-500",
    gray: "text-gray-500",
  }

  return (
    <div className="w-full space-y-2">
      {/* Input Container with Floating Label */}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 outline-none ${
            helperText && helperTextColor === "red"
              ? "border-red-500 bg-red-50"
              : isFocused || value
              ? "border-green-500 bg-white"
              : "border-gray-300 bg-gray-50"
          } hover:border-green-400 focus:border-green-500 focus:bg-white text-gray-900 placeholder-gray-400`}
        />

        {/* Floating Label */}
        <label
          className={`absolute left-3 transition-all duration-300 pointer-events-none ${
            isFocused || value
              ? "top-0 -translate-y-1/2 text-xs bg-white px-2 text-green-500 font-medium"
              : "top-1/2 -translate-y-1/2 text-base text-gray-500"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Password Toggle Button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
          >
            {showPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              // Eye icon (show password)
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
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

export default CustomInput
