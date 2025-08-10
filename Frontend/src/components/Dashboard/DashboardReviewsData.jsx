import { Star } from "lucide-react"


export default function DashboardReviewsData({averageReviews, reviews}){
    return(
        <div className="flex items-center gap-4">
            <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                    {averageReviews}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                            key={star}
                            size={16}
                            className={star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                </div>
              <div className="text-sm text-gray-600">{reviews.length} reviews</div>
            </div>
        </div>
    );
}