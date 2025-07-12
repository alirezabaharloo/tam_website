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

