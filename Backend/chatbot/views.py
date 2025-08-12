from rest_framework.response import Response
from rest_framework.decorators import api_view

from .bot import FinanceCoach
from .database import Database

coach = FinanceCoach()
db = Database()

@api_view(['POST'])
def get_messages(request):
    """Handles chatbot message requests"""
    try:
        data = request.data
        question = data.get("text", "").strip()

        if not question:
            return Response({"text": 'Please provide a question first.', "video": ''}, status=400)

        response = coach.answer_question(question)
        return Response({"text": response["answer"], "video": response["video"]})

    except Exception as e:
        return Response({"text": 'There are some issues with the backend response.', "video": '', "error":str(e)}, status=500)

@api_view(['POST'])
def upload_user(request):
    """Signs in the user"""
    try:
        data = request.data
        user_id = data.get("username")
        password = data.get("password")
        email = data.get("email")
        master = data.get("key")

        response = db.save_user(user_id, password, master)
        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def login_user(request):
    """Logs in the user"""
    try:
        data = request.data
        user_id = data.get("username")
        password = data.get("password")
        master = data.get("key")

        response = db.login_user(user_id, password, master)
        
        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def upload_data(request):
    """Uploads question answer pairs to the database"""
    try:
        data = request.data
        user_id = data.get("user")
        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()
        video = data.get("video", "").strip()
        chat = data.get("chat_id", "").strip()
        chat_uid = data.get("chat_uid", "").strip()
        master = data.get("key")

        response = db.upload_messages(user_id, question, answer, video, chat, chat_uid, master)
        return Response(response)
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def retrieve_messages(request):
    """Retrieves messages from user"""
    try:
        data = request.data
        user_id = data.get("user")
        master = data.get("key")

        response = db.get_messages(user_id, master)

        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def delete_chat(request):
    """Deletes a chat in the datbase"""
    try:
        data = request.data
        user_id = data.get("user")
        chat = data.get("chat")
        master = data.get("key")

        response = db.delete_messages(user_id, chat, master)

        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=500)