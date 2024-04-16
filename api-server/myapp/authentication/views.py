# django imports

from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from django.utils import timezone as tz

from rest_framework import permissions, status, filters
from rest_framework.views import APIView
from rest_framework.generics import (
    GenericAPIView,
    RetrieveUpdateAPIView,
    ListAPIView,
    CreateAPIView,
)
from rest_framework.response import Response

from http import HTTPMethod

from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action

from rest_framework.authtoken.serializers import AuthTokenSerializer

from myapp.core.paginations import BasicPaginationController
from myapp.core.permissions import GroupPermission

from knox.views import LoginView as KnoxLoginView
from knox.models import AuthToken

from myapp.authentication.serializers import (
    AuthSerializer,
    ChangePasswordSerializer,
    CreateUserSerializer,
    UserProfileSerializer,
)
from myapp.authentication.models import CustomUser


class AuthenticationViewset(KnoxLoginView, viewsets.GenericViewSet):
    queryset = CustomUser.objects.all().prefetch_related("user_info")
    serializer_class = UserProfileSerializer

    @action(
        detail=False,
        methods=[
            HTTPMethod.GET,
        ],
        permission_classes=[permissions.IsAuthenticated],
    )
    def profile(self, request):
        user: CustomUser = request.user

        if user:
            return Response(self.serializer_class(user).data)

        return Response(
            {"detail": "User not found in request"}, status=status.HTTP_404_NOT_FOUND
        )

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.AllowAny],
    )
    def login(self, request):
        user: CustomUser = request.user

        if user:
            return Response(
                {"detail": "Already logged in"}, status=status.HTTP_403_FORBIDDEN
            )

        serializer = AuthSerializer(data=request.data).is_valid(raise_exception=True)
        user = serializer.validated_data["user"] # type: ignore
        login(request, user)

        token_limit_per_user = self.get_token_limit_per_user()
        if token_limit_per_user is not None:
            now = tz.now()
            token = request.user.auth_token_set.filter(expiry__gt=now)
            if token.count() >= token_limit_per_user:
                return Response(
                    {"error": "Maximum amount of tokens allowed per user exceeded."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        token_ttl = self.get_token_ttl()
        instance, token = AuthToken.objects.create(request.user, token_ttl) # type: ignore
        user_logged_in.send(
            sender=request.user.__class__, request=request, user=request.user
        )
        data = self.get_post_response_data(request, token, instance)
        response = Response(data)
        response.set_cookie(
            settings.AUTH_COOKIE_NAME,
            data["token"],
            expires=instance.expiry,
            httponly=True,
        )
        return response

    @action(
        detail=False,
        methods=[HTTPMethod.POST],
        permission_classes=[permissions.IsAuthenticated],
    )
    def logout(self, request):
        logout(request)

        response = Response({"message": "Logout successful"})
        response.delete_cookie(settings.AUTH_COOKIE_NAME)
        response.delete_cookie("user")
        response.delete_cookie("csrftoken")
        return response

    def password_change(self, request):
        user: CustomUser = request.user

        if not user:
            return Response(
                {"detail": "User not found in request"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ChangePasswordSerializer(data=request.data, context={"user": user})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Password changed correctly"}, status=status.HTTP_200_OK
        )


class AdminUserViewset(viewsets.ModelViewSet, mixins.ListModelMixin):
    queryset = CustomUser.objects.all().prefetch_related("user_info")
    serializer_class = UserProfileSerializer
    filter_backends = [filters.SearchFilter]

    pagination_class = BasicPaginationController

    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    search_fields = [
        "email",
        "id",
        "user_info__first_name",
        "user_info__last_name",
    ]

    def create(self, request, *args, **kwargs):
        serializer = CreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
