from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.password_validation import validate_password

def permission_detector(**kwargs):
    user_permissions = []
    for perm, perm_bool  in kwargs.items():
        if perm_bool:
            user_permissions.append(perm)

    return ','.join([perm for perm in user_permissions]) if user_permissions else 'normal'



class PasswordValidation:
    def __init__(self, password1, password2) -> None:
        self.password1 = password1
        self.password2 = password2

    def same_password_validation(self):
        if not (self.password1 == self.password2):
            raise serializers.ValidationError({
                'errors': _("passwords must be the same!")
            })
        
    def strong_password_validation(self):
        validate_password(self.password1)

        
    def validate(self):
        self.same_password_validation()
        self.strong_password_validation()



def send_opt_code(phone_number, code):
    print(phone_number, code)