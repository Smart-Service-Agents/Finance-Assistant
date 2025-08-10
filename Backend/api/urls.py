from django.urls import path
from .views import authenticate, fetch_reviews, fetch_analysis, answer_question, fetch_competition

urlpatterns = [
    path("authenticate", authenticate, name="authenticate"),
    path("fetch-reviews", fetch_reviews, name="fetch-reviews"),
    path("fetch-analysis", fetch_analysis, name="fetch-analysis"),
    path("assistant", answer_question, name="assistant"),
    path("fetch-competition", fetch_competition, name="competition"),
]