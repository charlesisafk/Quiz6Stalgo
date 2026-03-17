from django.urls import path
from .views import MyTokenObtainPairView, RegisterView, UserProfileView, AdminUserListView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
]
