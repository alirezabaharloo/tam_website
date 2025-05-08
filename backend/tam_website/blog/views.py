from rest_framework.generics import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.translation import get_language, activate as set_language
from blog.serializers import ArticleSerializer, ArticleDetailSerializer
from permissions import IsAuthor
from blog.models import Article
from accounts.mixins import LocalizationMixin
from django.db.models import Count, Q
from django.utils import timezone
from django.conf import settings
from blog.redis import RedisService



class ArticleListView(ListAPIView):
    """
    View for listing all published articles.
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.accepted()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['list'] = True
        return context


class ArticleDetailView(RetrieveAPIView):
    """
    View for retrieving a single published article by slug.
    Supports language selection via query parameter 'lang' (defaults to 'fa').
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(status=Article.Status.ACCEPT)
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        article = self.get_object()
        redis_service = RedisService(request)
        redis_service.add_article_view(article.id)
        
        serializer = self.get_serializer(article) # Ensure it's in the response
        return Response(serializer.data)


class CreateArticleView(LocalizationMixin, CreateAPIView):
    """
    View for creating new articles. Only authenticated authors can create articles.
    """
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAuthor]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user) 


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
        return Article.objects.filter(author=self.request.user)

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
        return Article.objects.filter(author=self.request.user)
    

    def retrieve(self, request, *args, **kwargs):
        """
        override retrieve method with no changes for preventing view count increment in preview 
        """
        article:Article = self.get_object()
        serializer = self.get_serializer(article)
        return Response(serializer.data)


class MostViewedForLastMonthArticlesView(LocalizationMixin, ListAPIView):
    """
    View for listing the most viewed articles for the last month.
    """
    pass