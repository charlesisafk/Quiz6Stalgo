from django.db import models
from django.conf import settings
from services.models import Service


class Order(models.Model):
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='orders')
    paypal_transaction_id = models.CharField(max_length=200, unique=True)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    date_purchased = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.buyer.email}"
    
    class Meta:
        ordering = ['-date_purchased']
