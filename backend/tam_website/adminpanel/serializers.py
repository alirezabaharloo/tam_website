from rest_framework import serializers
from accounts.models import User
from accounts.models.profiles import Profile
from blog.models.partial import Player

class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for user list view (basic info)
    """
    permissions = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'is_active', 'permissions']
    
    def get_permissions(self, obj):
        """
        Return list of user permission types
        """
        perms = []
        if obj.is_superuser:
            perms.append('ادمین')
        if obj.is_staff:
            perms.append('کارمند')
        if obj.is_author:
            perms.append('نویسنده')
        if obj.is_seller:
            perms.append('فروشنده')
        return perms


class UserDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for detailed user information
    """
    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'email', 'first_name', 'last_name', 
            'is_active', 'is_superuser', 'is_staff', 'is_author', 'is_seller',
            'created_date', 'last_login'
        ]


class BilingualPlayerSerializer(serializers.ModelSerializer):
    """
    Serializer for Player model with language selection support
    """
    name = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    
    class Meta:
        model = Player
        fields = ['id', 'name', 'image', 'number', 'position', 'goals', 'games']
    
    def get_name(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return name in the requested language
        if search_language == 'en':
            # Try to get English translation, fallback to any available translation
            if obj.has_translation('en'):
                return obj.safe_translation_getter('name', language_code='en', default="")
            return obj.safe_translation_getter('name', any_language=True)
        else:
            # Default to Persian
            if obj.has_translation('fa'):
                return obj.safe_translation_getter('name', language_code='fa', default="")
            return obj.safe_translation_getter('name', any_language=True)
    
    def get_position(self, obj):
        # Get the language from request query params or default to 'fa'
        search_language = self.context.get('request').query_params.get('search_language', 'fa')
        
        # Return position in the requested language
        for choice_key, choice_value in Player.Positions.choices:
            if choice_key == obj.position:
                if search_language == 'en':
                    # Return English position (the choice key)
                    return choice_key
                else:
                    # Return Persian position (the choice display value)
                    return choice_value
        
        # Fallback to the raw position value
        return obj.position


class PlayerCreateSerializer(serializers.Serializer):
    """
    Serializer for creating a new Player with bilingual support
    """
    name_fa = serializers.CharField(max_length=250, required=True)
    name_en = serializers.CharField(max_length=250, required=True)
    image = serializers.ImageField(required=True)
    number = serializers.IntegerField(required=True)
    position = serializers.ChoiceField(choices=Player.Positions.choices, required=True)
    goals = serializers.IntegerField(required=True)
    games = serializers.IntegerField(required=True)
    
    def validate_number(self, value):
        """
        Validate that player number is between 1 and 99 inclusive.
        """
        if value < 1 or value > 99:
            raise serializers.ValidationError("Player number must be between 1 and 99.")
        return value
    
    def validate(self, data):
        """
        Validate that both language names are unique
        """
        # Check if Persian name exists
        fa_exists = False
        for player in Player.objects.all():
            if player.has_translation('fa') and player.safe_translation_getter('name', language_code='fa') == data['name_fa']:
                fa_exists = True
                break
        
        # Check if English name exists
        en_exists = False
        for player in Player.objects.all():
            if player.has_translation('en') and player.safe_translation_getter('name', language_code='en') == data['name_en']:
                en_exists = True
                break
                
        if fa_exists:
            raise serializers.ValidationError({"name_fa": "بازیکنی با این نام فارسی در سیستم موجود است."})
        
        if en_exists:
            raise serializers.ValidationError({"name_en": "بازیکنی با این نام انگلیسی در سیستم موجود است."})
            
        return data
    
    def create(self, validated_data):
        """
        Create a new player with translations
        """
        # Extract name translations
        name_fa = validated_data.pop('name_fa')
        name_en = validated_data.pop('name_en')
        
        # Create the player instance
        player = Player(
            image=validated_data.get('image'),
            number=validated_data.get('number'),
            position=validated_data.get('position'),
            goals=validated_data.get('goals'),
            games=validated_data.get('games')
        )
        
        # Save without translations first
        player.save()
        
        # Set translations
        player.set_current_language('fa')
        player.name = name_fa
        player.save()
        
        player.set_current_language('en')
        player.name = name_en
        player.save()
        
        return player




