# backend/app/urls.py

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', include('myapp.urls')),  # 여기서 myapp의 urls를 포함시킵니다.
]
