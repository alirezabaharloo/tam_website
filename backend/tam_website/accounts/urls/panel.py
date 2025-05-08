from django.urls import path
from .. import views

urlpatterns = [
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('profile/', views.ProfileView.as_view(), name='profile-detail'),
    path('user/<int:pk>', views.AdminManagementProfileView.as_view(), name='user-detail'),
    path('update_profile/<int:pk>', views.ProfileView.as_view(), name='update-profile'),
]

