from django_filters import rest_framework as filters
from accounts.models import User
from django.db.models import Q
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

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
        print(value)
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