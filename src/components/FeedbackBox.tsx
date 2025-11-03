interface FeedbackBoxProps {
  feedback: string
  name: string
  role?: string
  rating: number
  avatarUrl?: string
  className?: string
}

/**
 * FeedbackBox - Component hiển thị feedback/testimonial
 *
 * Bao gồm:
 * - Text feedback
 * - Tên và vai trò người đánh giá
 * - Rating sao
 * - Avatar với viền nét đứt màu vàng có animation khi hover
 */
const FeedbackBox = ({
  feedback,
  name,
  role = "",
  rating,
  avatarUrl,
  className = "",
}: FeedbackBoxProps) => {
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      )
    }
    return stars
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-start gap-4">
        {/* Left side - Feedback content */}
        <div className="flex-1">
          {/* Feedback text */}
          <p className="text-gray-600 italic mb-4 leading-relaxed text-sm">
            "{feedback}"
          </p>

          {/* Name, role and stars */}
          <div className="">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
              {role && <p className="text-gray-500 text-sm">{role}</p>}
            </div>
            <div className="flex gap-1">{renderStars()}</div>
          </div>
        </div>

        {/* Right side - Avatar with animated border */}
        <div className="relative group">
          {/* Animated dotted border */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400 group-hover:animate-pulse transition-all duration-300 scale-110"></div>

          {/* Avatar */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl">
                <img
                  src="../assets/imgs/defaultAvatar.jpg"
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedbackBox
