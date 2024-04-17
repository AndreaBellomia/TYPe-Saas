from email import message
from gc import get_objects
import logging
from http import HTTPMethod

from django.db.models import Q
from django.utils import timezone as tz

from rest_framework.generics import (
    ListCreateAPIView,
)

from rest_framework import permissions, status, filters, mixins, viewsets, exceptions
from rest_framework.decorators import action
from rest_framework.response import Response

from myapp.authentication.models import CustomUser
from myapp.core.paginations import BasicPaginationController
from myapp.core.permissions import UserReadOnly, GroupPermission
from myapp.core.filters import StatusFilter
from myapp.ticket.serializers import (
    AdminTicketSerializer,
    TicketMsgSerializer,
    TicketTypeSerializer,
    UserTicketSerializer,
)
from myapp.ticket.models import TicketMsg, TicketType, Ticket

logger = logging.getLogger(__name__)


class TicketAdminViewset(viewsets.ModelViewSet):
    serializer_class = AdminTicketSerializer
    permission_classes = [permissions.IsAdminUser, GroupPermission]
    permission_groups = ["manager", "employer"]

    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, StatusFilter]

    status_field = "status"
    ordering_fields = [
        "id",
        "assigned_to",
        "created_by",
        "created_at",
        "expiring_date",
        "status",
        "type",
    ]
    search_fields = ["label", "created_by__email", "assigned_to__email"]

    def get_serializer_class(self):  # type: ignore
        user: CustomUser = self.request.user  # type: ignore
        serializer = AdminTicketSerializer

        if user.is_employer:
            serializer.Meta.read_only_fields = ("assigned_to_id",)  # type: ignore

        return serializer

    def query_employer(self):
        return Ticket.objects.filter(
            Q(assigned_to=self.request.user) | Q(created_by=self.request.user)
        )

    def get_queryset(self):  # type: ignore
        user: CustomUser = self.request.user  # type: ignore
        if user.is_manager:
            return Ticket.objects.all()

        return self.query_employer()

    def perform_create(self, serializer):
        user: CustomUser = self.request.user  # type: ignore

        instance = serializer.save()
        if user.is_employer:
            instance.assigned_to = user
            instance.save()

    @action(detail=False, methods=[HTTPMethod.GET], pagination_class=None)
    def board(self, request):

        queryset = self.get_queryset()

        resp = {
            "todo": AdminTicketSerializer(
                instance=queryset.filter(status=Ticket.Status.TODO),
                many=True,
            ).data,
            "progress": AdminTicketSerializer(
                instance=queryset.filter(status=Ticket.Status.PROGRESS),
                many=True,
            ).data,
            "blocked": AdminTicketSerializer(
                instance=queryset.filter(status=Ticket.Status.BLOCKED),
                many=True,
            ).data,
            "done": AdminTicketSerializer(
                instance=queryset.filter(
                    status=Ticket.Status.DONE,
                    updated_at__gt=tz.now() - tz.timedelta(days=2),
                ),
                many=True,
            ).data,
        }

        return Response(resp)

    @action(detail=False, methods=[HTTPMethod.PUT], serializer_class=None)
    def update_board(self, request):
        data = request.data
        instance = Ticket.objects.get(id=data["id"])
        instance.status = data["status"]
        instance.save()
        return Response({}, status=status.HTTP_200_OK)


class TicketTypeListAPI(ListCreateAPIView):
    permission_classes = [UserReadOnly]

    serializer_class = TicketTypeSerializer
    queryset = TicketType.objects.all()


class TicketUserViewset(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = UserTicketSerializer
    pagination_class = BasicPaginationController
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, StatusFilter]
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
        "assigned_to",
    ]

    def get_queryset(self):  # type: ignore
        user = self.request.user

        queryset = Ticket.objects.filter(created_by_id=user.id).prefetch_related(  # type: ignore
            "created_by", "created_by__user_info"
        )
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user)

    @action(
        detail=True,
        methods=[HTTPMethod.GET, HTTPMethod.POST],
        serializer_class=TicketMsgSerializer,
    )
    def message(self, request, pk=None):
        if request.method == HTTPMethod.GET:
            queryset = TicketMsg.objects.filter(ticket_id=pk).order_by("-created_at")
            
            serializer = self.serializer_class(
                queryset, many=True
            )
            return Response(serializer.data)

        if request.method == HTTPMethod.POST:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(author=request.user, ticket_id=pk)

            return Response(serializer.data)

        raise exceptions.MethodNotAllowed(request.method)
