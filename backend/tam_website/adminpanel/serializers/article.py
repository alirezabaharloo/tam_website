from rest_framework import serializers
from blog.models.article import Article, Team
from django.db.models import Count

class BilingualArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model with language selection support
    """
    title = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    hits_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'status', 'type', 'team', 'hits_count', 'likes_count', 'updated_date', 'created_date']
    
    def get_title(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return title in the requested language
        if search_language == 'en':
            # Try to get English translation, fallback to any available translation
            if obj.has_translation('en'):
                return obj.safe_translation_getter('title', language_code='en', default="")
            return obj.safe_translation_getter('title', any_language=True)
        else:
            # Default to Persian
            if obj.has_translation('fa'):
                return obj.safe_translation_getter('title', language_code='fa', default="")
            return obj.safe_translation_getter('title', any_language=True)
    
    def get_team(self, obj):
        if not obj.team:
            return None
        
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return team name in the requested language
        if search_language == 'en':
            if obj.team.has_translation('en'):
                return obj.team.safe_translation_getter('name', language_code='en', default="")
            return obj.team.safe_translation_getter('name', any_language=True)
        else:
            if obj.team.has_translation('fa'):
                return obj.team.safe_translation_getter('name', language_code='fa', default="")
            return obj.team.safe_translation_getter('name', any_language=True)
    
    def get_hits_count(self, obj):
        return obj.hits.count()
    
    def get_likes_count(self, obj):
        return obj.likes.count()
