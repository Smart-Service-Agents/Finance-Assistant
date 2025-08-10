/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { 
  Building2, 
  Star, 
  TrendingUp, 
  BarChart3, 
  MessageCircle, 
  ArrowRight,
  CheckCircle,
  Brain,
  Zap,
} from 'lucide-react';
import LoadingSpinner from '../components/Generic/LoadingSpinner';


import AuthModal from "../sections/AuthModal";
import { useNavigate } from 'react-router-dom';

function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Landing() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeDemo, setActiveDemo] = useState(null);
    const [demoInputs, setDemoInputs] = useState({
        hotelName: '',
        competitorName: ''
    });
    const [demoResults, setDemoResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    

    const openAuthModal = function(){
        setModalOpen(true);
    }

    const onClose = function(){
        setModalOpen(false);
    }

    const navigate = useNavigate();

    useEffect(() => {
      if (getCookie('authenticated')?.toLowerCase() === 'true')
        navigate('/dashboard');
    });

    const features = [
        {
            icon: <Star className="w-8 h-8 text-yellow-500" />,
            title: "Review Analysis",
            description: "Aggregate and analyze reviews from all major platforms with AI-powered sentiment analysis",
            benefits: ["Multi-platform integration", "Sentiment tracking", "Trend identification"]
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-green-500" />,
            title: "Competition Tracking",
            description: "Monitor competitor performance and benchmark your hotel against the market",
            benefits: ["Real-time competitor data", "Performance metrics", "Market positioning"]
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
            title: "Advanced Analytics",
            description: "Deep dive into guest experience data with interactive charts and insights",
            benefits: ["Custom dashboards", "Performance tracking", "Data visualization"]
        },
        {
            icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
            title: "AI Assistant",
            description: "Get personalized improvement recommendations based on your review data",
            benefits: ["Smart recommendations", "Priority insights", "Action planning"]
        }
    ];

    const handleDemo = async (demoType) => {
      if (!demoInputs.hotelName.trim()) return;
    
      setIsLoading(true);
      setActiveDemo(demoType);
    
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    
      // Generate mock results based on demo type
      let mockResult;
    
      switch (demoType) {
        case 'analysis':
          mockResult = {
            type: 'analysis',
            data: {
              averageRating: 4.2,
              totalReviews: 847,
              sentiment: { positive: 68, neutral: 22, negative: 10 },
              topComplaints: ['WiFi Speed', 'Room Cleanliness', 'Noise Levels'],
              topPraises: ['Location', 'Staff Service', 'Breakfast Quality']
            }
          };
          break;
        case 'comparison':
          mockResult = {
            type: 'comparison',
            data: {
              yourHotel: { name: demoInputs.hotelName, rating: 4.2, price: 189, occupancy: 78 },
              competitor: { name: demoInputs.competitorName || 'Royal Crown Hotel', rating: 4.1, price: 165, occupancy: 82 },
              metrics: [
                { name: 'Guest Rating', yours: 4.2, competitor: 4.1, better: true },
                { name: 'Average Price', yours: 189, competitor: 165, better: false },
                { name: 'Occupancy Rate', yours: 78, competitor: 82, better: false },
                { name: 'Review Count', yours: 847, competitor: 692, better: true },
                { name: 'Response Rate', yours: 94, competitor: 87, better: true }
              ]
            }
          };
          break;
        case 'ai-feedback':
          mockResult = {
            type: 'ai-feedback',
            data: {
              overallScore: 7.8,
              recommendations: [
                { priority: 'High', action: 'Upgrade WiFi infrastructure', impact: 'Will address 23% of complaints' },
                { priority: 'Medium', action: 'Enhance housekeeping protocols', impact: 'Improve cleanliness scores by 15%' },
                { priority: 'Low', action: 'Expand breakfast menu', impact: 'Leverage existing strength' }
              ],
              quickWins: ['Respond to all reviews within 24 hours', 'Train staff on noise management'],
              longTermGoals: ['Room renovation project', 'Technology infrastructure upgrade']
            }
          };
          break;
        default:
          mockResult = { type: 'analysis', data: {} };
      }

      setDemoResults(mockResult);
      setIsLoading(false);
    };

    const renderDemoResults = () => {
      if (!demoResults) return null;    
      switch (demoResults.type) {
        case 'analysis':
          const { averageRating, totalReviews, sentiment, topComplaints, topPraises } = demoResults.data;
          return (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Analysis Results for {demoInputs.hotelName}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{averageRating}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalReviews}</div>
                  <div className="text-sm text-gray-600">Total Reviews</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Top Complaints</h4>
                  <ul className="space-y-1">
                    {topComplaints.map((complaint, index) => (
                      <li key={index} className="text-sm text-gray-700">• {complaint}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Top Praises</h4>
                  <ul className="space-y-1">
                    {topPraises.map((praise, index) => (
                      <li key={index} className="text-sm text-gray-700">• {praise}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );    
        case 'comparison':
          const { yourHotel, competitor, metrics } = demoResults.data;
          return (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Comparison: {yourHotel.name} vs {competitor.name}</h3>
              <div className="space-y-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{metric.name}</span>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${metric.better ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.yours}
                      </span>
                      <span className="text-gray-400">vs</span>
                      <span className="font-bold text-gray-600">{metric.competitor}</span>
                      {metric.better ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-red-100"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );    
        case 'ai-feedback':
          const { overallScore, recommendations, quickWins, longTermGoals } = demoResults.data;
          return (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">AI Feedback for {demoInputs.hotelName}</h3>
              <div className="mb-4 text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{overallScore}/10</div>
                <div className="text-sm text-gray-600">Overall Performance Score</div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Priority Recommendations</h4>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-3 border-l-4 border-blue-500 bg-blue-50 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                        <span className="font-medium text-gray-800">{rec.action}</span>
                      </div>
                      <p className="text-sm text-gray-600">{rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );    
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">EHotel Management School</h1>
                  <p className="text-sm text-gray-600">Smart Hotel Management Platform</p>
                </div>
              </div>

              <button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>  
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Transform Your Hotel with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-Powered Insights</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Analyze guest reviews, track competition, and get personalized recommendations to boost your hotel's performance and guest satisfaction.
            </p>

          </div>    
          {/* Features Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Powerful Features for Modern Hotels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>    
          {/* Interactive Demo Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Try Our Platform</h2>
            <p className="text-center text-gray-600 mb-8">Experience the power of AI-driven hotel analytics with our interactive demos</p>
          
            {/* Demo Inputs */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                  <input
                    type="text"
                    value={demoInputs.hotelName}
                    onChange={(e) => setDemoInputs(prev => ({ ...prev, hotelName: e.target.value }))}
                    placeholder="Enter your hotel name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competitor (Optional)</label>
                  <input
                    type="text"
                    value={demoInputs.competitorName}
                    onChange={(e) => setDemoInputs(prev => ({ ...prev, competitorName: e.target.value }))}
                    placeholder="Enter competitor name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>    
              {/* Demo Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => handleDemo('analysis')}
                  disabled={!demoInputs.hotelName.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && activeDemo === 'analysis' ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <BarChart3 size={20} />
                  )}
                  Analyze Reviews
                </button>
              
                <button
                  onClick={() => handleDemo('comparison')}
                  disabled={!demoInputs.hotelName.trim() || isLoading}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && activeDemo === 'comparison' ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <TrendingUp size={20} />
                  )}
                  Compare Hotels
                </button>
              
                <button
                  onClick={() => handleDemo('ai-feedback')}
                  disabled={!demoInputs.hotelName.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && activeDemo === 'ai-feedback' ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <Brain size={20} />
                  )}
                  AI Feedback
                </button>
              </div>    
              {/* Demo Results */}
              {demoResults && renderDemoResults()}
            </div>
          </div>    
          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Hotel?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of hotels already using AI to improve their guest experience</p>
            <button
              onClick={openAuthModal}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
            >
              <Zap size={24} />
              Start Your Free Trial
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <AuthModal onClose={onClose} isModalOpen={isModalOpen}/>
      </div>
    );
    // return(
    //     <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
    //         <Button text='Get Started' interact={openAuthModal} />
    //         <AuthModal onClose={onClose} isModalOpen={isModalOpen}/>
    //     </div>
    // );
}