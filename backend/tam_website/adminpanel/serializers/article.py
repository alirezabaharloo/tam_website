from rest_framework import serializers
from blog.models.article import Article, Team, Image
from django.db.models import Count
from accounts.models import Profile

class BilingualArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model with language selection support
    """
    title = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    hits_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    updated_date = serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField()

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

    def get_updated_date(self, obj):
        return obj.updated_date.strftime('%Y-%m-%d')
    
    def get_created_date(self, obj):
        return obj.created_date.strftime('%Y-%m-%d')


class CreateArticleSerializer(serializers.Serializer):
    """
    Serializer for creating a new Article with bilingual support
    """
    title_fa = serializers.CharField(max_length=250, required=True)
    title_en = serializers.CharField(max_length=250, required=True)
    body_fa = serializers.CharField(required=True)
    body_en = serializers.CharField(required=True)
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), required=True)
    status = serializers.ChoiceField(choices=Article.Status.choices, required=True)
    type = serializers.ChoiceField(choices=Article.Type.choices, required=True)
    video_url = serializers.URLField(required=False, allow_blank=True)
    author = serializers.IntegerField(required=False)  # Will be set in the view
    main_image = serializers.ImageField(required=True)  # Main image for all article types
    slideshow_image_count = serializers.IntegerField(required=False, default=0)  # Number of slideshow images
    
    def validate(self, data):
        """
        Validate that both language titles and bodies are unique
        """
        # Check if Persian title exists
        fa_title_exists = False
        for article in Article.objects.all():
            if article.has_translation('fa') and article.safe_translation_getter('title', language_code='fa') == data['title_fa']:
                fa_title_exists = True
                break
        
        # Check if English title exists
        en_title_exists = False
        for article in Article.objects.all():
            if article.has_translation('en') and article.safe_translation_getter('title', language_code='en') == data['title_en']:
                en_title_exists = True
                break
        
        # Check if Persian body exists
        fa_body_exists = False
        for article in Article.objects.all():
            if article.has_translation('fa') and article.safe_translation_getter('body', language_code='fa') == data['body_fa']:
                fa_body_exists = True
                break
        
        # Check if English body exists
        en_body_exists = False
        for article in Article.objects.all():
            if article.has_translation('en') and article.safe_translation_getter('body', language_code='en') == data['body_en']:
                en_body_exists = True
                break
                
        if fa_title_exists:
            raise serializers.ValidationError({"title_fa": "مقاله‌ای با این عنوان فارسی در سیستم موجود است."})
        
        if en_title_exists:
            raise serializers.ValidationError({"title_en": "مقاله‌ای با این عنوان انگلیسی در سیستم موجود است."})
            
        if fa_body_exists:
            raise serializers.ValidationError({"body_fa": "مقاله‌ای با این متن فارسی در سیستم موجود است."})
        
        if en_body_exists:
            raise serializers.ValidationError({"body_en": "مقاله‌ای با این متن انگلیسی در سیستم موجود است."})
        
        # Validate slideshow images for slideshow type articles
        if data['type'] == Article.Type.SLIDE_SHOW and data.get('slideshow_image_count', 0) < 1:
            raise serializers.ValidationError({"slideshow_images": "لطفا حداقل یک تصویر برای اسلایدشو انتخاب کنید."})
            
        return data
    
    def create(self, validated_data):
        """
        Create a new article with translations
        """
        # Extract translations
        title_fa = validated_data.pop('title_fa')
        title_en = validated_data.pop('title_en')
        body_fa = validated_data.pop('body_fa')
        body_en = validated_data.pop('body_en')
        
        # Extract images
        main_image = validated_data.pop('main_image')
        slideshow_image_count = validated_data.pop('slideshow_image_count', 0)
        
        # Create the article instance
        article = Article(
            team=validated_data.get('team'),
            status=validated_data.get('status'),
            type=validated_data.get('type'),
            video_url=validated_data.get('video_url', ''),
            author=Profile.objects.get(author=validated_data.get('author'))
        )
        
        # Save without translations first
        article.save()
        
        # Set Persian translations
        article.set_current_language('fa')
        article.title = title_fa
        article.body = body_fa
        article.save()
        
        # Set English translations
        article.set_current_language('en')
        article.title = title_en
        article.body = body_en
        article.save()
        
        # Save main image
        main_image_obj = Image.objects.create(image=main_image)
        main_image_obj.article.add(article)
        
        # Extract and save slideshow images if present
        slideshow_images = []
        for i in range(slideshow_image_count):
            if f'slideshow_image_{i}' in self.context['request'].FILES:
                slideshow_image = self.context['request'].FILES[f'slideshow_image_{i}']
                slideshow_image_obj = Image.objects.create(image=slideshow_image)
                slideshow_image_obj.article.add(article)
                slideshow_images.append(slideshow_image_obj)
        
        return article
