import DashboardReviewsData from "./DashboardReviewsData";
import ReviewCard from "../Generic/Cards/ReviewCard";
import { Star } from "lucide-react";

export default function DashboardReviewsDisplayFetched({averageReviews, reviews}){
    return(
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                    <DashboardReviewsData averageReviews={averageReviews} reviews={reviews} />
                </div>

                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <ReviewCard id={review.id} reviewerName={review['author']} source={review['platform']} rating={review['rating']} review={review['text']} createdAt={review['creationDate']}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function DashboardReviewsDisplayLoading(){
    return(
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center">
                    <Star size={48} className="mx-auto text-green-600 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Reviews</h2>
                    <p className="text-gray-600">
                        Detailed insights into your hotel's performance metrics and trends.
                    </p>
                    <div className="mt-8 text-sm text-gray-500">
                        <h5>
                            Fetching Reviews...
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
}