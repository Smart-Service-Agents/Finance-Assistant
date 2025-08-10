import PropTypes from 'prop-types';
import { useState } from 'react';
import { Star, ExternalLink, Calendar, Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const getSourceColor = (source) => {
    const colors = {
      'Google Reviews': 'bg-red-100 text-red-700 border-red-200',
      'Booking.com': 'bg-blue-100 text-blue-700 border-blue-200',
      'TripAdvisor': 'bg-green-100 text-green-700 border-green-200',
      'Expedia': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Hotels.com': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[source] || 'bg-gray-100 text-gray-700 border-gray-200';
};

const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
};




export default function ReviewCard({id, reviewerName, source, rating, review, createdAt}){
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisPosition, setAnalysisPosition] = useState({ x: 0, y: 0 });

  const generateAIAnalysis = (review, _rating) => {
    const content = review.toLowerCase();
    const rating = _rating;

    // Determine sentiment
    let sentiment;
    if (rating >= 4) sentiment = 'positive';
    else if (rating >= 3) sentiment = 'neutral';
    else sentiment = 'negative';

    // Extract key topics based on keywords
    const keyTopics = [];
    if (content.includes('staff') || content.includes('service')) keyTopics.push('Service Quality');
    if (content.includes('room') || content.includes('clean')) keyTopics.push('Room Conditions');
    if (content.includes('food') || content.includes('breakfast') || content.includes('restaurant')) keyTopics.push('Food & Dining');
    if (content.includes('location') || content.includes('convenient')) keyTopics.push('Location');
    if (content.includes('wifi') || content.includes('internet')) keyTopics.push('Technology');
    if (content.includes('pool') || content.includes('spa') || content.includes('gym')) keyTopics.push('Amenities');
    if (content.includes('noise') || content.includes('loud')) keyTopics.push('Noise Levels');
    if (content.includes('price') || content.includes('value')) keyTopics.push('Value for Money');

    // Generate actionable insights
    const actionableInsights = [];
    if (sentiment === 'negative') {
      if (content.includes('wifi') || content.includes('internet')) {
        actionableInsights.push('Upgrade internet infrastructure');
      }
      if (content.includes('clean') || content.includes('dirty')) {
        actionableInsights.push('Enhance housekeeping protocols');
      }
      if (content.includes('staff') || content.includes('service')) {
        actionableInsights.push('Provide additional staff training');
      }
      if (content.includes('noise') || content.includes('loud')) {
        actionableInsights.push('Implement noise reduction measures');
      }
    } else if (sentiment === 'positive') {
      if (content.includes('staff') || content.includes('service')) {
        actionableInsights.push('Maintain excellent service standards');
      }
      if (content.includes('location')) {
        actionableInsights.push('Leverage location in marketing');
      }
      if (content.includes('food') || content.includes('breakfast')) {
        actionableInsights.push('Highlight dining experience');
      }
    }

    // Determine urgency level
    let urgencyLevel;
    if (rating <= 2) urgencyLevel = 'high';
    else if (rating === 3) urgencyLevel = 'medium';
    else urgencyLevel = 'low';

    // Generate summary
    let summary;
    if (sentiment === 'positive') {
      summary = `Guest had an excellent experience. Key strengths: ${keyTopics.slice(0, 2).join(', ').toLowerCase()}. Use this feedback to maintain standards.`;
    } else if (sentiment === 'neutral') {
      summary = `Mixed experience with room for improvement. Focus areas: ${keyTopics.slice(0, 2).join(', ').toLowerCase()}. Address concerns to boost satisfaction.`;
    } else {
      summary = `Critical feedback requiring immediate attention. Priority issues: ${keyTopics.slice(0, 2).join(', ').toLowerCase()}. Take swift action to prevent reputation damage.`;
    }

    return {
      sentiment,
      keyTopics: keyTopics.slice(0, 4),
      actionableInsights: actionableInsights.slice(0, 3),
      urgencyLevel,
      summary
    };
  };

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnalysisPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setShowAnalysis(true);
  };

  const handleMouseLeave = () => {
    setShowAnalysis(false);
  };

  const aiAnalysis = generateAIAnalysis(review, rating);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'neutral': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertTriangle size={16} className="text-red-600" />;
      case 'medium': return <TrendingUp size={16} className="text-yellow-600" />;
      case 'low': return <CheckCircle size={16} className="text-green-600" />;
      default: return null;
    }
  };  

  return (
    <>
      <div 
        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-800 text-lg">{reviewerName}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceColor(source)}`}>
                {source}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
                <span className={`ml-2 font-semibold ${getRatingColor(rating)}`}>
                  {rating}.0
                </span>
              </div>
              
              {/* Date */}
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={14} />
                <span className="text-sm">{createdAt}</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Review Content */}
        <div className="text-gray-700 leading-relaxed">
          <p className="text-sm sm:text-base">{review}</p>
        </div>
        
      </div>

      {/* AI Analysis Popup */}
      {showAnalysis && (
        <div 
          className="fixed z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${analysisPosition.x}px`,
            top: `${analysisPosition.y}px`,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-800">AI Analysis</h3>
          </div>

          {/* Sentiment & Urgency */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(aiAnalysis.sentiment)}`}>
              {aiAnalysis.sentiment.charAt(0).toUpperCase() + aiAnalysis.sentiment.slice(1)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getUrgencyColor(aiAnalysis.urgencyLevel)}`}>
              {getUrgencyIcon(aiAnalysis.urgencyLevel)}
              {aiAnalysis.urgencyLevel.charAt(0).toUpperCase() + aiAnalysis.urgencyLevel.slice(1)} Priority
            </span>
          </div>

          {/* Summary */}
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
          </div>

          {/* Key Topics */}
          {aiAnalysis.keyTopics.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.keyTopics.map((topic, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Insights */}
          {aiAnalysis.actionableInsights.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Actionable Insights</h4>
              <ul className="space-y-1">
                {aiAnalysis.actionableInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
          </div>
        </div>
      )}
    </>
  );
  
  // return(
  //     <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
  //       {/* Header */}
  //       <div className="flex items-start justify-between mb-4">
  //         <div className="flex-1">
  //           <div className="flex items-center gap-3 mb-2">
  //             <h3 className="font-semibold text-gray-800 text-lg">{reviewerName}</h3>
  //             <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceColor(source)}`}>
  //               {source}
  //             </span>
  //           </div>
  //           <div className="flex items-center gap-4">
  //             {/* Star Rating */}
  //             <div className="flex items-center gap-1">
  //               {[1, 2, 3, 4, 5].map((star) => (
  //                 <Star
  //                   key={star}
  //                   size={16}
  //                   className={
  //                     star <= rating
  //                       ? 'fill-yellow-400 text-yellow-400'
  //                       : 'text-gray-300'
  //                   }
  //                 />
  //               ))}
  //               <span className={`ml-2 font-semibold ${getRatingColor(rating)}`}>
  //                 {rating}.0
  //               </span>
  //             </div>
            
  //             {/* Date */}
  //             <div className="flex items-center gap-1 text-gray-500">
  //               <Calendar size={14} />
  //               <span className="text-sm">{createdAt}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
      
  //       {/* Review Content */}
  //       <div className="text-gray-700 leading-relaxed">
  //         <p className="text-sm sm:text-base">{review}</p>
  //       </div>
      
  //       {/* Footer */}
  //       <div className="mt-4 pt-4 border-t border-gray-100">
  //         <div className="flex items-center justify-between text-xs text-gray-500">
  //           <span>Review ID: {id}</span>
  //           <span className="flex items-center gap-1">
  //             <span className="w-2 h-2 bg-green-400 rounded-full"></span>
  //             Verified Review
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  // );
}


ReviewCard.propTypes = {
    id: PropTypes.string,
    reviewerName: PropTypes.string,
    source: PropTypes.string,
    rating: PropTypes.number,
    review: PropTypes.string,
    createdAt: PropTypes.string
}