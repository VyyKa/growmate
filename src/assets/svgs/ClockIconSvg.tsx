import type { SvgIconProps } from "../../types/interfaces/custom/SvgIcon"

const ClockIconSvg: React.FC<SvgIconProps> = ({
  size = 24,
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export default ClockIconSvg
