from http import HTTPMethod
from myapp.core.permissions import UserReadOnly, GroupPermission
from rest_framework import permissions, status, filters, mixins, viewsets, exceptions
from rest_framework.decorators import action
from rest_framework.response import Response

from myapp.notification.serializers import NotificationSerializer
from myapp.notification.models import Notifications


class NotificationViewset(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return self.request.user.notifications.all()

    @action(
        detail=False,
        methods=[
            HTTPMethod.GET,
        ],
        permission_classes=[permissions.IsAuthenticated],
    )
    def to_read(self, request):
        queryset = self.get_queryset().filter(to_read=True)
        serializer = self.serializer_class(instance=queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=[
            HTTPMethod.POST,
        ],
        permission_classes=[permissions.IsAuthenticated],
    )
    def set_read(self, request):
        queryset = self.get_queryset().filter(to_read=True)
        queryset.update(to_read=False)
        return Response({}, status=status.HTTP_200_OK)
