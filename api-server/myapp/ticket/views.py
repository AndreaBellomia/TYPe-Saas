from django.shortcuts import render

from rest_framework.generics import ListCreateAPIView

from myapp.ticket.serializers import TicketTypeSerializer, UserTicketSerializer
from myapp.ticket.models import TicketType, Ticket
from myapp.ticket.permissions import UserReadOnly


class TicketTypeListAPI(ListCreateAPIView):
    permission_classes = [UserReadOnly]

    serializer_class = TicketTypeSerializer
    queryset = TicketType.objects.all()


class UserTicketAPI(ListCreateAPIView):
    serializer_class = UserTicketSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = Ticket.objects.filter(created_by_id=user.id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(created_by=user)
