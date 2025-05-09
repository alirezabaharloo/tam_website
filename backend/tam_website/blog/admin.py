from .models import *
from django.contrib import admin
from django_jalali.admin.filters import JDateFieldListFilter
from parler.admin import TranslatableAdmin


@admin.register(Article)
class ArticleAdmin(TranslatableAdmin):   
    def get_created_date(self, obj):
        if obj.created_date:
            return f"Jalali: {obj.date_format('created_date')}"
        return None

    def get_updated_date(self, obj):
        if obj.updated_date:
            return f"Jalali: {obj.date_format('updated_date')}"
        return None

    get_created_date.short_description = 'Created Date'
    get_updated_date.short_description = 'Updated Date'

    list_display = ('get_title', 'author', 'status')
    list_filter = (
        'status',
        'author',
        ('created_date', JDateFieldListFilter),
        ('updated_date', JDateFieldListFilter),
    )
    search_fields = ('translations__title', 'translations__body')
    ordering = ('-created_date',)
    date_hierarchy = 'created_date'
    readonly_fields = ('get_created_date', 'get_updated_date', 'slug')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('name', 'number', 'position', 'goals', 'games')
    search_fields = ('name', 'position')
    ordering = ('name',)
