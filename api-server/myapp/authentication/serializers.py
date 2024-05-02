import secrets


from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import (
    make_password,
)

from rest_framework import serializers


from myapp.authentication.models import CustomUser, UserInfo
from myapp.core.email import send_html_email


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


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):

        user = self.context["user"]
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password", "La password non è corretta."}
            )
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(
                {
                    "new_password": "Le nuove password non corrispondono.",
                    "confirm_new_password": "Le nuove password non corrispondono.",
                }
            )

        try:
            validate_password(attrs["new_password"], self.context["user"])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": e})

        return attrs

    def save(self, **kwargs):
        user = self.context["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


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


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfo
        exclude = ("created_at", "updated_at", "user")


class UserProfileSerializer(serializers.ModelSerializer):

    user_info = UserInfoSerializer()
    groups = serializers.StringRelatedField(many=True)

    class Meta:
        model = CustomUser
        exclude = ("password",)
        read_only_fields = (
            "email",
            "user_permissions",
            "is_superuser",
            "is_active",
            "date_joined",
            "last_login",
        )

    def update(self, instance, validated_data):
        user_info: UserInfo | None = getattr(instance, "user_info", None)
        user_info_data = validated_data.pop("user_info", None)
        inst = super().update(instance, validated_data)

        if user_info is None:
            user_info = UserInfo.objects.get_or_create(user=instance)[0]

        if user_info_data:
            user_info.first_name = user_info_data.get(
                "first_name", user_info.first_name
            )
            user_info.last_name = user_info_data.get("last_name", user_info.last_name)
            user_info.phone_number = user_info_data.get(
                "phone_number", user_info.phone_number
            )
            user_info.save()

        return inst


class CreateUserSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Questo indirizzo è gia registrato!")

        return value

    def save(self, **kwargs):
        validated_data = {**self.validated_data, **kwargs}

        password = secrets.token_urlsafe(10)

        user = CustomUser.objects.create(
            email=validated_data["email"],
            password=make_password(password),
            is_active=True,
        )

        html_content = f"""
        Attiva il tuo account ticket crm 
        email: {user.email}
        password: {password}
        sito: http://localhost:3000
        dopo il login reimposta la password dalla sezione profilo
        """

        send_html_email(
            "Registrazione a TicketCRM",
            html_content,
            from_email="noreply@ticketCRM.it",
            to=[user.email],
        )

        return user
