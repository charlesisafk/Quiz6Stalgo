from django.contrib import admin
from .models import SubscriptionTier, UserSubscription

admin.site.register(SubscriptionTier)
admin.site.register(UserSubscription)
