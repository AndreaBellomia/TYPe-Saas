# django imports
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer

from knox.views import LoginView as KnoxLoginView

from myapp.authentication.serializers import (
    AuthSerializer,
    UserProfileSerializer,
    UserSerializer,
)
from myapp.authentication.models import CustomUser


class LogoutView(GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        logout(request)
        return Response({"message": "Logout successful"})


class LoginView(KnoxLoginView):
    serializer_class = AuthSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)


class UserAuthenticated(APIView):

    serializer_class = UserSerializer
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


class ProfileUserView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        user = self.request.user
        return get_object_or_404(CustomUser, pk=user.id)


class UsersListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_queryset(self):
        admin_only = self.request.GET.get("admin_only")
        
        queryset = CustomUser.objects.filter(
            is_active=True
        )
        
        if admin_only and admin_only.lower() == "true":
            queryset = queryset.filter(
                is_staff=True
            )
        
        return queryset