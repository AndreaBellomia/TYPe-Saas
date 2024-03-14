from rest_framework import filters

from rest_framework.generics import ListCreateAPIView

from myapp.core.paginations import BasicPaginationController
from myapp.core.permissions import UserReadOnly
from myapp.core.filters import StatusFilter
from myapp.ticket.serializers import TicketTypeSerializer, UserTicketSerializer
from myapp.ticket.models import TicketType, Ticket


class TicketTypeListAPI(ListCreateAPIView):
    permission_classes = [UserReadOnly]

    serializer_class = TicketTypeSerializer
    queryset = TicketType.objects.all()


class UserTicketAPI(ListCreateAPIView):
    serializer_class = UserTicketSerializer
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, StatusFilter]
    status_field = "status"
    ordering_fields = [
        "id",
        "assigned_to",
        "created_at",
        "expiring_date",
        "status",
        "type",
    ]
    search_fields = [
        "label",
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = Ticket.objects.filter(created_by_id=user.id).prefetch_related(
            "created_by", "created_by__user_info"
        )
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user)
