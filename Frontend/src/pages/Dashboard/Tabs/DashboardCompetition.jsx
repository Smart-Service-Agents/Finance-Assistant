import { Building2, TrendingUp, Settings } from 'lucide-react';
import HotelPerformanceCard from '../../../components/Generic/Cards/HotelPerformanceCard';

import { useEffect } from 'react';

const DashboardCompetition = () => {
  useEffect = (() => {
    (async () => {
      const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_COMPETITION_PATH

      const response = await fetch(uri, {
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: {
          'hotel': 'hilton',
          'master': 'rey-master-eo'
        }
      })

      console.log(response);
    })();
  });


  // Sample hotel performance data
  const hotelPerformanceData = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      isClient: true,
      rating: 4.3,
      reviewCount: 1247,
      averagePrice: 189,
      occupancyRate: 78,
      location: 'Downtown',
      bookingTrend: 'up',
      trendPercentage: 12
    },
    {
      id: '2',
      name: 'Royal Crown Hotel',
      isClient: false,
      rating: 4.1,
      reviewCount: 892,
      averagePrice: 165,
      occupancyRate: 82,
      location: 'City Center',
      bookingTrend: 'up',
      trendPercentage: 8
    },
    {
      id: '3',
      name: 'Luxury Suites Downtown',
      isClient: false,
      rating: 4.5,
      reviewCount: 634,
      averagePrice: 245,
      occupancyRate: 71,
      location: 'Financial District',
      bookingTrend: 'down',
      trendPercentage: 5
    },
    {
      id: '4',
      name: 'Metropolitan Inn',
      isClient: false,
      rating: 3.9,
      reviewCount: 1156,
      averagePrice: 142,
      occupancyRate: 85,
      location: 'Business District',
      bookingTrend: 'stable',
      trendPercentage: 2
    }
  ];

  return (
    <div className="space-y-8">
      {/* Your Hotel Performance */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Your Hotel Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hotelPerformanceData
            .filter(hotel => hotel.isClient)
            .map((hotel) => (
              <HotelPerformanceCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
      </div>

      {/* Competition Performance */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Competition Analysis</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {hotelPerformanceData
            .filter(hotel => !hotel.isClient)
            .map((hotel) => (
              <HotelPerformanceCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
      </div>

      {/* Customize Analysis Button */}
      <div className="flex justify-center pt-8">
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3">
          <Settings size={24} />
          Customize Your Competition Analysis
        </button>
      </div>
    </div>
  );
};

export default DashboardCompetition;