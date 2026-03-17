from django.urls import path
from .views import SubscriptionTierListView, UserSubscriptionListView, subscribe_to_tier

urlpatterns = [
    path('tiers/', SubscriptionTierListView.as_view(), name='subscription_tiers'),
    path('list/', UserSubscriptionListView.as_view(), name='subscription_list'),
    path('subscribe/', subscribe_to_tier, name='subscribe_to_tier'),
]
