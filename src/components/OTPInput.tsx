import { useState, useRef, useEffect } from "react"

interface OTPInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
}

const OTPInput = ({ length, value, onChange, onComplete }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Sync with parent value
  useEffect(() => {
    const otpArray = value
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length)
    setOtp(otpArray)
  }, [value, length])

  const handleChange = (index: number, digit: string) => {
    // Only allow numbers
    const numericDigit = digit.replace(/\D/g, "")
    if (numericDigit.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = numericDigit

    setOtp(newOtp)
    const otpString = newOtp.join("")
    onChange(otpString)

    // Auto focus next input
    if (numericDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all digits are filled
    if (otpString.length === length && onComplete) {
      onComplete(otpString)
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
    const otpArray = pastedData
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length)
    setOtp(otpArray)
    onChange(pastedData)

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData)
    }
  }

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-all duration-200 ${
            digit
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-300 bg-white text-gray-900"
          } focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-200`}
        />
      ))}
    </div>
  )
}

export default OTPInput
