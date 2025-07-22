from rest_framework.generics import *
from rest_framework.response import Response
from ..serializers.article import BilingualArticleSerializer, CreateArticleSerializer
from permissions import *
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


class AdminArticleListView(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing or retrieving articles.
    """
    queryset = Article.objects.all()
    serializer_class = BilingualArticleSerializer
    filterset_class = ArticleFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsSuperUser, IsAuthor]
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
    permission_classes = [IsSuperUser, IsAuthor]
    
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
                {"message": "مقاله جدید با موفقیت ایجاد شد."},
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
    permission_classes = [IsSuperUser, IsAuthor]
    lookup_url_kwarg = 'article_id'


class ArticleFilterDataView(APIView):
    """
    View to return all article filter options.
    """
    permission_classes = [IsSuperUser, IsAuthor]

    def get(self, request, format=None):
        """
        Return filter options for status, type, and teams.
        """
        # Status options
        status_options = {
            '': 'همه وضعیت‌ها',  # Empty string for "All"
        }
        for choice_key, choice_value in Article.Status.choices:
            if choice_key == 'DR':
                status_options[choice_key] = 'پیش نویس'
            elif choice_key == 'PB':
                status_options[choice_key] = 'منتشر شده'
            else:
                status_options[choice_key] = choice_value
        
        # Type options
        type_options = {
            '': 'همه نوع‌ها',  # Empty string for "All"
        }
        for choice_key, choice_value in Article.Type.choices:
            if choice_key == 'TX':
                type_options[choice_key] = 'عادی'
            elif choice_key == 'SS':
                type_options[choice_key] = 'اسلایدشو'
            elif choice_key == 'VD':
                type_options[choice_key] = 'ویدیو'
            else:
                type_options[choice_key] = choice_value
        
        # Team options
        teams_data = {}
        teams_data[''] = 'همه تیم‌ها'  # Empty string for "All"
        
        # Get all teams and add to options
        teams = Team.objects.all()
        for team in teams:
            # Get Persian name for display
            if team.has_translation('fa'):
                team_name = team.safe_translation_getter('name', language_code='fa', default="")
            else:
                team_name = team.safe_translation_getter('name', any_language=True)
            
            teams_data[str(team.id)] = team_name
        
        return Response({
            'status': status_options,
            'type': type_options,
            'teams': teams_data
        })


@api_view(['DELETE'])
@permission_classes([IsSuperUser, IsAuthor])
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
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsSuperUser, IsAuthor])
def schedule_article_publication(request, article_id):
    """
    Schedule an article for publication at a specific date and time.
    """
    try:
        # Get the article
        article = Article.objects.get(id=article_id)
        
        # Get the scheduled time from the request
        scheduled_time = request.data.get('scheduled_publish_at')
        if not scheduled_time:
            return Response(
                {"error": "زمان انتشار مشخص نشده است."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert to datetime object if it's a string
        if isinstance(scheduled_time, str):
            try:
                scheduled_time = timezone.datetime.fromisoformat(scheduled_time.replace('Z', '+00:00'))
                scheduled_time = timezone.make_aware(scheduled_time)
            except ValueError:
                return Response(
                    {"error": "فرمت زمان نامعتبر است."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Ensure the scheduled time is in the future
        if scheduled_time <= timezone.now():
            return Response(
                {"error": "زمان انتشار باید در آینده باشد."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the article's scheduled_publish_at field
        article.scheduled_publish_at = scheduled_time
        
        # Only schedule if the article is in draft status
        if article.status == Article.Status.DRAFT:
            # Schedule the task using apply_async with eta parameter
            publish_scheduled_article.apply_async(
                args=[article.id],
                eta=scheduled_time
            )
            
            article.save()
            
            return Response(
                {"message": f"انتشار مقاله '{article.get_title()}' برای تاریخ {scheduled_time} زمان‌بندی شد."}, 
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "فقط مقالات پیش‌نویس می‌توانند زمان‌بندی شوند."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
    except Article.DoesNotExist:
        return Response(
            {"error": "مقاله مورد نظر یافت نشد."}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
