from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.decorators import api_view, permission_classes
from accounts.models import User
from permissions import IsSuperUser
from accounts.serializers import UserInfoSerializer
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .filters import UserFilter
from rest_framework.views import APIView

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

class UserPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50

class UserListView(ListAPIView):
    """
    View for listing all users with basic information
    Only accessible by superusers
    Supports search by phone_number, first_name, last_name (case-insensitive, contains)
    """
    serializer_class = UserInfoSerializer
    queryset = User.objects.all()
    permission_classes = [IsSuperUser]
    pagination_class = UserPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = UserFilter

class UserPermissionsListView(APIView):
    permission_classes = [IsSuperUser]
    def get(self, request):
        return Response(User.get_user_permissions_dict())
