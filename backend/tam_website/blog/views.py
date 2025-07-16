from rest_framework.generics import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.translation import get_language, activate as set_language
from blog.serializers import ArticleSerializer, ArticleDetailSerializer
from permissions import IsAuthor
from blog.models import Article
from accounts.mixins import LocalizationMixin, IpAddressMixin
from .models import IpAddress
from django_filters import rest_framework as filters
from django.db.models import Count, Q, Case, When, Value, F
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from rest_framework.pagination import PageNumberPagination
from .models import Team, Player
from .serializers import TeamSerializer, PlayerSerializer
from accounts.models import Profile


class ArticlePagination(PageNumberPagination):
    page_size = 12
    page_query_param = 'page'

    def get_paginated_response(self, data):
        next_url = None
        if self.page.has_next():
            next_url = self.request.build_absolute_uri(
                self.get_next_link()
            )
        return Response({
            'articles': data,
            'next': next_url,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number
        })


class ArticleFilter(filters.FilterSet):
    type = filters.ChoiceFilter(choices=Article.Type.choices)
    status = filters.ChoiceFilter(choices=Article.Status.choices)
    category = filters.CharFilter(method='filter_category')
    most_viewed = filters.BooleanFilter(method='filter_most_viewed')
    most_popular = filters.BooleanFilter(method='filter_most_popular')
    search = filters.CharFilter(method='filter_search')
    team = filters.CharFilter(method='filter_team')

    class Meta:
        model = Article
        fields = ['type', 'status', 'category', 'most_viewed', 'most_popular', 'search', 'team']

    def filter_category(self, queryset, name, value):
        if value:
            return queryset.filter(category__slug=value)
        return queryset

    def filter_team(self, queryset, name, value):
        if value:
            return queryset.filter(team__slug=value)
        return queryset

    def filter_most_viewed(self, queryset, name, value):
        if value:
            return queryset.annotate(
                view_count=Count('hits')
            ).order_by('-view_count')
        return queryset

    def filter_most_popular(self, queryset, name, value):
        if value:
            return queryset.annotate(
                like_count=Count('likes')
            ).order_by('-like_count')
        return queryset

    def filter_search(self, queryset, name, value):
        if value:
            try:
                # Get the current language from the request
                language = self.request.META.get('HTTP_ACCEPT_LANGUAGE', 'fa')
                
                # Use 'simple' configuration as a fallback if language-specific config doesn't exist
                config = 'simple'
                
                # Create search vectors for title and body
                title_vector = SearchVector('translations__title', weight='A', config=config)
                body_vector = SearchVector('translations__body', weight='B', config=config)
                
                # Combine vectors
                search_vector = title_vector + body_vector
                
                # Create search query with proper escaping
                search_query = SearchQuery(value, config=config)
                
                # Perform the search with ranking
                return queryset.filter(
                    translations__language_code=language
                ).annotate(
                    rank=SearchRank(search_vector, search_query)
                ).filter(
                    rank__gt=0.3
                ).order_by(
                    '-rank',  # Sort by search rank first
                    '-created_date'  # Then by creation date
                ).distinct()
            except Exception as e:
                # If search fails, fall back to simple contains search
                return queryset.filter(
                    Q(translations__title__icontains=value) |
                    Q(translations__body__icontains=value)
                ).distinct()
            
        return queryset


class ArticleListView(ListAPIView):
    """
    View for listing all published articles.
    Supports filtering by type, status, most viewed and most popular.
    Supports pagination with page parameter.
    Supports search by title and body in the current language.
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.accepted()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ArticleFilter
    pagination_class = ArticlePagination

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optimize category prefetching for list view
        return queryset.prefetch_related(
            'team',
            'team__translations',
            'article_images',
            'hits',
            'likes'
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['list'] = True
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        if not queryset.exists():
            return Response({
                'detail': 'no articles found!',
                'articles': [],
                'next': None,
                'total_pages': 0,
                'current_page': 1
            }, status=status.HTTP_200_OK)
        
        # Check if fetch-all parameter is present
        fetch_all = request.query_params.get('fetch-all', 'false').lower() == 'true'
        if fetch_all:
            # Get the requested page number
            page_number = int(request.query_params.get('page', 1))
            # Calculate the number of items to return (page_size * page_number)
            items_to_return = self.pagination_class.page_size * page_number
            # Get articles up to the requested page
            articles = queryset[:items_to_return]
            serializer = self.get_serializer(articles, many=True)
            
            # Calculate next URL if there are more pages
            next_url = None
            if queryset.count() > items_to_return:
                next_page = page_number + 1
                next_url = request.build_absolute_uri(f"{request.path}?page={next_page}")
            
            return Response({
                'articles': serializer.data,
                'next': next_url,
                'total_pages': page_number,
                'current_page': page_number
            })
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ArticleDetailView(IpAddressMixin, RetrieveAPIView):
    """
    View for retrieving a single published article by slug.
    Supports language selection via query parameter 'lang' (defaults to 'fa').
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(status=Article.Status.DRAFT)
    lookup_field = 'slug'


    def retrieve(self, request, *args, **kwargs):
        article = self.get_object()
        ip = self.get_client_ip(request)
        if not article.hits.filter(ip=ip).exists():
            ipaddress_obj = IpAddress.objects.get_or_create(
                ip=ip
            )
            article.hits.add(ipaddress_obj[0])
            article.save()
    
        serializer = self.get_serializer(article, context={ "client_ip": ip })
        return Response(serializer.data)


