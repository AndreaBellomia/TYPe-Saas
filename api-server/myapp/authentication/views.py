from http import HTTPMethod
import logging
from typing import cast

from django.conf import settings
from django.contrib.auth import login, logout
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.db.transaction import atomic
from django.utils import timezone as tz
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from knox.models import AuthToken
from knox.views import LoginView as KnoxLoginView
from myapp.authentication.models import CustomUser
from myapp.authentication.serializers import (
    AuthSerializer,
    ChangePasswordSerializer,
    CreateUserSerializer,
    PasswordChangeConfirmSerializer,
    PasswordChangeSerializer,
    UserInfoSmallSerializer,
    UserProfileSerializer,
)
from myapp.core.paginations import BasicPaginationController
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class AuthenticationViewset(KnoxLoginView, viewsets.GenericViewSet):
    queryset = CustomUser.objects.all().prefetch_related("user_info")
    serializer_class = UserProfileSerializer

    token_generator = default_token_generator
    email_template_name = "password_reset_email.html"
    subject_template_name = "password_reset_subject.txt"

    @action(
        detail=False,
        methods=[HTTPMethod.GET, HTTPMethod.PUT],
        permission_classes=[permissions.IsAuthenticated],
    )
    def profile(self, request):
        """
        This function provide a profile
        """
        user: CustomUser = request.user

        if user:
            return Response(self.serializer_class(user).data)

        return Response(
            {"detail": "User not found in request"},
            status=status.HTTP_404_NOT_FOUND,
        )

    @action(
        detail=False,
        methods=[HTTPMethod.PUT],
        permission_classes=[permissions.IsAuthenticated],
    )
    def update_profile(self, request):
        """
        This function handle a profile update
        """
        user: CustomUser = request.user

        serializer = self.serializer_class(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "User updated"}, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.AllowAny],
        serializer_class=AuthSerializer,
    )
    def login(self, request):
        """
        This function handle a login
        """
        user: CustomUser = request.user

        if user.is_authenticated:
            return Response(
                {"detail": "Already logged in"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]  # type: ignore
        login(request, user)

        token_limit_per_user = self.get_token_limit_per_user()
        if token_limit_per_user is not None:
            now = tz.now()
            token = request.user.auth_token_set.filter(expiry__gt=now)
            if token.count() >= token_limit_per_user:
                return Response(
                    {
                        "error": "Maximum amount of tokens allowed per user exceeded."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        token_ttl = self.get_token_ttl()
        instance, token = AuthToken.objects.create(request.user, token_ttl)  # type: ignore
        user_logged_in.send(
            sender=request.user.__class__, request=request, user=request.user
        )
        data = self.get_post_response_data(request, token, instance)
        return Response(data)

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.IsAuthenticated],
    )
    def logout(self, request):
        """
        This function handle a logout
        """
        logout(request)
        request._auth.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.IsAuthenticated],
    )
    def password_change(self, request):
        """
        This function handles password change requests.
        """
        user: CustomUser = request.user

        if not user:
            return Response(
                {"detail": "User not found in request"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ChangePasswordSerializer(
            data=request.data, context={"user": user}
        )
        serializer.is_valid(raise_exception=True)
        serializer.create(serializer.validated_data)

        return Response(
            {"detail": "Password changed correctly"}, status=status.HTTP_200_OK
        )

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.AllowAny],
        serializer_class=PasswordChangeSerializer,
    )
    def password_reset(self, request):
        """
        This function handles password reset requests.
        """

        serializer = PasswordChangeSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=False):
            return Response({"detail": "L'email è stata inviata!"})

        email = cast(dict, serializer.validated_data)["email"]
        user = cast(dict, serializer.validated_data)["user"]

        current_site = get_current_site(request)

        context = {
            "email": email,
            "domain": settings.FRONTEND_URL,
            "site_name": current_site.name,
            "uid": urlsafe_base64_encode(force_bytes(user.pk)),
            "user": user,
            "token": self.token_generator.make_token(user),
            "protocol": "https" if self.request.is_secure() else "http",
        }

        serializer.send_mail(  # type: ignore
            self.subject_template_name,
            self.email_template_name,
            context,
            None,
            email,
            html_email_template_name=None,
        )
        return Response({"detail": "L'email è stata inviata!"})

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.AllowAny],
        serializer_class=PasswordChangeConfirmSerializer,
    )
    def password_reset_confirm(self, request):
        """
        This function confirm password reset requests.
        """
        
        with atomic():
            serializer = PasswordChangeConfirmSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            token = cast(dict, serializer.validated_data)["token"]
            user = cast(dict, serializer.validated_data)["user"]

            if self.token_generator.check_token(user, token):
                serializer.update(
                    instance=user, validated_data=serializer.validated_data
                )
                return Response(status=status.HTTP_200_OK)
        return Response(
            {"detail": "Token not valid"}, status=status.HTTP_403_FORBIDDEN
        )


class AdminUserViewset(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().prefetch_related("user_info")
    filter_backends = [filters.SearchFilter]

    pagination_class = BasicPaginationController

    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    search_fields = [
        "email",
        "id",
        "user_info__first_name",
        "user_info__last_name",
    ]

    def get_serializer_class(self):  # type: ignore
        user: CustomUser = self.request.user  # type: ignore
        serializer_class = UserProfileSerializer

        if not getattr(user, "is_manager", False):
            serializer_class.Meta.read_only_fields = (  # type: ignore
                "groups",
                "is_staff",
            )  # type: ignore
        return serializer_class

    def create(self, request, *args, **kwargs):
        with atomic():
            serializer = CreateUserSerializer(
                data=request.data,
                context={"protocol": self.request.is_secure()},
            )
            serializer.is_valid(raise_exception=True)

            try:
                self.perform_create(serializer)

            except Exception as e:
                logger.error("Error during create user: %s", e)
                return Response(
                    {
                        "detail": "Errore nella generazione della email riprovare"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )

    def get_queryset(self):
        admin_only = self.request.GET.get("admin_only")
        queryset = super().get_queryset()

        if admin_only and admin_only == "true":
            queryset = queryset.filter(is_staff=True)

        return queryset

    @action(detail=False, methods=[HTTPMethod.GET], pagination_class=None)
    def small(self, request):
        return Response(
            UserInfoSmallSerializer(self.get_queryset(), many=True).data
        )
