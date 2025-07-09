from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    first_name = models.CharField(_("first name"), max_length=255, null=True, blank=True)
    last_name = models.CharField(_("last name"), max_length=255, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else 'Unknown'
    
    def __str__(self) -> str:
        return self.full_name