class CreateArticleView(LocalizationMixin, CreateAPIView):
    """
    View for creating new articles. Only authenticated authors can create articles.
    """
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAuthor]

    def perform_create(self, serializer):
        # Get or create profile for the user
        profile = Profile.objects.get_or_create(user=self.request.user)
        serializer.save(author=profile)


class UpdateArticleView(LocalizationMixin, GenericAPIView):
    """
    View for updating an existing article. Only the author can update their own articles.
    """
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAuthor]
    queryset = Article.objects.all()
    lookup_field = 'slug'


    def patch(self, request, slug):
        srz_data = self.serializer_class(self.get_object(), data=request.data, partial=True)
        if srz_data.is_valid():
            return Response(srz_data.data, status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)



class DeleteArticleView(LocalizationMixin, APIView):
    """
    View for deleting an existing article. Only the author can delete their own articles.
    """
    permission_classes = [IsAuthor]

    def delete(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        self.check_object_permissions(request, article)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArticleListForAuthorsView(ArticleListView):
    """
    View for listing all articles for authors, including drafts and rejected articles.
    Only shows articles belonging to the requesting author.
    """
    permission_classes = [IsAuthor]
    
    def get_queryset(self):
        # Get the user's profile
        profile = Profile.objects.get_or_create(user=self.request.user)
        return Article.objects.filter(author=profile)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['preview_article'] = True
        return context


class ArticleDetailForAuthorsView(ArticleDetailView):
    """
    View for authors to retrieve any of their articles regardless of status.
    Only allows access to articles belonging to the requesting author.
    """
    permission_classes = [IsAuthor]

    def get_queryset(self):
        # Get the user's profile
        profile = Profile.objects.get_or_create(user=self.request.user)
        return Article.objects.filter(author=profile)
    

    def retrieve(self, request, *args, **kwargs):
        """
        override retrieve method with no changes for preventing view count increment in preview 
        """
        article:Article = self.get_object()
        serializer = self.get_serializer(article)
        return Response(serializer.data)


class ArticleLikeView(IpAddressMixin, APIView):
    """
    View for liking an article.
    """
    def get(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        ip_obj = IpAddress.objects.get(ip=self.get_client_ip(request))
        if not article.likes.filter(ip=ip_obj.ip).exists():
            article.likes.add(ip_obj)
            article.save()
        else:
            article.likes.remove(ip_obj)
            article.save()
        return Response(status=status.HTTP_200_OK)


class HomeDataView(LocalizationMixin, APIView):
    def get(self, request):
        try:
            # Get latest 5 articles
            articles = Article.objects.filter(Q(status='AC') & Q(type="TX")).order_by('-created_date')[:5]
            articles_data = ArticleSerializer(articles, many=True, context={'request': request, "list": True}).data

            # Get latest videos
            videos = Article.objects.filter(status='AC', type='VD').order_by('-created_date')[:5]
            videos_data = ArticleSerializer(videos, many=True, context={'request': request, "list": True}).data

            # Get all teams
            teams = Team.objects.all()
            teams_data = TeamSerializer(teams, many=True, context={'request': request}).data

            # Get all players
            players = Player.objects.all()
            players_data = PlayerSerializer(players, many=True, context={'request': request}).data

            return Response({
                'articles': articles_data,
                'videos': videos_data,
                'tam_teams': teams_data,
                'players': players_data
            })
        except Exception as e:
            print(e)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


