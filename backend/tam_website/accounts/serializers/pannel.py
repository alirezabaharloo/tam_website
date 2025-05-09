from rest_framework import serializers
from ..models import User, UserProfile, SellerProfile

class BaseProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        fields = ['first_name', 'last_name']

class UserProfileSerializer(BaseProfileSerializer):
    class Meta(BaseProfileSerializer.Meta):
        model = UserProfile

class SellerProfileSerializer(BaseProfileSerializer):
    class Meta(BaseProfileSerializer.Meta):
        model = SellerProfile

class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'is_active', 'is_staff', 'is_author', 'is_seller', 'first_name', 'last_name']
        read_only_fields = ['phone_number']

    def get_first_name(self, obj):
        profile = obj.get_profile
        return profile.first_name if profile != "admin_profile" else None

    def get_last_name(self, obj):
        profile = obj.get_profile
        return profile.last_name if profile != "admin_profile" else None

class AdminProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['is_active', 'is_staff', 'is_author', 'is_seller', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile
        if first_name is not None or last_name is not None:
            profile = instance.get_profile
            if profile != "admin_profile":
                if first_name is not None:
                    profile.first_name = first_name
                if last_name is not None:
                    profile.last_name = last_name
                profile.save()

        return instance

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name']
        read_only_fields = ['is_active', 'is_staff', 'is_author', 'is_seller']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        profile = instance.get_profile
        if profile != "admin_profile":
            data['first_name'] = profile.first_name
            data['last_name'] = profile.last_name
        return data

    def update(self, instance, validated_data):
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        # Update profile
        if first_name is not None or last_name is not None:
            profile = instance.get_profile
            if profile != "admin_profile":
                if first_name is not None:
                    profile.first_name = first_name
                if last_name is not None:
                    profile.last_name = last_name
                profile.save()

        return instance