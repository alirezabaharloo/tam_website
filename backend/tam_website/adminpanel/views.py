from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from accounts.models import User
from permissions import IsSuperUser
from accounts.serializers import UserInfoSerializer
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFilter, PlayerFilter
from rest_framework.views import APIView
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets, mixins, permissions
from accounts.models.profiles import Profile
from blog.models.partial import Player
from blog.serializers import PlayerSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_access(request):
    """
    Check if the authenticated user has admin access
    """
    is_admin = request.user.is_superuser
    is_author = request.user.is_author
    is_seller = request.user.is_seller
    if is_admin or is_author or is_seller:
        return Response("Access granted.", status=status.HTTP_200_OK)
    return Response('Access denied.', status=status.HTTP_403_FORBIDDEN)
    

class UserPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50

@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_list_view(request):
    """
    View for listing users with pagination and filtering
    """
    queryset = User.objects.all().order_by('-created_date')
    
    # Apply filters
    filter_backend = DjangoFilterBackend()
    user_filter = UserFilter(request.GET, queryset=queryset)
    filtered_queryset = user_filter.qs
    
    # Apply pagination
    paginator = UserPagination()
    page = paginator.paginate_queryset(filtered_queryset, request)
    
    # Serialize results
    serializer = UserInfoSerializer(page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_detail_view(request, id):
    """
    View for retrieving a single user's details
    """
    try:
        user = User.objects.get(id=id)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_permissions_list_view(request):
    """
    View for listing user permission types
    """
    return Response(User.get_user_permissions_dict())

@api_view(['GET'])
@permission_classes([IsSuperUser])
def dashboard_stats_view(request):
    """
    Returns comprehensive dashboard data including:
    - Total users
    - Total articles (published and draft)
    - Total teams
    - Total site views
    - Daily view statistics for the last 7 days
    - Recent articles
    - Top viewed articles
    - Top liked articles
    """
    try:
        from blog.models import Article, Team, MiddleArticleIpAddress
        from django.utils import timezone
        from datetime import timedelta
        
        # Basic counts
        users_count = User.objects.count()
        articles_count = Article.objects.count()
        teams_count = Team.objects.count()
        
        # Calculate total views (unique IP addresses that viewed articles)
        total_views = MiddleArticleIpAddress.objects.values('ipaddress').distinct().count()
        
        # Calculate daily views for the last 7 days
        daily_views = []
        for i in range(7):
            date = timezone.now().date() - timedelta(days=i)
            day_views = MiddleArticleIpAddress.objects.filter(
                created_at__date=date
            ).values('ipaddress').distinct().count()
            daily_views.append({
                'date': date.strftime('%Y-%m-%d'),
                'views': day_views
            })
        
        # Reverse to show oldest to newest
        daily_views.reverse()
        
        # Article status distribution
        published_articles = Article.objects.filter(status='AC').count()
        draft_articles = Article.objects.filter(status='DR').count()
        
        # Get recent articles (last 5)
        recent_articles = []
        for article in Article.objects.all()[:5]:
            recent_articles.append({
                'id': article.id,
                'title': article.get_title('fa') or article.get_title('en'),
                'status': article.status,
                'updated_at': article.updated_date.togregorian().isoformat(),
                'author_name': article.author.phone_number if article.author else None
            })
        
        # Get top viewed articles (top 3 by view count)
        top_viewed_articles = []
        viewed_articles = Article.objects.annotate(
            view_count=Count('viewed_articles', distinct=True)
        ).filter(view_count__gt=0).order_by('-view_count')[:3]
        
        for article in viewed_articles:
            top_viewed_articles.append({
                'id': article.id,
                'title': article.get_title('fa') or article.get_title('en'),
                'views': article.view_count,
                'slug': article.slug
            })
        
        # Get top liked articles (top 3 by like count)
        top_liked_articles = []
        liked_articles = Article.objects.annotate(
            like_count=Count('likes', distinct=True)
        ).filter(like_count__gt=0).order_by('-like_count')[:3]
        
        for article in liked_articles:
            top_liked_articles.append({
                'id': article.id,
                'title': article.get_title('fa') or article.get_title('en'),
                'likes': article.like_count,
                'slug': article.slug
            })
        
        return Response({
            'users': users_count,
            'articles': articles_count,
            'teams': teams_count,
            'total_views': total_views,
            'daily_views': daily_views,
            'published_articles': published_articles,
            'draft_articles': draft_articles,
            'recent_articles': recent_articles,
            'top_viewed_articles': top_viewed_articles,
            'top_liked_articles': top_liked_articles
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlayerListView(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing or retrieving players.
    """
    queryset = Player.objects.all()
    serializer_class = BilingualPlayerSerializer
    filterset_class = PlayerFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [permissions.IsAdminUser]
    pagination_class = UserPagination
    
    def get_serializer_context(self):
        """
        Add request to serializer context to access query parameters
        """
        context = super().get_serializer_context()
        return context


class PlayerPositionsView(APIView):
    """
    View to return all player positions for filtering.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        """
        Return a list of positions with their English keys and Persian display values.
        """
        positions = {
            '': 'همه‌ی پست‌ها',  # Empty string for "All"
        }
        # Add all position choices
        for choice_key, choice_value in Player.Positions.choices:
            positions[choice_key] = choice_value
        
        return Response(positions)
