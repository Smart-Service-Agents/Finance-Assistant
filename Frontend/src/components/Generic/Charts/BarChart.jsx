export default function BarChart({ data, title, maxValue }){
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium text-gray-700 text-right">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.color
                }}
              >
                <span className="text-white text-xs font-semibold">
                  {item.value.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}