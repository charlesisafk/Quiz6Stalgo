from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import SellerApplication
from .serializers import SellerApplicationSerializer
from subscriptions.models import SubscriptionTier, UserSubscription


class SubmitApplicationView(generics.CreateAPIView):
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ListApplicationView(generics.ListAPIView):
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        return SellerApplication.objects.all()


class ApproveApplicationView(generics.UpdateAPIView):
    queryset = SellerApplication.objects.all()
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'pk'
    
    def update(self, request, *args, **kwargs):
        application = self.get_object()
        application.status = 'approved'
        application.save()
        user = application.user
        user.role = 'seller'
        user.save()
        tier = SubscriptionTier.objects.first()
        if tier:
            UserSubscription.objects.get_or_create(
                user=user,
                defaults={'tier': tier, 'usage_left': tier.max_usage}
            )
        
        return Response(
            SellerApplicationSerializer(application).data,
            status=status.HTTP_200_OK
        )


class DeclineApplicationView(generics.UpdateAPIView):
    queryset = SellerApplication.objects.all()
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'pk'
    
    def update(self, request, *args, **kwargs):
        application = self.get_object()
        application.status = 'declined'
        application.decline_reason = request.data.get('decline_reason', '')
        application.save()
        
        return Response(
            SellerApplicationSerializer(application).data,
            status=status.HTTP_200_OK
        )
