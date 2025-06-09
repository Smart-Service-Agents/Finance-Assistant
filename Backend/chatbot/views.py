from rest_framework.response import Response
from rest_framework.decorators import api_view

from .bot import FinanceCoach
from .database import Database

import uuid

db = Database()

@api_view(['POST'])
def get_messages(request):
    """Handles chatbot message requests"""
    try:
        data = request.data
        
        coach = FinanceCoach()
        
        question = data.get("text", "").strip()

        if not question:
            return Response({"error": "No question provided"}, status=400)

        response = coach.answer_question(question)
        return Response({"text": response["answer"], "video": response["video"]})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def upload_user(request):
    """Signs in the user"""
    try:
        data = request.data
        user_id = data.get("uid")
        password = data.get("pass")
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
        user_id = data.get("uid")
        password = data.get("pass")
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
        user_id = data.get("uid")
        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()
        video = data.get("video", "").strip()
        chat = data.get("cid", "").strip()
        chat_uid = data.get("chat_uid", "").strip()
        master = data.get("key")

        if (chat_uid == 'null'):
            chat_uid = str(uuid.uuid4())
            print('Set chat uid:', chat_uid)
        else:
            print('Chat uid already set:', chat_uid)

        response = db.upload_messages(user_id, question, answer, video, chat, chat_uid, master)
        return Response(response)
    
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def retrieve_messages(request):
    """Retrieves messages from user"""
    try:
        data = request.data
        user_id = data.get("uid")
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
        user_id = data.get("uid")
        chat = data.get("chat")
        master = data.get("key")

        response = db.delete_messages(user_id, chat, master)

        return Response(response)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['POST'])
def update_chat_title(request):
    """Updates chat name"""
    try:
        data = request.data
        user_id = data.get('uid')
        chat_uid = data.get('c_uid')
        new_title = data.get('updated_title')
        master = data.get('key')

        response = db.update_chat_title(user_id, chat_uid, new_title, master)

        return Response(response)
    except Exception as e:
        return Response({'error': str(e)}, status=500)