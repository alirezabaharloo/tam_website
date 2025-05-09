from rest_framework import serializers
from ..models import User, UserProfile, SellerProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name']

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['first_name', 'last_name']

class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users with basic information
    """
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name']
        read_only_fields = ['phone_number']

    def get_first_name(self, obj):
        profile = obj.get_profile
        if isinstance(profile, dict):  # Admin user
            return profile['user_profile'].first_name if profile['user_profile'] else None
        return profile.first_name if profile else None

    def get_last_name(self, obj):
        profile = obj.get_profile
        if isinstance(profile, dict):  # Admin user
            return profile['user_profile'].last_name if profile['user_profile'] else None
        return profile.last_name if profile else None

class AdminProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for admin users to view and update their profile
    """
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['is_active', 'is_staff', 'is_author', 'is_seller', 'first_name', 'last_name']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile = instance.get_profile
        if isinstance(profile, dict):  # Admin user
            if profile['user_profile']:
                data['first_name'] = profile['user_profile'].first_name
                data['last_name'] = profile['user_profile'].last_name
        return data

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile
        profile = instance.get_profile
        if isinstance(profile, dict):  # Admin user
            if profile['user_profile']:
                if first_name is not None:
                    profile['user_profile'].first_name = first_name
                if last_name is not None:
                    profile['user_profile'].last_name = last_name
                profile['user_profile'].save()

        return instance

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for regular users to view and update their profile
    """
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name']
        read_only_fields = ['is_active', 'is_staff', 'is_author', 'is_seller']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile = instance.get_profile
        if not isinstance(profile, dict):  # Regular user
            if profile:
                data['first_name'] = profile.first_name
                data['last_name'] = profile.last_name
        return data

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Update profile
        profile = instance.get_profile
        if not isinstance(profile, dict):  # Regular user
            if profile:
                if first_name is not None:
                    profile.first_name = first_name
                if last_name is not None:
                    profile.last_name = last_name
                profile.save()

        return instance
