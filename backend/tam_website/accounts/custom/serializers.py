from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.serializers import *
from django.utils.translation import gettext_lazy as _
from ..models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        authenticate_kwargs = {
            self.username_field: attrs[self.username_field],
            "password": attrs["password"],
        }
        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise serializers.ValidationError({'error': _('invalid username or password!')})
        
        data = super().validate(attrs)

        data[User.USERNAME_FIELD] = getattr(self.user, User.USERNAME_FIELD)

        return data