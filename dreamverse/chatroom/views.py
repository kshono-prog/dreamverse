from django.shortcuts import render, redirect
from googletrans import Translator
from .models import Language

def index(request):
    languages = Language.objects.all()
    if request.method == "POST":
        user_name = request.POST["user_name"]
        selected_language = request.POST["language"]
        translator = Translator()
        translated_text = translator.translate(user_name, dest=selected_language)
        return redirect("chat_room", user_name=user_name, translated_text=translated_text.text)
    return render(request, "chat/index.html", {"languages": languages})

def chat_room(request, user_name, translated_text):
    return render(request, "chat/chat_room.html", {"user_name": user_name, "translated_text": translated_text})

