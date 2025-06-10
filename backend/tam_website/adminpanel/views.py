from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    UserListSerializer,
    AdminProfileSerializer,
    UserProfileUpdateSerializer
)
from accounts.models import User
from permissions import IsSuperUser


class UserListView(ListAPIView):
    """
    View for listing all users with basic information
    Only accessible by superusers
    """
    serializer_class = UserListSerializer
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]

class AdminUserManagementView(RetrieveUpdateAPIView):
    """
    View for admin users to manage other users
    Only accessible by superusers
    """
    serializer_class = AdminProfileSerializer
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]
    lookup_field = 'pk'

class UserProfileView(RetrieveAPIView):
    """
    View for users to manage their own profile
    Accessible by all authenticated users
    """
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return UserProfileUpdateSerializer
        return UserProfileUpdateSerializer
