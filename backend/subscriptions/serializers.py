from rest_framework import serializers
from .models import SubscriptionTier, UserSubscription


class SubscriptionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionTier
        fields = ['id', 'name', 'price', 'max_usage', 'paypal_plan_id']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    tier = SubscriptionTierSerializer(read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = ['id', 'user', 'user_email', 'tier', 'usage_left', 'is_active', 'subscribed_at']
