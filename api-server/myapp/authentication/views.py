# django imports

from django.conf import settings
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from django.utils import timezone as tz

from rest_framework import permissions, status, filters
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from myapp.core.paginations import BasicPaginationController

from knox.views import LoginView as KnoxLoginView
from knox.models import AuthToken

from myapp.authentication.serializers import (
    AuthSerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
)
from myapp.authentication.models import CustomUser


class LogoutView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        logout(request)
        
        response = Response({"message": "Logout successful"})
        response.delete_cookie(settings.AUTH_COOKIE_NAME)
        response.delete_cookie("user")
        response.delete_cookie("csrftoken")
        return response


class LoginView(KnoxLoginView):
    serializer_class = AuthSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
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
        instance, token = AuthToken.objects.create(request.user, token_ttl)
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


class ChangePasswordView(GenericAPIView):
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        user = self.request.user

        serializer = self.serializer_class(data=request.data, context={"user": user})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "success"})


class UserAuthenticated(APIView):

    serializer_class = UserProfileSerializer
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        user = getattr(request, "user", None)

        if user.is_authenticated:
            serializer = self.serializer_class(user)
            return Response(serializer.data, status.HTTP_200_OK)

        return Response(
            {"detail": "You must be logged in to see this page"},
            status.HTTP_401_UNAUTHORIZED,
        )
        
        
class UserViewMixin(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

class ProfileUserView(UserViewMixin):

    def get_object(self):
        user = self.request.user
        return get_object_or_404(CustomUser, pk=user.id)


class UserDetailView(UserViewMixin):

    def get_object(self):
        return get_object_or_404(CustomUser, pk=self.kwargs["id"])


class UsersSmallListView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        admin_only = self.request.GET.get("admin_only")

        queryset = CustomUser.objects.filter(is_active=True)

        if admin_only and admin_only.lower() == "true":
            queryset = queryset.filter(is_staff=True)

        return queryset


class UsersListView(ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)
    filter_backends = [filters.SearchFilter]
    queryset = CustomUser.objects.all().prefetch_related("user_info")

    pagination_class = BasicPaginationController

    search_fields = [
        "email",
        "id",
        "user_info__first_name",
        "user_info__last_name",
    ]


