from django.urls import path
from . import views

urlpatterns = [
    # Admin routes
    path('users/', views.UserListView.as_view(), name='user-list'),  # List all users
    path('user/<int:pk>/', views.AdminUserManagementView.as_view(), name='admin-user-management'),  # Admin management of specific user
    path('admin-pannel-access/', views.check_admin_access, name='user-list'),

    # User routes
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),  # User's own profile management
]