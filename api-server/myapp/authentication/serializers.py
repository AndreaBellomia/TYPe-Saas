import secrets

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password
from django.template import loader

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
            request=self.context.get("request"),
            username=email,
            password=password,
        )

        if not user:
            msg = "Unable to authenticate with provided credentials"
            raise serializers.ValidationError(msg, code="authentication")

        attrs["user"] = user
        return attrs

    def create(self, validated_data): ...

    def update(self, instance, validated_data): ...


class ChangePasswordSerializer(serializers.Serializer):
    """serializer for updating user password"""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        """Validate current user password"""

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

    def create(self, validated_data):
        user: CustomUser = self.context["user"]
        user.set_password(validated_data["new_password"])
        user.save()
        return user

    def update(self, instance, validated_data): ...


class UserInfoSmallSerializer(serializers.ModelSerializer):
    """Serialize minimal user info data"""

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
    """Serialize full user info data"""

    class Meta:
        model = UserInfo
        exclude = ("created_at", "updated_at", "user")


class UserProfileSerializer(serializers.ModelSerializer):
    """Serialize user profile data"""

    user_info = UserInfoSerializer()
    groups = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Group.objects.all(),
        allow_null=True,
        required=False,
    )

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
            user_info.last_name = user_info_data.get(
                "last_name", user_info.last_name
            )
            user_info.phone_number = user_info_data.get(
                "phone_number", user_info.phone_number
            )
            user_info.save()

        return inst


class CreateUserSerializer(serializers.Serializer):

    email = serializers.EmailField()

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Questo indirizzo è gia registrato!"
            )

        return value

    def save(self, **kwargs):
        validated_data = {**self.validated_data, **kwargs}  # type: ignore

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


class PasswordChangeSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):

        return value

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        user = CustomUser.objects.filter(email=validated_data["email"])

        if not user.exists():
            raise serializers.ValidationError(
                "Questo indirizzo non è registrato!"
            )
        else:
            validated_data["user"] = user.first()

        return validated_data

    def send_mail(
        self,
        subject_template_name,
        email_template_name,
        context,
        from_email,
        to_email,
        html_email_template_name=None,
    ):
        """
        Send a django.core.mail.EmailMultiAlternatives to `to_email`.
        """
        subject = loader.render_to_string(subject_template_name, context)
        subject = "".join(subject.splitlines())
        body = loader.render_to_string(email_template_name, context)

        email_message = EmailMultiAlternatives(
            subject, body, from_email, [to_email]
        )
        if html_email_template_name is not None:
            html_email = loader.render_to_string(
                html_email_template_name, context
            )
            email_message.attach_alternative(html_email, "text/html")

        email_message.send()


class PasswordChangeConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    password1 = serializers.CharField(
        style={"input_type": "password"}, trim_whitespace=False
    )

    password2 = serializers.CharField(
        style={"input_type": "password"}, trim_whitespace=False
    )

    def get_user(self, uidb64):
        """Get user from uuid"""
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = CustomUser.objects.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            CustomUser.DoesNotExist,
            ValidationError,
        ):
            user = None
        return user

    def validate(self, attrs):
        validated_data = super().validate(attrs)

        user = self.get_user(validated_data["uidb64"])
        if not user:
            raise serializers.ValidationError(_("The user does not exist."))

        validated_data["user"] = user

        if not validated_data["password1"] == validated_data["password2"]:
            raise serializers.ValidationError(_("Confirm password not match"))
        validate_password(validated_data["password2"], user)

        return validated_data

    def create(self, validated_data): ...

    def update(self, instance: CustomUser, validated_data):
        password = validated_data["password1"]
        instance.set_password(password)
        instance.save()
