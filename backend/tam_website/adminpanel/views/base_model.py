from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers import *
from rest_framework.decorators import api_view, permission_classes
from accounts.models import User
from permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from .base import BasePagination
from accounts.serializers import UserInfoSerializer
from ..filters import UserFilter




@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_list_view(request):
    """
    View for listing users with pagination and filtering
    """
    queryset = User.objects.all().order_by('-created_date')
    
    # Apply filters
    filter_backend = DjangoFilterBackend()
    user_filter = UserFilter(request.GET, queryset=queryset)
    filtered_queryset = user_filter.qs
    
    # Apply pagination
    paginator = BasePagination()
    page = paginator.paginate_queryset(filtered_queryset, request)
    
    # Serialize results
    serializer = UserInfoSerializer(page, many=True)
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_detail_view(request, id):
    """
    View for retrieving a single user's details
    """
    try:
        user = User.objects.get(id=id)
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsSuperUser])
def user_permissions_list_view(request):
    """
    View for listing user permission types
    """
    return Response(User.get_user_permissions_dict())
