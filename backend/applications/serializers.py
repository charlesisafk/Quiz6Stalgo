from rest_framework import serializers
from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = SellerApplication
        fields = ['id', 'user', 'user_email', 'user_username', 'status', 'decline_reason', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']
