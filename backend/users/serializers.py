from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    subscription = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'phone_number', 'first_name', 'last_name', 'location', 'gender', 'role', 'merchant_id', 'subscription']
    
    def get_subscription(self, obj):
        from subscriptions.serializers import UserSubscriptionSerializer
        try:
            subscription = obj.subscription
            return UserSubscriptionSerializer(subscription).data
        except:
            return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'password2', 'phone_number', 'first_name', 'last_name', 'location', 'gender']
    
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords must match'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({'email': 'Invalid email or password'})
        
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Invalid email or password'})
        
        refresh = self.get_token(user)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        return data
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token
