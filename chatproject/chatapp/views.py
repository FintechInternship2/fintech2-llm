from django.shortcuts import render
from rest_framework import viewsets
from .models import ChatSession
from .serializers import ChatSessionSerializer

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
