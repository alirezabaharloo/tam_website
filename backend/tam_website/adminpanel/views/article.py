from rest_framework.generics import *
from rest_framework.response import Response
from ..serializers.article import BilingualArticleSerializer, CreateArticleSerializer, ArticleUpdateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import ArticleFilter
from rest_framework.views import APIView
from rest_framework import viewsets
from blog.models.article import Team, Article
from .base import BasePagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.utils import timezone
from blog.tasks import publish_scheduled_article
from permissions import *
from django.utils.translation import get_language, gettext_lazy as _


class AdminArticleListView(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing or retrieving articles.
    """
    queryset = Article.objects.all()
    serializer_class = BilingualArticleSerializer
    filterset_class = ArticleFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthorAndSuperuser]
    pagination_class = BasePagination
    
    def get_serializer_context(self):
        """
        Add request to serializer context to access query parameters
        """
        context = super().get_serializer_context()
        return context


class CreateArticleView(CreateAPIView):
    """
    View for creating a new article
    """
    serializer_class = CreateArticleSerializer
    permission_classes = [IsAuthorAndSuperuser]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new article with bilingual support
        """
        # Add the author to the request data
        request.data._mutable = True
        request.data['author'] = request.user.id
        request.data._mutable = False
        
        # Create serializer with context to access request.FILES
        serializer = self.get_serializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            article = serializer.save()
            return Response(
                {
                    "message": "مقاله جدید با موفقیت ایجاد شد.",
                    "id": article.id
                },
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class ArticleDetailView(RetrieveAPIView):
    """
    View for retrieving article details for editing
    """
    queryset = Article.objects.all()
    serializer_class = BilingualArticleSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'article_id'


class UpdateArticleView(UpdateAPIView):
    """
    View for updating an existing article
    """
    queryset = Article.objects.all()
    serializer_class = ArticleUpdateSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'article_id'
    
    def get_serializer_context(self):
        """
        Add article instance to serializer context
        """
        context = super().get_serializer_context()
        context['article_instance'] = self.get_object()
        return context
    
    def update(self, request, *args, **kwargs):
        print(request.data)
        """
        Update the article with bilingual support
        """
        partial = kwargs.pop('partial', True)  # Always use partial updates
        instance = self.get_object()
        

        # Make sure instance is not None
        if not instance:
            return Response(
                {"error": "مقاله مورد نظر یافت نشد."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Add instance to context
        context = self.get_serializer_context()
        context['article_instance'] = instance
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial, context=context)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "مقاله با موفقیت بروزرسانی شد."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class ArticleFilterDataView(APIView):
    """
    View to return all article filter options.
    """

    # Define explicit mappings for translations
    ARTICLE_TYPE_TRANSLATIONS = {
        'en': {
            '': 'All Types',
            'TX': 'Text',
            'SS': 'Slide Show',
            'VD': 'Video',
        },
        'fa': {
            'TX': 'عادی',
            'SS': 'اسلایدشو',
            'VD': 'ویدیو',
            '': 'همه نوع‌ها',
        },
    }

    ARTICLE_STATUS_TRANSLATIONS = {
        'en': {
            '': 'All Statuses',
            'ST': 'Scheduled',
            'DR': 'Draft',
            'PB': 'Published',
        },
        'fa': {
            '': 'همه وضعیت‌ها',
            'ST': 'زمان بندی شده',
            'DR': 'پیش نویس',
            'PB': 'منتشر شده',
        },
    }

    def get(self, request, format=None):
        """
        Return filter options for type, status, and teams.
        """
        current_language = get_language()

        # Article Type options (sent as 'status' in response for frontend compatibility)
        article_type_options = {}
        translated_article_types = self.ARTICLE_TYPE_TRANSLATIONS.get(current_language, self.ARTICLE_TYPE_TRANSLATIONS['en'])
        for choice_key, choice_value in Article.Type.choices:
            article_type_options[choice_key] = translated_article_types.get(choice_key, self.ARTICLE_TYPE_TRANSLATIONS['en'].get(choice_key, choice_value))
        
        if '' not in article_type_options:
            article_type_options[''] = translated_article_types.get('', self.ARTICLE_TYPE_TRANSLATIONS['en'][''])

        # Article Status options (sent as 'type' in response for frontend compatibility)
        article_status_options = {}
        translated_article_statuses = self.ARTICLE_STATUS_TRANSLATIONS.get(current_language, self.ARTICLE_STATUS_TRANSLATIONS['en'])
        for choice_key, choice_value in Article.Status.choices:
            if request.query_params.get("filter_page", False) and choice_key == 'ST':
                article_status_options["ST"] = translated_article_statuses.get('ST', self.ARTICLE_STATUS_TRANSLATIONS['en']['ST'])
            else:
                article_status_options[choice_key] = translated_article_statuses.get(choice_key, self.ARTICLE_STATUS_TRANSLATIONS['en'].get(choice_key, choice_value))
        
        if '' not in article_status_options:
            article_status_options[''] = translated_article_statuses.get('', self.ARTICLE_STATUS_TRANSLATIONS['en'][''])
        
        # Team options
        teams_data = {}
        teams_data[''] = _('All Teams')  # Still using gettext_lazy for consistency with other parts for 'All Teams'
        
        # Get all teams and add to options
        teams = Team.objects.all()
        for team in teams:
            # Get translated team name based on current language
            team_name = team.safe_translation_getter('name', language_code=current_language, default=team.safe_translation_getter('name', any_language=True))
            
            teams_data[str(team.id)] = team_name
        
        return Response({
            'status': article_type_options, # Frontend expects 'status' key for article types
            'type': article_status_options, # Frontend expects 'type' key for article statuses
            'teams': teams_data
        })


@api_view(['DELETE'])
@permission_classes([IsAuthorAndSuperuser])
def delete_article(request, article_id):
    """
    Delete an article by ID.
    """
    try:
        article = Article.objects.get(id=article_id)
        article_title = article.get_title()
        article.delete()
        return Response(
            {"message": f"Article '{article_title}' deleted successfully"}, 
            status=status.HTTP_200_OK
        )
    except Article.DoesNotExist:
        return Response(
            {"error": "Article not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"DEBUG: Exception in schedule_article_publication: {e}") # New debug line
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
