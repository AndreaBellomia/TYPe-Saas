from rest_framework import serializers

from myapp.ticket.models import TicketType, Ticket
from myapp.authentication.serializers import UserInfoSmallSerializer


class TicketTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TicketType
        fields = "__all__"


class UserTicketSerializer(serializers.ModelSerializer):

    assigned_to = UserInfoSmallSerializer(read_only=True)
    type = TicketTypeSerializer(read_only=True)
    type_id = serializers.IntegerField(write_only=True)

    def validate(self, attrs):
        valid_type_id = list(TicketType.objects.all().values_list("id", flat=True))
        if attrs["type_id"] and attrs["type_id"] not in valid_type_id:
            raise serializers.ValidationError({"type_id": f"Not valid!"})

        return attrs

    class Meta:
        model = Ticket
        exclude = ("updated_at", "created_by")
        read_only_fields = ("status",)
