# backend/myapp/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from .serializers import MessageSerializer

class ChatbotAPIView(APIView):
    def post(self, request, *args, **kwargs):
        messages = request.data.get('messages', [])

        # 여기서 챗봇 로직을 추가하거나 메시지를 처리합니다.
        response_message = "챗봇 응답 예시입니다."  # 챗봇의 응답을 여기에 작성합니다.

        # 저장된 메시지를 저장하는 경우 (선택사항)
        for msg in messages:
            Message.objects.create(user=request.user if request.user.is_authenticated else None, content=msg)

        return Response({'response': response_message}, status=status.HTTP_200_OK)
