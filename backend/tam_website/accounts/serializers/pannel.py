from rest_framework import serializers
from .models import User, UserProfile, SellerProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name']

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['first_name', 'last_name']

class UserSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(required=False)
    seller_profile = SellerProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'is_active', 'is_staff', 'is_author', 'is_seller', 'user_profile', 'seller_profile']
        read_only_fields = ['phone_number']

class UserUpdateSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(required=False)
    seller_profile = SellerProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['is_active', 'is_staff', 'is_author', 'is_seller', 'user_profile', 'seller_profile']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(required=False)
    seller_profile = SellerProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['user_profile', 'seller_profile']

    def update(self, instance, validated_data):
        user_profile_data = validated_data.pop('user_profile', None)
        seller_profile_data = validated_data.pop('seller_profile', None)

        if user_profile_data:
            UserProfile.objects.update_or_create(
                user=instance,
                defaults=user_profile_data
            )

        if seller_profile_data and instance.is_seller:
            SellerProfile.objects.update_or_create(
                user=instance,
                defaults=seller_profile_data
            )

        return instance