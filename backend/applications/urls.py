from django.urls import path
from .views import *

urlpatterns = [
    path('apply/', SubmitApplicationView.as_view(), name='submit_application'),
    path('list/', ListApplicationView.as_view(), name='list_applications'),
    path('<int:pk>/approve/', ApproveApplicationView.as_view(), name='approve_application'),
    path('<int:pk>/decline/', DeclineApplicationView.as_view(), name='decline_application'),
]
