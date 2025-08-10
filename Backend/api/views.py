from rest_framework.decorators import api_view
from rest_framework.response import Response


import os, sys, datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'modules')))
from database import Database
from reviews import Reviews
from charts_analysis import Analysis
from chat import Chat
from ai_analysis import AI

@api_view(['POST'])
def authenticate(request):
    try:
        data = request.data
        
        hotel = data.get('hotel')
        email = data.get('email')
        password = data.get('password')
        city = data.get('city')
        country = data.get('country')
        method = data.get('method')
        key = data.get('master')

        region = country[:2]


        db = Database()
        if method == 'register':
            response = db.save_user(hotel, password, email, city, region, key)
            return Response(response, status=200)
        
        response = db.login_user(hotel, password, email, key)
        
        return Response(response, status=200)
    except Exception as e:
        return Response({'message':str(e)}, status=500)

@api_view(['POST'])
def fetch_reviews(request):
    try:
        data = request.data

        hotel = data.get('hotel')
        city = data.get('city')
        region = data.get('region')[:2]

        master = data.get('master')

        reviews = Reviews()

        db = Database()

        response = reviews.get_combined_reviews(hotel, city, region)
        
        for res in response:
            databaseresponse = db.upload_reviews(hotel, res, master)

        print(databaseresponse)

        return Response(response, status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)
    
@api_view(['POST'])
def fetch_competition(request):
    try:
        data = request.data

        hotel = data.get('hotel')
        master = data.get('master')

        db = Database()

        response = db.fetch_reviews(hotel, master)

        return Response(response, status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)

@api_view(['POST'])
def fetch_analysis(request):
    try:
        data = request.data

        meta_data = data.get('meta_data')
        reviews = meta_data['reviews']
        
        analysis = Analysis()
        response = analysis.format_analysis(reviews)

        ai = AI()
        ai_insights = ai.generate_insights(response)
        response.update(ai_insights)


        return Response(response, status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)

@api_view(['POST'])
def answer_question(request):
    try:
        data = request.data

        reviews = data.get('reviews')
        question = data.get('question')

        chat = Chat()
        response = chat.answer_question(reviews, question)

        return Response(response, status=200)
    except Exception as e:
        return Response({'message': str(e)}, status=500)