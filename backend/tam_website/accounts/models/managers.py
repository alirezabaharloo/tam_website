from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom user model manager where phone_number is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, phone_number, password, **extra_fields):
        """
        Create and save a User with the given phone_number and password.
        """
        if not phone_number:
            raise ValueError(_("The phone_number must be set!"))
        
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, phone_number, password, **extra_fields):
        """
        Create and save a SuperUser with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_author", True)
        extra_fields.setdefault("is_seller", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        if extra_fields.get("is_author") is not True:
            raise ValueError(_("Superuser must have is_author=True."))
        if extra_fields.get("is_seller") is not True:
            raise ValueError(_("Superuser must have is_seller=True."))
        
        return self.create_user(phone_number, password, **extra_fields)
    
    def create_authoruser(self, phone_number, password, **extra_fields):
        """
        Create and save an Author user with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_author", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Author user must have is_staff=True."))

        if extra_fields.get("is_author") is not True:
            raise ValueError(_("Author user must have is_author=True."))
        
        return self.create_user(phone_number, password, **extra_fields)
    
    def create_selleruser(self, phone_number, password, **extra_fields):
        """
        Create and save a Seller user with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_seller", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Seller user must have is_staff=True."))

        if extra_fields.get("is_seller") is not True:
            raise ValueError(_("Seller user must have is_seller=True."))
        
        return self.create_user(phone_number, password, **extra_fields)

    # query sets

    def active_users(self):
        return self.filter(is_active=True)