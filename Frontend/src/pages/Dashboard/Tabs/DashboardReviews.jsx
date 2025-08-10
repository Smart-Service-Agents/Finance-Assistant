import { useEffect, useState } from "react";

import DashboardReviewsDisplayFetched from "../../../components/Dashboard/DashboardReviewsDisplay";
import { DashboardReviewsDisplayLoading } from "../../../components/Dashboard/DashboardReviewsDisplay";


const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export default function DashboardReviews({hotel, city, region}){
    const [reviewsFetched, setReviewsFetched] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [averageReviews, setAverageReviews] = useState(0);

    const getAverageReviews = (reviews) => {        
        let ratings = 0;

        for (let i = 0; i < reviews.length; i++){
            const rating = reviews[i]['rating']
            ratings += rating;
        }

        const averageRating = ratings / reviews.length;
        
        return averageRating;
    }

    useEffect(() => {
        (async() => {
            const rawData = localStorage.getItem('reviews_cache');
            const rawTs = localStorage.getItem('reviews_ts');

            if (rawData && rawTs) {
                if ((Date.now() - Number(rawTs)) < ONE_DAY_MS) {
                    setReviews(JSON.parse(rawData));
                    setReviewsFetched(true);

                    setAverageReviews(getAverageReviews(JSON.parse(rawData)));
                    return;
                }
            }

          try {
            const uri = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_API_REVIEWS_PATH

            const response = await fetch(uri, {
              method: 'POST',
              headers:  { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ hotel, city, region, master:'rey-master-eo' })
            });
            const data = await response.json();

            setReviews(data);
            setReviewsFetched(true);

            setAverageReviews(getAverageReviews(data));
            
            localStorage.setItem('reviews_cache', JSON.stringify(data));
            localStorage.setItem('reviews_ts', Date.now().toString());
          } catch (e) {
            console.error('Error fetching reviews', e);
          }
        })();

    }, [hotel, city, region]);

    return (
        reviewsFetched?
            <DashboardReviewsDisplayFetched averageReviews={averageReviews} reviews={reviews}/>
        :
            <DashboardReviewsDisplayLoading />
    );
}