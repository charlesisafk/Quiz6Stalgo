from django.urls import path
from .views import ServiceListView, ServiceDetailView, SellerServiceManageView, SellerServiceDetailView

urlpatterns = [
    path('list/', ServiceListView.as_view(), name='service_list'),
    path('<int:pk>/', ServiceDetailView.as_view(), name='service_detail'),
    path('manage/', SellerServiceManageView.as_view(), name='seller_service_manage'),
    path('manage/<int:pk>/', SellerServiceDetailView.as_view(), name='seller_service_detail'),
]
