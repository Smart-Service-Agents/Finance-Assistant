import requests
import os
import json
from serpapi import GoogleSearch

config_path = os.path.join(os.path.dirname(__file__), "config.json")


with open(config_path, "r") as file:
    config = json.load(file)

RapidApiKey = config["RapidApiKey"]

GoogleMapsHost = config["GoogleMapsHost"]
PlaceIDEndPoint = config["GooglePlaceIDEndPoint"]
ReviewsEndPoint = config["GoogleReviewsEndPoint"]

TripAdvisorScraperHost = config["TripAdvisorScraperHost"]
TripAdvisorScraperURL = config["TripAdvisorScraperUrl"]
SerpKey = config["SerpKey"]

class Google:
    def __init__(self):
        self.headers = {
            "x-rapidapi-key": "{}".format(RapidApiKey),
            "x-rapidapi-host": "{}".format(GoogleMapsHost)
        }


        self.getPlaceIDendPoint = "{}".format(PlaceIDEndPoint)
        self.getReviewsEndPoint = "{}".format(ReviewsEndPoint)

    def findPlaceID(self, hotel_name, region):
        params = {"query": hotel_name, "region": region}
        response = requests.get(self.getPlaceIDendPoint, headers=self.headers, params=params).json()

        if "results" in response and response["results"]:
            return response["results"][0]["place_id"]
        return None

    def findReviews(self, place_id):
        params = {"place_id": place_id, "fields": "reviews"}
        response = requests.get(self.getReviewsEndPoint, headers=self.headers, params=params).json()

        if "result" in response and "reviews" in response["result"]:
            reviews = response["result"]["reviews"]
            formatted_reviews = [
                {
                    "author": review["author_name"],
                    "rating": review["rating"],
                    "text": review["text"],
                }
                for review in reviews
            ]
            return formatted_reviews
        return None
    

class TripAdvisor:
    def __init__(self):
        self.headers = {
            "x-rapidapi-key": "{}".format(RapidApiKey),
            "x-rapidapi-host": "{}".format(TripAdvisorScraperHost)
        }
        self.serpKey = "{}".format(SerpKey)

    def getTripAdvisorHotelUrl(self, hotelName, city):
        query = f"site:tripadvisor.com {hotelName} {city} reviews"
        params = {
            "q": query,
            "api_key": self.serpKey
        }
        try:
            search = GoogleSearch(params)
            results = search.get_dict()
            for result in results.get("organic_results", []):
                url = result.get("link")
                if "tripadvisor.com" in url:
                    return url
        except Exception as e:
            print(f"Error while fetching Tripadvisor URL: {e}")
        return None

    def findReviews(self, hotelName, city):
        scraperURL = "{}".format(TripAdvisorScraperURL)
    
        hotelURL = self.getTripAdvisorHotelUrl(hotelName, city)
        if not hotelURL:
            print("Error: Could not find Tripadvisor URL for the given hotel.")
            return None

        querystring = {"hotel": hotelURL}
        try:
            response = requests.get(scraperURL, headers=self.headers, params=querystring)
            response.raise_for_status()
            data = response.json()
        
            if "data" in data:
                reviews = data["data"]
                formatted_reviews = [
                    {
                        "author": review.get("user", {}).get("name", "Unknown"),
                        "rating": review.get("rating", "N/A"),
                        "text": review.get("text", ""),
                        "creationDate": review.get("creationDate", ""),
                        "title": review.get("title", ""),
                        "helpfulVotes": review.get("helpfulVotes", 0)
                    }
                    for review in reviews
                ]
                return formatted_reviews
            else:
                print("No reviews data found in the API response.")
                return data
        
        except requests.exceptions.RequestException as e:
            print(f"Error fetching reviews: {e}")
            return None
        
class Reviews:
    def __init__(self):
        self.google = Google()
        self.tripadvisor = TripAdvisor()
    
    def get_combined_reviews(self, hotel_name, city, region):
        combined_reviews = []
        
        # Get Google reviews
        google_place_id = self.google.findPlaceID(hotel_name, region)
        if google_place_id:
            print("found goodle place id")
            google_reviews = self.google.findReviews(google_place_id)
            if google_reviews:
                print("found google reviews")
                for review in google_reviews:
                    combined_reviews.append({
                        "platform": "Google",
                        "author": review["author"],
                        "rating": review["rating"],
                        "text": review["text"],
                        "creationDate": "NULL",
                        "title": review["text"][:10],
                        "helpfulVotes": 0
                    })
        
        # Get TripAdvisor reviews
        tripadvisor_reviews = self.tripadvisor.findReviews(hotel_name, city)
        if tripadvisor_reviews:
            print("found tripadvisor reviews")
            for review in tripadvisor_reviews:
                combined_reviews.append({
                    "platform": "TripAdvisor",
                    "author": review["author"],
                    "rating": review["rating"],
                    "text": review["text"],
                    "creationDate": review["creationDate"],
                    "title": review["title"],
                    "helpfulVotes": review["helpfulVotes"]
                })
        
        return combined_reviews