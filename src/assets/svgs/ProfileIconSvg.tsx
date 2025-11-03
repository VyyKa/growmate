import type { SvgIconProps } from "../../types/interfaces/custom/SvgIcon"

const SVGComponent = ({ size = 24, className = "" }: SvgIconProps) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={3}
    stroke="#000000"
    fill="currentColor"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <circle cx={32} cy={18.14} r={11.14} />
      <path d="M54.55,56.85A22.55,22.55,0,0,0,32,34.3h0A22.55,22.55,0,0,0,9.45,56.85Z" />
    </g>
  </svg>
)
export default SVGComponent
