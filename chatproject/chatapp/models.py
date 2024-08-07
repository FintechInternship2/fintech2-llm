from django.db import models

# Create your models here.

class ChatSession(models.Model):
    user_id = models.CharField(max_length=255)
    chat_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
