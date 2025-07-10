from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

router = routers.SimpleRouter()
router.register(r'players', views.PlayerListView, basename='player')

urlpatterns = [
    # Admin access
    path('admin-pannel-access/', views.check_admin_access, name='admin-access'),
    
    # Dashboard
    path('admin-dashboard-data/', views.dashboard_stats_view, name='dashboard-stats'),
    
    # User management
    path('user-list/', views.user_list_view, name='user-list'),
    path('user-detail/<int:id>/', views.user_detail_view, name='user-detail'),
    path('user-permissions-list/', views.user_permissions_list_view, name='user-permissions-list'),
    
    # Player management
    path('player-positions/', views.PlayerPositionsView.as_view(), name='player-positions'),
    path('player-delete/<int:player_id>/', views.delete_player, name='player-delete'),
]

urlpatterns += router.urls