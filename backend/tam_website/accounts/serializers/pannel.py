from rest_framework import serializers
from ..models import User, AuthorProfile, SellerProfile, UserProfile
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('phone_number', 'pk')

    def to_representation(self, instance):
        rep_data = super().to_representation(instance)
        rep_data['link'] = f"http://localhost:8000/profile/{instance.pk}"
        return rep_data


class ProfileSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.profile_info = None

    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField(read_only=True)
    updated_date = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ("phone_number", 'is_active', 'is_superuser', 'is_seller', 'is_author', 'is_staff', 'updated_date', 'created_date', 'first_name', 'last_name', 'permissions')


    def get_first_name(self, obj):
        return obj.get_profile.first_name

    def get_last_name(self, obj):
        return obj.get_profile.last_name

    def get_created_date(self, obj):
        """Format created date in a specific format."""
        return obj.created_date.strftime('%Y-%m-%d %H:%M:%S')

    def get_updated_date(self, obj):
        """Format updated date in a specific format."""
        return obj.updated_date.strftime('%Y-%m-%d %H:%M:%S')

    def get_permissions(self, obj):
        return obj.permissions()

    def update(self, instance, validated_data):
        profile_info = instance.get_profile.__class__.__name__
        if profile_info == "AuthorProfile":
            instance.is_author = validated_data.get('is_author', instance.is_author)
        elif profile_info == "SellerProfile":
            instance.is_seller = validated_data.get('is_seller', instance.is_seller)
        elif profile_info == "AuthorProfile" and profile_info == "SellerProfile":
            instance.is_superuser = validated_data.get('is_superuser', instance.is_author)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.get_profile.first_name = validated_data.get("first_name", instance.get_profile.first_name)
        instance.get_profile.last_name = validated_data.get("last_name", instance.get_profile.last_name)
        instance.save()

        return instance
    
