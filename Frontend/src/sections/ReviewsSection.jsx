import { Star, ThumbsUp, ThumbsDown, Minus } from 'lucide-react';


export default function ReviewSection({ reviews, title, icon, bgColor, borderColor }) {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp size={16} className="text-green-600" />;
      case 'negative':
        return <ThumbsDown size={16} className="text-red-600" />;
      case 'neutral':
        return <Minus size={16} className="text-gray-600" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-800">{review.reviewerName}</h4>
                  {getSentimentIcon(review.sentiment)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{review.source}</span>
                  <span>•</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
                <span className="ml-1 font-semibold text-gray-700">{review.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}