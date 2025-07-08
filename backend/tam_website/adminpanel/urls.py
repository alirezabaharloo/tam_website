from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from .views import (
    user_list_view, user_detail_view, user_permissions_list_view,
    dashboard_stats_view, check_admin_access,
    PlayerListView, PlayerPositionsView
)

router = routers.SimpleRouter()
router.register(r'players', PlayerListView, basename='player')

urlpatterns = [
    # Admin access
    path('admin-pannel-access/', check_admin_access, name='admin-access'),
    
    # Dashboard
    path('admin-dashboard-data/', dashboard_stats_view, name='dashboard-stats'),
    
    # User management
    path('user-list/', user_list_view, name='user-list'),
    path('user-detail/<int:id>/', user_detail_view, name='user-detail'),
    path('user-permissions-list/', user_permissions_list_view, name='user-permissions-list'),
    
    # Player management
    path('player-positions/', PlayerPositionsView.as_view(), name='player-positions'),
]

urlpatterns += router.urls