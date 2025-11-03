type InfoTableRow = {
  label: string
  value: string | React.ReactNode
  highlight?: boolean // Highlight cho row đầu tiên hoặc giá trị quan trọng
}

type InfoTableProps = {
  title: string
  rows: InfoTableRow[]
  className?: string
  titleClassName?: string
  rowClassName?: string
}

const InfoTable = ({
  title,
  rows,
  className = "",
  titleClassName = "",
  rowClassName = "",
}: InfoTableProps) => {
  return (
    <div
      className={`bg-white border border-gray-200 overflow-hidden shadow-sm ${className}`}
    >
      {/* Title */}
      <div
        className={`bg-gray-50 px-6 py-4 border-b border-gray-200 ${titleClassName}`}
      >
        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
          {title}
        </h3>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-[200px_1fr] bg-gray-100 transition-colors duration-150 ${rowClassName}`}
          >
            {/* Label Column */}
            <div className="px-6 py-4 bg-gray-50 md:bg-transparent">
              <span className="text-sm font-semibold text-gray-700">
                {row.label}
              </span>
            </div>

            {/* Value Column */}
            <div className="px-6 py-4 bg-white border-t md:border-t-0 border-gray-100">
              {row.highlight ? (
                <span className="text-sm font-bold text-main">{row.value}</span>
              ) : (
                <span className="text-sm text-gray-600 leading-relaxed">
                  {row.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InfoTable
