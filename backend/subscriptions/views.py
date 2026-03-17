from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import SubscriptionTier, UserSubscription
from .serializers import SubscriptionTierSerializer, UserSubscriptionSerializer


class SubscriptionTierListView(generics.ListAPIView):
    queryset = SubscriptionTier.objects.all()
    serializer_class = SubscriptionTierSerializer
    permission_classes = [permissions.AllowAny]


class UserSubscriptionListView(generics.ListAPIView):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def subscribe_to_tier(request):
    """Subscribe user to a tier after PayPal approval"""
    try:
        tier_id = request.data.get('tier_id')
        paypal_subscription_id = request.data.get('paypal_subscription_id')
        
        if not tier_id or not paypal_subscription_id:
            return Response(
                {'error': 'tier_id and paypal_subscription_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            tier = SubscriptionTier.objects.get(id=tier_id)
        except SubscriptionTier.DoesNotExist:
            return Response(
                {'error': 'Subscription tier not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        user_sub, created = UserSubscription.objects.get_or_create(
            user=request.user,
            defaults={'tier': tier, 'usage_left': tier.max_usage, 'is_active': True}
        )
        if not created:
            user_sub.tier = tier
            user_sub.usage_left = tier.max_usage
            user_sub.is_active = True
            user_sub.save()
        
        return Response(
            {'message': 'Subscription successful', 'subscription': UserSubscriptionSerializer(user_sub).data},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
