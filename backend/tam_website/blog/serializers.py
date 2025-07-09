from rest_framework import serializers
from .models import Article, Category
from .utils import filter_vocabulary
from django.utils.translation import get_language
from .models import Article
from .utils import get_time_ago
from .models import Team, Player
from .utils.blog_utils import persian_digits


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

    def get_name(self, obj):
        lang = get_language()
        if obj.has_translation(lang):
            return obj.safe_translation_getter('name', language_code=lang, default="")
        return obj.safe_translation_getter('name', language_code='en', default="")


class ArticleSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.lang = get_language()
        self.client_ip = self.context.get("client_ip")

    """Serializer for Article model with translated fields and formatting"""
    author_name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    first_category = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'author_name', 'slug', 'view_count', 'time_ago', 'likes', 'images', 'type', 'video_url', 'categories', 'first_category', 'team']
        read_only_fields = ['author']

    def get_author_name(self, obj):
        """Get formatted author name from profile"""
        return str(obj.author) if obj.author else "Unknown"
    
    def get_first_category(self, obj):
        """Get the first category of the article"""
        if self.context.get('list'):
            # For list view, we'll use the prefetched first category
            first_category = obj.category.first()
            if first_category:
                return {
                    'id': first_category.id,
                    'name': first_category.safe_translation_getter('name', language_code=self.lang, default=""),
                    'slug': first_category.slug
                }
        return None

    def get_categories(self, obj):
        """Get all categories for detail view"""
        if not self.context.get('list'):
            categories = obj.category.all()
            return [{
                'id': category.id,
                'name': category.safe_translation_getter('name', language_code=self.lang, default=""),
                'slug': category.slug
            } for category in categories]
        return None

    def get_title(self, obj: Article):
        """Get translated title based on language preference"""
        return obj.get_title(language_code=self.lang)

    def get_body(self, obj: Article):
        """Get translated body based on language preference"""
        return obj.get_body(language_code=self.lang)

    def get_view_count(self, obj):
        return obj.hits.count()

    def get_likes(self, obj):
        return obj.likes.count()

    def get_time_ago(self, obj):
        return get_time_ago(obj)

    def get_images(self, obj):
        return [image.image.url for image in obj.article_images.all()]

    def get_team(self, obj):
        return {
            'name': obj.team.name,
            'slug': obj.team.slug
        }

    def to_representation(self, instance: Article):
        """Customize output based on context"""
        data = super().to_representation(instance)
        
        # Truncate body for list views
        if self.context.get('list'):
            if instance.get_body(language_code=self.lang).strip():
                data['body'] = filter_vocabulary(data['body'], 10)
            # Remove categories field for list view since we use first_category
            del data['categories']
        else:
            data['is_liked'] = instance.likes.filter(ip=self.client_ip).exists()
            del data['slug']
            # Remove first_category field for detail view since we use categories
            del data['first_category']
            
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


class TeamSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'image', 'slug']

    def get_name(self, obj):
        return obj.safe_translation_getter('name', language_code=self.context['request'].LANGUAGE_CODE)


class PlayerSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    goals = serializers.SerializerMethodField()
    games = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'name', 'image', 'number', 'position', 'goals', 'games']

    def get_name(self, obj: Player):
        return obj.get_name(language_code=get_language())

    def get_position(self, obj):
        return obj.get_position_display()

    def get_goals(self, obj):
        return persian_digits(obj.goals) if obj.goals is not None else None

    def get_games(self, obj):
        return persian_digits(obj.games) if obj.games is not None else None
    
    def get_position(self, obj):
        return obj.get_position(language_code=get_language())