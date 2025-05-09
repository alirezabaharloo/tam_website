from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django_jalali.db import models as jmodels
from .managers import UserManager
from ..utils import permission_detector
from django_jalali.db.models import datetime
from django.utils import timezone

    

class User(AbstractBaseUser, PermissionsMixin):
    # username field
    phone_number = models.CharField(_("phone number"), max_length=11, unique=True)

    # permission fields
    is_active = models.BooleanField(_("is active"), default=False)
    is_staff = models.BooleanField(_("management pannel access"), default=False)
    is_author = models.BooleanField(_("is author"), default=False)
    is_seller = models.BooleanField(_("is seller"), default=False)

    # date fields
    created_date = jmodels.jDateTimeField(_("created date"), auto_now_add=True)
    updated_date = jmodels.jDateTimeField(_("updated date"), auto_now=True)
    last_login = jmodels.jDateTimeField(_("last login"), null=True, blank=True)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    # manager
    objects = UserManager()

    def __str__(self):
        return self.phone_number


    def permissions(self):
        return permission_detector(admin=self.is_superuser, seller=self.is_seller, author=self.is_author)
    
    
    @property
    def get_profile(self):
<<<<<<< HEAD
        """
        Returns the appropriate profile for the user.
        For admin users, returns both user_profile and seller_profile.
        For other users, returns their user_profile.
        """
        if self.is_superuser:
            return {
                'user_profile': getattr(self, 'user_profile', None),
                'seller_profile': getattr(self, 'seller_profile', None)
            }
        return getattr(self, 'user_profile', None) or getattr(self, 'seller_profile', None)
=======
        profile = getattr(self, 'user_profile', None) or \
                  getattr(self, 'author_profile', None) or \
                  getattr(self, 'seller_profile', None)
        
        if profile is None:
            raise User.DoesNotExist("This user doesn't have any profile!")
        
        return profile
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180



class OtpCode(models.Model):
    phone_number = models.CharField(max_length=11)
    code = models.CharField(max_length=128)  # Store the hashed OTP code

    created_at = models.DateTimeField(default=timezone.now)

    @property
    def expire_time(self):
        return (self.created_at + timezone.timedelta(minutes=2)) - timezone.now()

    @property
    def is_expire_time(self):
        return self.expire_time <= timezone.timedelta(0)

    def __str__(self) -> str:
        return f"{self.phone_number} - {self.code}"