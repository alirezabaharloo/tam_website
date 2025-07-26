from rest_framework import serializers
from accounts.models import User
from accounts.models.profiles import Profile
from blog.models.partial import Player


class AdminAccessUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_author', 'is_seller', 'permissions']

    def get_permissions(self, obj):
        return obj.permissions()


class UserListSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'is_active', 'permissions']

    def get_permissions(self, obj):
        return obj.permissions()


class UserDeactivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance
