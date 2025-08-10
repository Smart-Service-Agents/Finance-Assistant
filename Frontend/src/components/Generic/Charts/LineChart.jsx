export default function LineChart({ data, title, color = '#3B82F6' }){
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const getY = (value) => {
    return 100 - ((value - minValue) / range) * 100;
  };
  
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: getY(item.value),
    value: item.value,
    label: item.label
  }));
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="relative h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="0.2"
              />
            ))}
            
            {/* Line */}
            <path
              d={pathData}
              fill="none"
              stroke={color}
              strokeWidth="1"
              className="drop-shadow-sm"
            />
            
            {/* Points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill={color}
                className="drop-shadow-sm"
              />
            ))}
          </svg>
          
          {/* Value labels */}
          {points.map((point, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`
              }}
            >
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded mb-1">
                {point.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          {data.map((item, index) => (
            <span key={index} className="transform -rotate-45 origin-left">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}