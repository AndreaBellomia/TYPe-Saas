import logging

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone as tz

from rest_framework import filters, views, response
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAdminUser

from myapp.authentication.models import CustomUser
from myapp.core.paginations import BasicPaginationController
from myapp.core.permissions import UserReadOnly, GroupPermission
from myapp.core.filters import StatusFilter
from myapp.ticket.serializers import (
    AdminTicketSerializer,
    TicketTypeSerializer,
    UserTicketSerializer,
)
from myapp.ticket.models import TicketType, Ticket

logger = logging.getLogger(__name__)


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
        "assigned_to",
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


class AdminTicketAPI(ListCreateAPIView):
    permission_classes = [IsAdminUser, GroupPermission]
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

    def get_serializer_class(self):
        user: CustomUser = self.request.user
        serializer = AdminTicketSerializer

        if user.is_employer:
            serializer.Meta.read_only_fields = ("assigned_to_id",)

        return serializer

    def query_employer(self):
        return Ticket.objects.filter(
            Q(assigned_to=self.request.user) | Q(created_by=self.request.user)
        )

    def get_queryset(self):
        user: CustomUser = self.request.user
        if user.is_manager:
            return Ticket.objects.all()

        return self.query_employer()

    def perform_create(self, serializer):
        user = self.request.user

        instance = serializer.save()
        if user.is_employer:
            instance.assigned_to = user
            instance.save()


class BoardAdminAPI(views.APIView):
    pagination_class = None

    def get_queryset(self):
        return Ticket.objects.filter(
            Q(assigned_to=self.request.user) | Q(created_by=self.request.user),
        )

    def get(self, request, *args, **kwargs):

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

        return response.Response(resp)

    def put(self, request, *args, **kwargs):
        data = request.data
        instance = Ticket.objects.get(id=data["id"])
        instance.status = data["status"]
        instance.save()
        return response.Response({})


class AdminTicketUpdateAPI(RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser, GroupPermission]
    permission_groups = ["manager", "employer"]

    def get_serializer_class(self):
        user: CustomUser = self.request.user
        serializer = AdminTicketSerializer

        if user.is_employer:
            serializer.Meta.read_only_fields = ("assigned_to_id",)
        return serializer

    def query_employer(self):
        return Ticket.objects.filter(
            Q(assigned_to=self.request.user) | Q(created_by=self.request.user)
        )

    def get_object(self):
        user: CustomUser = self.request.user
        id = self.kwargs["id"]

        if user.is_manager:
            return get_object_or_404(self.query_employer(), pk=id)

        return get_object_or_404(Ticket, pk=id)

    def perform_create(self, serializer):
        user = self.request.user

        instance = serializer.save()
        if user.is_employer:
            instance.assigned_to = user
            instance.save(assigned_to=user)
