from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import google.generativeai as genai
import os


class AIChatbotViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def ask(self, request):
        """Simple chat endpoint with subscription check"""
        try:
            user = request.user
            message = request.data.get('message', '').strip()
            if not message:
                return Response(
                    {'error': 'Message is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not hasattr(user, 'subscription') or not user.subscription:
                return Response(
                    {'error': 'No subscription found'},
                    status=status.HTTP_403_FORBIDDEN
                )
            subscription = user.subscription
            if not subscription.is_active:
                return Response(
                    {'error': 'Subscription is not active'},
                    status=status.HTTP_403_FORBIDDEN
                )
            if subscription.usage_left <= 0:
                return Response(
                    {'error': 'No usage left. Please upgrade your subscription.'},
                    status=status.HTTP_403_FORBIDDEN
                )
            response_text = self._get_ai_response(message)
            subscription.usage_left -= 1
            subscription.save()
            
            return Response({
                'response': response_text,
                'usage_left': subscription.usage_left
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Chatbot error: {str(e)}")
            return Response(
                {'error': f'Server error: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_ai_response(self, user_message):
        """Get response from Gemini API"""
        try:
            api_key = os.getenv('GEMINI_API_KEY')
            if not api_key:
                return "API key not configured. Please set GEMINI_API_KEY in environment."
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = f"""You are an HVAC expert assistant. Help the user with HVAC-related questions.
Keep responses concise and practical.

User question: {user_message}"""
            
            response = model.generate_content(prompt)
            return response.text if response else "No response generated"
            
        except Exception as e:
            return f"AI Error: {str(e)}"
