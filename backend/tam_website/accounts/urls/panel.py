from django.urls import path
from ..views.pannel import (
    UserListView,
    AdminUserManagementView,
    UserProfileView
)

urlpatterns = [
    # Admin routes
    path('users/', UserListView.as_view(), name='user-list'),  # List all users
    path('user/<int:pk>/', AdminUserManagementView.as_view(), name='admin-user-management'),  # Admin management of specific user
    
    # User routes
    path('profile/', UserProfileView.as_view(), name='user-profile'),  # User's own profile management
]