<<<<<<< HEAD
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.pannel import (
    UserListSerializer,
    AdminProfileSerializer,
    UserProfileUpdateSerializer
)
=======
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UserSerializer, UserUpdateSerializer, ProfileUpdateSerializer
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
from ..models import User
from permissions import IsSuperUser

class UserListView(ListAPIView):
<<<<<<< HEAD
    """
    View for listing all users with basic information
    Only accessible by superusers
    """
    serializer_class = UserListSerializer
=======
    serializer_class = UserSerializer
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]

class AdminUserManagementView(RetrieveUpdateAPIView):
<<<<<<< HEAD
    """
    View for admin users to manage other users
    Only accessible by superusers
    """
    serializer_class = AdminProfileSerializer
=======
    serializer_class = UserUpdateSerializer
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]
    lookup_field = 'pk'

class UserProfileView(RetrieveUpdateAPIView):
<<<<<<< HEAD
    """
    View for users to manage their own profile
    Accessible by all authenticated users
    """
=======
    serializer_class = ProfileUpdateSerializer
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.user.is_superuser:
<<<<<<< HEAD
            return AdminProfileSerializer
        return UserProfileUpdateSerializer
=======
            return UserUpdateSerializer
        return ProfileUpdateSerializer
>>>>>>> b1a5e812018095525d7f735359a9e7d1b4461180
