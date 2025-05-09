from django.urls import path
from .. import views

urlpatterns = [
    # Admin routes
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('user/<int:pk>/', views.AdminUserManagementView.as_view(), name='admin-user-management'),
    
    # User routes
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
]