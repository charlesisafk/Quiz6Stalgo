from django.urls import path
from .views import CreateOrderView, UserOrderHistoryView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='create_order'),
    path('history/', UserOrderHistoryView.as_view(), name='user_order_history'),
]
