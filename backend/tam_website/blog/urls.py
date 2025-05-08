from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('create-article/', views.CreateArticleView.as_view(), name='create-article'),
    path('articles/', views.ArticleListView.as_view(), name='article-list'),
    path('articles/<str:slug>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('update-article/<str:slug>/', views.UpdateArticleView.as_view(), name='update-article'),
    path('delete-article/<str:slug>/', views.DeleteArticleView.as_view(), name='delete-article'),
    path('author-articles/', views.ArticleListForAuthorsView.as_view(), name='author-articles'),
    path('preview-article/<str:slug>/', views.ArticleDetailForAuthorsView.as_view(), name='author-article-detail'),
    path('test_articles/', views.MostViewedForLastMonthArticlesView.as_view(), name='test-articles')
]
