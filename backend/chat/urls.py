from django.urls import path
from .views import AIChatbotViewSet

urlpatterns = [
    path('ask/', AIChatbotViewSet.as_view({'post': 'ask'}), name='ai_chatbot'),
]
