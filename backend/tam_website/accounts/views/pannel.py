from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.pannel import (
    UserSerializer, 
    AdminProfileUpdateSerializer, 
    UserProfileUpdateSerializer
)
from ..models import User
from permissions import IsSuperUser

class UserListView(ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]

class AdminUserManagementView(RetrieveUpdateAPIView):
    serializer_class = AdminProfileUpdateSerializer
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]
    lookup_field = 'pk'

class UserProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return AdminProfileUpdateSerializer
        return UserProfileUpdateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['is_admin'] = self.request.user.is_superuser
        return context