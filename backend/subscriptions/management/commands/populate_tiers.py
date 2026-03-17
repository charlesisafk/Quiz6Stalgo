from django.core.management.base import BaseCommand
from subscriptions.models import SubscriptionTier


class Command(BaseCommand):
    help = 'Pre-populate subscription tiers'
    
    def handle(self, *args, **options):
        tiers = [
            {'name': 'Starter', 'price': 9.99, 'max_usage': 3},
            {'name': 'Professional', 'price': 19.99, 'max_usage': 5},
            {'name': 'Premium', 'price': 49.99, 'max_usage': 10},
        ]
        
        for tier_data in tiers:
            tier, created = SubscriptionTier.objects.get_or_create(
                name=tier_data['name'],
                defaults={'price': tier_data['price'], 'max_usage': tier_data['max_usage']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created tier: {tier.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Tier already exists: {tier.name}"))
