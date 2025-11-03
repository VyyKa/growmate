import { DialScaleSvg } from "../assets/svgs/DialScaleSvg"
import { StarSvg } from "../assets/svgs/StarSvg"
import { formatPrice } from "../utils/helpers/priceHelpers"

type ItemBoxProps = {
  id: string
  image: string
  title: string
  price: number
  unit?: string
  rating?: number
  className?: string
  onViewDetail?: () => void
}

const ItemBox = ({
  id,
  image,
  title,
  price,
  unit = "50 kg / nồm",
  rating = 5,
  className = "",
  onViewDetail,
}: ItemBoxProps) => {
  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <StarSvg
        key={index}
        size={14}
        className={`transition-all duration-200 ${
          index < rating ? "text-yellow-400 drop-shadow-sm" : "text-gray-300"
        }`}
        filled={index < rating}
      />
    ))

  return (
    <div
      className={`group bg-white overflow-hidden hover:shadow-2xl hover:shadow-main hover:-translate-y-1 transition-all duration-300 border border-gray-100 ${className}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover ease-out"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ID Badge */}
        <div className="absolute top-3 left-3 bg-main text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-lg backdrop-blur-sm bg-opacity-95">
          {id}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-gray-800 font-semibold mb-2 line-clamp-2 min-h-[3rem] text-base leading-snug group-hover:text-main transition-colors duration-200">
          {title}
        </h3>

        {/* Unit */}
        <div className="flex items-center gap-1.5 mb-4">
          <DialScaleSvg size={16} className="" />
          <p className="text-gray-500 text-sm font-medium">{unit}</p>
        </div>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">
              Giá bán
            </span>
            <span className="text-main text-xl font-bold tracking-tight">
              {formatPrice(price)}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-0.5">{renderStars(rating)}</div>
            <span className="text-xs text-gray-500 font-medium">
              {rating}.0/5.0
            </span>
          </div>
        </div>

        {/* View Detail Button */}
        <button
          onClick={onViewDetail}
          className="w-full bg-main text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn cursor-pointer"
        >
          <span>Xem chi tiết</span>
          <svg
            className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ItemBox
