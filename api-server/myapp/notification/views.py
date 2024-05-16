from http import HTTPMethod

from rest_framework import permissions, status, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from myapp.notification.serializers import NotificationSerializer


class NotificationViewset(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return self.request.user.notifications.all().order_by("-created_at")

    @action(
        detail=False,
        methods=[HTTPMethod.GET],
        permission_classes=[permissions.IsAuthenticated],
    )
    def to_read(self, request):
        queryset = self.get_queryset().filter(to_read=True)
        serializer = self.serializer_class(instance=queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.IsAuthenticated],
    )
    def set_read(self, request):
        queryset = self.get_queryset().filter(to_read=True)
        queryset.update(to_read=False)
        return Response({}, status=status.HTTP_200_OK)
