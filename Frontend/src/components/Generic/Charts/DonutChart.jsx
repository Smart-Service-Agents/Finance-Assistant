export default function DonutChart({ data, title, reviews=0 }){
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const reviewCount = reviews;
  const analysis = (reviews > 0) ? 'Reviews Analysed' : 'Sentiments Analysed';
  const radius = 115;
  const strokeWidth = 18;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  let cumulativePercentage = 0;
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      <div className="flex items-center justify-center gap-12 flex-wrap lg:flex-nowrap">
        {/* Chart */}
        <div className="relative flex-shrink-0">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90 drop-shadow-sm"
          >
            <circle
              stroke="#E5E7EB"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  stroke={item.color}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-700 ease-out"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{reviewCount > 0 ? reviewCount : total}</div>
              <div className="text-sm text-gray-600 font-medium">{analysis}</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-4 min-w-0 flex-1">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-lg">{item.label}</div>
                  <div className="text-gray-600">
                    <span className="font-medium">{item.value}</span> sentiments ({percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}