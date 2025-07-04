from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, SellerProfile, UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_seller:
            SellerProfile.objects.create(user=instance)
        else:
            UserProfile.objects.create(user=instance)