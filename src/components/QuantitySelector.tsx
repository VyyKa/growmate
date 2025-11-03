type QuantitySelectorProps = {
  label: string
  value: number
  unit: string
  onIncrement: () => void
  onDecrement: () => void
  className?: string
}

const QuantitySelector = ({
  label,
  value,
  unit,
  onIncrement,
  onDecrement,
  className = "",
}: QuantitySelectorProps) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white hover:border-main transition-colors duration-200">
        {/* Decrease Button */}
        <button
          onClick={onDecrement}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-main hover:text-white transition-colors duration-200 text-gray-600 font-bold text-lg"
          aria-label="Decrease"
        >
          −
        </button>

        {/* Value Display */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900 min-w-[3ch] text-center">
            {value}
          </span>
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>

        {/* Increase Button */}
        <button
          onClick={onIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-main hover:text-white transition-colors duration-200 text-gray-600 font-bold text-lg"
          aria-label="Increase"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
