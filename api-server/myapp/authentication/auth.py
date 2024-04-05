from knox.auth import TokenAuthentication
from django.conf import settings
from rest_framework import exceptions

from django.utils import timezone as tz


class CookieTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get(settings.AUTH_COOKIE_NAME)

        if token is None:
            return None

        try:
            user, auth_token = self.authenticate_credentials(token.encode("UTF-8"))
            if auth_token.expiry < tz.now():
                raise exceptions.AuthenticationFailed("Token scaduto")
            return user, auth_token
        except exceptions.AuthenticationFailed as e:
            raise exceptions.AuthenticationFailed("Token non valido")
