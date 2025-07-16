from django_filters import rest_framework as filters
from accounts.models import User
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from blog.models.partial import Player
from blog.models.article import Team, Article

class UserFilter(filters.FilterSet):
    type = filters.CharFilter(method='filter_type')
    search = filters.CharFilter(method='filter_search')

    class Meta:
        model = User
        fields = ['type', 'search']

    def filter_type(self, queryset, name, value):
        if value == 'is_admin':
            return queryset.filter(is_superuser=True)
        elif value == 'is_author':
            return queryset.filter(is_author=True)
        elif value == 'is_seller':
            return queryset.filter(is_seller=True)
        return queryset

    def filter_search(self, queryset, name, value):
        if value:
            try:
                # Use 'simple' config for Persian/English fallback
                config = 'simple'
                # Create search vectors for all relevant fields
                phone_vector = SearchVector('phone_number', weight='A', config=config)
                first_name_vector = SearchVector('user_profile__first_name', weight='B', config=config)
                last_name_vector = SearchVector('user_profile__last_name', weight='B', config=config)
                search_vector = phone_vector + first_name_vector + last_name_vector
                search_query = SearchQuery(value, config=config)
                return queryset.annotate(
                    rank=SearchRank(search_vector, search_query)
                ).filter(
                    rank__gt=0.3
                ).order_by('-rank', '-created_date').distinct()
            except Exception:
                # Fallback to icontains search
                return queryset.filter(
                    Q(phone_number__icontains=value) |
                    Q(user_profile__first_name__icontains=value) |
                    Q(user_profile__last_name__icontains=value)
                ).distinct()
        return queryset


class PlayerFilter(filters.FilterSet):
    position = filters.CharFilter(field_name='position')
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Player
        fields = ['position', 'search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        
        # Get search language from request, default to 'fa'
        search_language = self.request.query_params.get('search_language', 'fa')
        
        # Create a filter that targets the appropriate language translation
        if search_language == 'en':
            # Search in English translations
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='en')
            ).distinct()
        else:
            # Default to search in Persian translations
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='fa')
            ).distinct()
    
    def filter_search_language(self, queryset, name, value):
        # This is just a parameter holder for the serializer
        # The actual filtering is done in filter_search
        return queryset


class TeamFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Team
        fields = ['search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        search_language = self.request.query_params.get('search_language', 'fa')
        if search_language == 'en':
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='en')
            ).distinct()
        else:
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='fa')
            ).distinct()
    def filter_search_language(self, queryset, name, value):
        return queryset


class ArticleFilter(filters.FilterSet):
    status = filters.CharFilter(field_name='status')
    type = filters.CharFilter(field_name='type')
    team = filters.CharFilter(field_name='team')
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Article
        fields = ['status', 'type', 'team', 'search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        
        try:
            # Get search language from request, default to 'fa'
            search_language = self.request.query_params.get('search_language', 'fa')
            
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
                translations__language_code=search_language
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
            if search_language == 'en':
                return queryset.filter(
                    Q(translations__title__icontains=value) & Q(translations__language_code='en')
                ).distinct()
            else:
                return queryset.filter(
                    Q(translations__title__icontains=value) & Q(translations__language_code='fa')
                ).distinct()
        
    def filter_search_language(self, queryset, name, value):
        # This is just a parameter holder for the serializer
        # The actual filtering is done in filter_search
        return queryset 