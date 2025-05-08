from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, GenericAPIView
from ..serializers import ProfileSerializer, UserSerializer
from ..models import User
from permissions import IsSuperUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class UserListView(ListAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class AdminManagementProfileView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    queryset = User.objects.all()
    # permission_classes = [IsSuperUser]


class ProfileView(AdminManagementProfileView):
    # permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.get_queryset().get(pk=self.request.user.pk)
    

    

    