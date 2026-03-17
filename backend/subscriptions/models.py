from django.db import models
from django.conf import settings


class SubscriptionTier(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    max_usage = models.IntegerField()
    paypal_plan_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.max_usage} usages"
    
    class Meta:
        ordering = ['max_usage']


class UserSubscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    tier = models.ForeignKey(SubscriptionTier, on_delete=models.SET_NULL, null=True)
    usage_left = models.IntegerField()
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.usage_left} usage left"
