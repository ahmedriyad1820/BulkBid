import React from 'react'

const PieChart = ({ data, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm">No data</div>
        </div>
      </div>
    )
  }

  let cumulativePercentage = 0
  const radius = (size - 20) / 2
  const centerX = size / 2
  const centerY = size / 2

  const createPath = (percentage, index) => {
    const startAngle = (cumulativePercentage * 360) - 90
    const endAngle = ((cumulativePercentage + percentage) * 360) - 90
    cumulativePercentage += percentage

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)

    const largeArcFlag = percentage > 0.5 ? 1 : 0

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total
            return (
              <path
                key={index}
                d={createPath(percentage, index)}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PieChart
