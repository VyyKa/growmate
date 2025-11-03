import type { SvgIconProps } from "../../types/interfaces/custom/SvgIcon"

const GarbageCanIconSvg = ({ size = 24, className = "" }: SvgIconProps) => (
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
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
)

export default GarbageCanIconSvg
