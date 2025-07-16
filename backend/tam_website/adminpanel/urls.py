from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views


router = routers.SimpleRouter()
router.register(r'players', views.PlayerListView, basename='player')
router.register(r'articles', views.AdminArticleListView, basename='article')

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
    path('player-create/', views.CreatePlayerView.as_view(), name='player-create'),
    path('player-detail/<int:player_id>/', views.PlayerDetailView.as_view(), name='player-detail'),
    path('player-update/<int:player_id>/', views.UpdatePlayerView.as_view(), name='player-update'),
    
    # Team management
    path('team-list/', views.TeamListView.as_view(), name='team-list'),
    path('team-delete/<int:team_id>/', views.delete_team, name='team-delete'),
    path('team-create/', views.CreateTeamView.as_view(), name='team-create'),
    path('team-detail/<int:team_id>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('team-update/<int:team_id>/', views.UpdateTeamView.as_view(), name='team-detail'),
    
    # Article management
    path('article-filter-data/', views.ArticleFilterDataView.as_view(), name='article-filter-data'),
    path('article-delete/<int:article_id>/', views.delete_article, name='article-delete'),
]

urlpatterns += router.urls