from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("chat_room/<str:user_name>/<str:translated_text>/", views.chat_room, name="chat_room"),
]
