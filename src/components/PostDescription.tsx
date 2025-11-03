import { useState } from "react"

type PostDescriptionProps = {
  title: string
  subtitle?: string
  sections: {
    heading?: string
    content: string
  }[]
  className?: string
}

const PostDescription = ({
  title,
  subtitle,
  sections,
  className = "",
}: PostDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      {/* Main Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">
        {title}
      </h2>

      {/* Subtitle (if provided) */}
      {subtitle && (
        <h3 className="text-base font-bold text-gray-800 mb-3">{subtitle}</h3>
      )}

      {/* Content Sections */}
      <div
        className={`space-y-4 overflow-hidden transition-all duration-300 ${
          !isExpanded ? "max-h-48" : "max-h-none"
        }`}
      >
        {sections.map((section, index) => (
          <div key={index}>
            {section.heading && (
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                {section.heading}
              </h4>
            )}
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Gradient overlay when collapsed */}
      {!isExpanded && (
        <div className="h-12 bg-gradient-to-b from-transparent to-gray-50 -mt-12 relative" />
      )}

      {/* Toggle Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={toggleExpand}
          className="px-6 py-2 border border-main text-main rounded-md hover:bg-main hover:text-white transition-all duration-200 text-sm font-medium flex items-center gap-2"
        >
          <span>{isExpanded ? "Thu gọn" : "Xem thêm"}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
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
      </div>
    </div>
  )
}

export default PostDescription
