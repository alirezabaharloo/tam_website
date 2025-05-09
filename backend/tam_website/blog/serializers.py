from rest_framework import serializers
from .models import Article
from .utils import filter_vocabulary
from django.utils.translation import get_language
from .models import Article
from .utils import get_time_ago
from .utils import persian_digits
from blog.redis import RedisService

class ArticleSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.lang = get_language()

    """Serializer for Article model with translated fields and formatting"""
    author_name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'author_name' ,'slug', 'view_count', 'time_ago']
        read_only_fields = ['author']

    def get_author_name(self, obj):
        """Get formatted author name from profile"""
        return str(obj.author.author_profile)
    

    def get_title(self, obj: Article):
        """Get translated title based on language preference"""
        return obj.get_title(language_code=self.lang)

    def get_body(self, obj: Article):
        """Get translated body based on language preference"""
        return obj.get_body(language_code=self.lang)

    def get_view_count(self, obj):
        redis_service = RedisService(self.context.get('request'))
        return redis_service.get_article_view_count(obj.id)

    def get_time_ago(self, obj):
        return get_time_ago(obj)


    def to_representation(self, instance):
        """Customize output based on context"""
        data = super().to_representation(instance)
        
        # Truncate body for list views
        if self.context.get('list'):
            if instance.body.strip():
                data['body'] = filter_vocabulary(data['body'], 10)
       
        else:
            del data['slug']
            
        # Include status for preview
        if self.context.get('preview_article'):
            data['status'] = instance.status

        return data


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed article creation/editing"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.lang = get_language()

    title = serializers.CharField(max_length=250)
    body = serializers.CharField()

    class Meta:
        model = Article
        fields = ['title', 'body', 'status']

    def validate_title(self, value):
        """Ensure title is unique"""
        if Article.objects.filter(translations__title=value).exists():
            raise serializers.ValidationError("Article with this title already exists")
        return value

        
    def create(self, validated_data):
        """Create new article with translations"""
        print("*" * 100)
        title, body = validated_data.pop('title'), validated_data.pop('body')
        article = Article(**validated_data)
        article.set_current_language('fa')
        article.title = title
        article.body = body
        article.save()  
        return article

    def update(self, instance, validated_data):  
        # Update translated fields if provided  

        instance.set_current_language(get_language())  
        print(get_language())
        instance.title = validated_data.get('title', instance.title)
        instance.body = validated_data.get('body', instance.body) 
        instance.slug = validated_data.get('slug', instance.slug)  

        instance.save()  
        return instance