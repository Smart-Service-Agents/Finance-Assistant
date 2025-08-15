from django.urls import path
from .views import get_messages, upload_user, login_user, upload_data, retrieve_messages, delete_chat

urlpatterns = [
    path('messages/', get_messages),
    path('sign-up/', upload_user),
    path('login/', login_user),
    path('upload_chat/', upload_data),
    path('load_chats/', retrieve_messages),
    path('delete_chat/', delete_chat),
    # path('update-chat/', update_chat_title),
]