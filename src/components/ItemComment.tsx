import { StarSvg } from "../assets/svgs/StarSvg"

type PostCommentProps = {
  avatarUrl?: string
  userName: string
  date: string
  rating: number
  comment: string
  className?: string
}

const ItemComment = ({
  avatarUrl = "/src/assets/imgs/defaultAvatar.png",
  userName,
  date,
  rating,
  comment,
  className = "",
}: PostCommentProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <StarSvg
        key={index}
        size={16}
        className={`transition-all duration-200 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
        filled={index < rating}
      />
    ))

  return (
    <div
      className={`flex gap-4 py-6 px-5 border-b border-gray-200 last:border-b-0 ${className}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={avatarUrl}
          alt={userName}
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-200"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header: Name, Date, Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h4 className="text-base font-bold text-gray-900">{userName}</h4>
            <p className="text-sm text-main font-medium mt-0.5">
              {formatDate(date)}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex gap-0.5">{renderStars(rating)}</div>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-gray-600 leading-relaxed">{comment}</p>
      </div>
    </div>
  )
}

export default ItemComment
