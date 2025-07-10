from rest_framework.generics import *
from rest_framework.response import Response
from ..serializers import *
from permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import UserFilter, PlayerFilter
from rest_framework.views import APIView
from rest_framework import viewsets
from blog.models.partial import Player
from .base import BasePagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status



class PlayerListView(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing or retrieving players.
    """
    queryset = Player.objects.all()
    serializer_class = BilingualPlayerSerializer
    filterset_class = PlayerFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsSuperUser, IsAuthor]
    pagination_class = BasePagination
    
    def get_serializer_context(self):
        """
        Add request to serializer context to access query parameters
        """
        context = super().get_serializer_context()
        return context


class PlayerPositionsView(APIView):
    """
    View to return all player positions for filtering.
    """
    permission_classes = [IsSuperUser, IsAuthor]

    def get(self, request, format=None):
        """
        Return a list of positions with their English keys and Persian display values.
        """
        positions = {
            '': 'همه‌ی پست‌ها',  # Empty string for "All"
        }
        # Add all position choices
        for choice_key, choice_value in Player.Positions.choices:
            positions[choice_key] = choice_value
        
        return Response(positions)


@api_view(['DELETE'])
@permission_classes([IsSuperUser, IsAuthor])
def delete_player(request, player_id):
    """
    Delete a player by ID.
    """
    try:
        player = Player.objects.get(id=player_id)
        player_name = player.get_name()
        player.delete()
        return Response(
            {"message": f"Player '{player_name}' deleted successfully"}, 
            status=status.HTTP_200_OK
        )
    except Player.DoesNotExist:
        return Response(
            {"error": "Player not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
