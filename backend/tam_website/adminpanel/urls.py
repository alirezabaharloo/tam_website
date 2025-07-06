from django.urls import path
from . import views
from .views import UserListView, UserPermissionsListView

urlpatterns = [
    # Admin routes
    path('users/', views.UserListView.as_view(), name='user-list'),  # List all users
    path('admin-pannel-access/', views.check_admin_access, name='user-list'),
    path('user-list/', UserListView.as_view(), name='user-list'),
    path('user-permissions-list/', UserPermissionsListView.as_view(), name='user-permissions-list'),
]