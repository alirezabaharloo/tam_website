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




