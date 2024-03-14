from rest_framework import serializers

from myapp.ticket.models import TicketType, Ticket
from myapp.authentication.serializers import UserInfoSmallSerializer


class TicketTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TicketType
        fields = "__all__"


class UserTicketSerializer(serializers.ModelSerializer):

    assigned_to = UserInfoSmallSerializer()

    class Meta:
        model = Ticket
        exclude = ("updated_at", "created_by")
        read_only_fields = ("assigned_to", "status")
