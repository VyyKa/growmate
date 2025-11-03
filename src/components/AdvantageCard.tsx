interface AdvantageCardProps {
  backgroundImage: string
  title: string
  subtitle?: string
  className?: string
}

/**
 * AdvantageCard - Component card với background image và overlay text
 */
const AdvantageCard = ({
  backgroundImage,
  title,
  subtitle,
  className = "",
}: AdvantageCardProps) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden h-72 w-full group transition-transform duration-300 hover:scale-105 ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <h3 className="text-white text-lg font-bold leading-tight">{title}</h3>
        {subtitle && <p className="text-white/90 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export default AdvantageCard
