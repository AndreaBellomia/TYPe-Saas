from rest_framework import serializers

from myapp.authentication.models import CustomUser
from myapp.authentication.serializers import UserInfoSmallSerializer
from myapp.ticket.models import TicketType, Ticket


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


class AdminTicketSerializer(serializers.ModelSerializer):
    
    type = TicketTypeSerializer(read_only=True)
    type_id = serializers.IntegerField()
    
    assigned_to = UserInfoSmallSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(required=False)
    
    created_by = UserInfoSmallSerializer(read_only=True)
    created_by_id = serializers.IntegerField()


    def validate(self, attrs):
        assigned_to_id = attrs.get("assigned_to_id")
        if assigned_to_id :
            try:
                user = CustomUser.objects.get(id=assigned_to_id)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError({"assigned_to_id": f"User with id {assigned_to_id} not found"})
            
            if not user.is_staff:
                raise serializers.ValidationError({"assigned_to_id": f"Must be a staff user!"})
        return super().validate(attrs)

    class Meta:
        model = Ticket
        fields = "__all__"
