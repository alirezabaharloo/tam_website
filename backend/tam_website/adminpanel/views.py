from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    UserListSerializer,
    AdminProfileSerializer,
    UserProfileUpdateSerializer 
)
from rest_framework.decorators import api_view, permission_classes
from accounts.models import User
from permissions import IsSuperUser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_access(request):
    """
    Check if the authenticated user has admin access
    """
    is_admin = request.user.is_superuser
    is_author = request.user.is_author
    is_seller = request.user.is_seller
    if not is_admin or not is_author or not is_seller:
        return Response('Access denied.', status=status.HTTP_403_FORBIDDEN)
    return Response("Access granted.", status=status.HTTP_200_OK)


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
