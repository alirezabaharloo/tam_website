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
from django.db.models import Count


class ArticleFilter(filters.FilterSet):
    type = filters.ChoiceFilter(choices=Article.Type.choices)
    status = filters.ChoiceFilter(choices=Article.Status.choices)
    most_viewed = filters.BooleanFilter(method='filter_most_viewed')
    most_popular = filters.BooleanFilter(method='filter_most_popular')

    class Meta:
        model = Article
        fields = ['type', 'status', 'most_viewed', 'most_popular']

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


class ArticleListView(ListAPIView):
    """
    View for listing all published articles.
    Supports filtering by type, status, most viewed and most popular.
    Supports pagination with offset and limit parameters.
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.accepted()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ArticleFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        offset = int(self.request.query_params.get('offset', 0))
        limit = int(self.request.query_params.get('limit', 20))
        return queryset[offset:offset + limit]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['list'] = True
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_count = Article.objects.accepted().count()
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'articles': serializer.data,
            'total_count': total_count
        })


class ArticleDetailView(IpAddressMixin, RetrieveAPIView):
    """
    View for retrieving a single published article by slug.
    Supports language selection via query parameter 'lang' (defaults to 'fa').
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(status=Article.Status.ACCEPT)
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
