from django_filters import rest_framework as filters
from accounts.models import User
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from blog.models.partial import Player

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
                up_first_vector = SearchVector('user_profile__first_name', weight='B', config=config)
                up_last_vector = SearchVector('user_profile__last_name', weight='B', config=config)
                sp_first_vector = SearchVector('seller_profile__first_name', weight='B', config=config)
                sp_last_vector = SearchVector('seller_profile__last_name', weight='B', config=config)
                search_vector = phone_vector + up_first_vector + up_last_vector + sp_first_vector + sp_last_vector
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
                    Q(user_profile__last_name__icontains=value) |
                    Q(seller_profile__first_name__icontains=value) |
                    Q(seller_profile__last_name__icontains=value)
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