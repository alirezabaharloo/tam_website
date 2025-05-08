from rest_framework import serializers
from .utils import PasswordValidation
from django.utils.translation import activate as set_language
from rest_framework.response import Response


class PasswordSerializerMixin(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    password1 = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # password validation
        pass_validate = PasswordValidation(attrs['password'], attrs['password1'])
        pass_validate.same_password_validation()
        return attrs    


class LocalizationMixin:
    """
    using initial method to handle localization errors and contents for each request
    """
    
    def initial(self, request, *args, **kwargs): 
        print(request.headers.get('Accept-Language')[:2])   
        set_language(request.headers.get('Accept-Language'))
        return super().initial(request, *args, **kwargs)
     