interface BlogBoxProps {
  title: string
  date: string
  author: string
  backgroundImage: string
  className?: string
  onClick?: () => void
}

/**
 * BlogBox - Component hiển thị blog card
 *
 * Thiết kế theo layout báo chí:
 * - Hình ảnh ở trên
 * - Tiêu đề bài viết dưới hình
 * - Thông tin tác giả và ngày tháng
 * - Hover effects với scale và shadow
 */
const BlogBox = ({
  title,
  date,
  author,
  backgroundImage,
  className = "",
  onClick,
}: BlogBoxProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content below image */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-base sm:text-lg leading-tight text-gray-800 mb-3 group-hover:text-main transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium">{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogBox
