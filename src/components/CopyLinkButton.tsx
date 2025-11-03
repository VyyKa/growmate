import { useState } from "react"
import { toast } from "react-toastify"
import ShareIconSvg from "../assets/svgs/ShareIconSvg"

interface CopyLinkButtonProps {
  url: string
  className?: string
}

const CopyLinkButton = ({ url, className = "" }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Đã sao chép liên kết!")

        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          setCopied(true)
          toast.success("Đã sao chép liên kết!")

          setTimeout(() => {
            setCopied(false)
          }, 2000)
        } catch (err) {
          console.error("Failed to copy:", err)
          toast.error("Không thể sao chép liên kết")
        }

        textArea.remove()
      }
    } catch (err) {
      console.error("Failed to copy:", err)
      toast.error("Không thể sao chép liên kết")
    }
  }

  return (
    <button
      onClick={handleCopyLink}
      className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors relative ${className} ${
        copied ? "bg-green-50" : ""
      }`}
      aria-label="Sao chép liên kết"
      title={copied ? "Đã sao chép!" : "Sao chép liên kết"}
    >
      {copied ? (
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <ShareIconSvg className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}

export default CopyLinkButton
