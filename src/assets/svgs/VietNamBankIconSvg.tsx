import type React from "react"
import type { SvgIconProps } from "../../types/interfaces/custom/SvgIcon"

const VietNamBankIconSvg: React.FC<SvgIconProps> = ({
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g id="bank_icon" fill="#000000">
      <polygon points="256,0 64,69.344 64,109.344 80,109.344 80,121.344 432,121.344 432,109.344 448,109.344 448,69.344 " />
      <polygon points="432,357.344 80,357.344 80,389.344 64,389.344 64,421.344 448,421.344 448,389.344 432,389.344 " />
      <polygon points="344,325.344 344,341.344 408,341.344 408,325.344 400,325.344 400,153.344 408,153.344 408,137.344 344,137.344 344,153.344 352,153.344 352,325.344 " />
      <polygon points="224,325.344 224,341.344 288,341.344 288,325.344 280,325.344 280,153.344 288,153.344 288,137.344 224,137.344 224,153.344 232,153.344 232,325.344 " />
      <polygon points="104,325.344 104,341.344 168,341.344 168,325.344 160,325.344 160,153.344 168,153.344 168,137.344 104,137.344 104,153.344 112,153.344 112,325.344 " />
    </g>
    <g id="vietnam_flag" transform="translate(190 120) scale(9.5)">
      <path
        fill="#DA251D"
        d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z"
      />
      <path
        fill="#FF0"
        d="M19.753 16.037L18 10.642l-1.753 5.395h-5.672l4.589 3.333l-1.753 5.395L18 21.431l4.589 3.334l-1.753-5.395l4.589-3.333z"
      />
    </g>
    <text
      x={256}
      y={490}
      fontFamily="sans-serif"
      fontSize={64}
      fontWeight="bold"
      textAnchor="middle"
      fill="#000000"
    >
      {"NG\xC2N H\xC0NG"}
    </text>
  </svg>
)
export default VietNamBankIconSvg
