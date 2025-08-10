import React from 'react';
import { Star, MapPin, DollarSign, Eye, TrendingUp } from 'lucide-react';


export default function HotelPerformanceCard({hotel}) {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingUp size={16} className="text-red-600 rotate-180" />;
      case 'stable':
        return <div className="w-4 h-0.5 bg-gray-400 rounded"></div>;
      default:
        return null;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };


  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 ${
      hotel.isClient ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-800">{hotel.name}</h3>
            {hotel.isClient && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                Your Hotel
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={14} />
            <span className="text-sm">{hotel.location}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.floor(hotel.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
            <span className="ml-1 font-semibold text-gray-800">{hotel.rating}</span>
          </div>
          <p className="text-xs text-gray-500">{hotel.reviewCount.toLocaleString()} reviews</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Average Price */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Avg. Price</span>
          </div>
          <p className="text-xl font-bold text-gray-800">${hotel.averagePrice}</p>
          <p className="text-xs text-gray-500">per night</p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Occupancy</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{hotel.occupancyRate}%</p>
          <p className="text-xs text-gray-500">current rate</p>
        </div>
      </div>

      {/* Booking Trend */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">Booking Trend</span>
        <div className="flex items-center gap-2">
          {getTrendIcon(hotel.bookingTrend)}
          <span className={`text-sm font-semibold ${getTrendColor(hotel.bookingTrend)}`}>
            {hotel.bookingTrend === 'stable' ? 'Stable' : `${hotel.trendPercentage}%`}
          </span>
        </div>
      </div>
    </div>
  );

}