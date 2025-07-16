from rest_framework.generics import *
from rest_framework.response import Response
from ..serializers.article import BilingualArticleSerializer
from permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import ArticleFilter
from rest_framework.views import APIView
from rest_framework import viewsets
from blog.models.article import Team, Article
from .base import BasePagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status


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
