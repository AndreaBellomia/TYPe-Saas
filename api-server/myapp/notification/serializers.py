from rest_framework import serializers

from myapp.notification.models import Notifications


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notifications
        fields = "__all__"
