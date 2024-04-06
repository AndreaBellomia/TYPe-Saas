from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
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
        read_only_fields = ("email",)


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


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        exclude = ("created_at", "updated_at", "user")


class UserProfileSerializer(serializers.ModelSerializer):

    user_info = UserInfoSerializer()

    class Meta:
        model = CustomUser
        exclude = ("password",)
        read_only_fields = (
            "email",
            "user_permissions",
            "groups",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "last_login",
        )

    def update(self, instance, validated_data):
        user_info: UserInfo = instance.user_info

        user_info.first_name = validated_data["user_info"]["first_name"]
        user_info.last_name = validated_data["user_info"]["last_name"]
        user_info.phone_number = validated_data["user_info"]["phone_number"]
        user_info.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):

        user = self.context["user"]
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password", "La password non è corretta."})
        return value

    def validate(self, data):
        if data["new_password"] != data["confirm_new_password"]:
            raise serializers.ValidationError(
                {
                    "new_password": "Le nuove password non corrispondono.",
                    "confirm_new_password": "Le nuove password non corrispondono.",
                }
            )

        try:
            validate_password(data["new_password"], self.context["user"])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": e})

        return data

    def save(self):
        user = self.context["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
