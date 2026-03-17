from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser
from subscriptions.models import SubscriptionTier, UserSubscription


@receiver(post_save, sender=CustomUser)
def create_default_subscription(sender, instance, created, **kwargs):
    if created:
        try:
            starter_tier = SubscriptionTier.objects.get(name='Starter')
            UserSubscription.objects.get_or_create(
                user=instance,
                defaults={
                    'tier': starter_tier,
                    'usage_left': starter_tier.max_usage,
                    'is_active': True,
                }
            )
        except SubscriptionTier.DoesNotExist:
            pass
