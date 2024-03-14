from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from myapp.authentication.models import CustomUser, UserInfo


class UserInfoSmallSerializer(serializers.ModelSerializer):

    first_name = serializers.PrimaryKeyRelatedField(
        read_only=True, source="user_info.first_name"
    )
    last_name = serializers.PrimaryKeyRelatedField(
        read_only=True, source="user_info.last_name"
    )

    class Meta:
        model = CustomUser
        fields = ("id", "email", "first_name", "last_name")


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = ("password", "date_joined")


class AuthSerializer(serializers.Serializer):
    """serializer for the user authentication object"""

    email = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"}, trim_whitespace=False
    )

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(
            request=self.context.get("request"), username=email, password=password
        )

        if not user:
            msg = "Unable to authenticate with provided credentials"
            raise serializers.ValidationError(msg, code="authentication")

        attrs["user"] = user
        return attrs
