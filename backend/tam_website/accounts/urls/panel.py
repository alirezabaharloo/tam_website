from django.urls import path
<<<<<<< HEAD
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
=======
from .. import views

urlpatterns = [
    # Admin routes
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('user/<int:pk>/', views.AdminUserManagementView.as_view(), name='admin-user-management'),
    
    # User routes
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
]