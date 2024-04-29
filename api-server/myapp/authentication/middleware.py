import logging
import json

from django.db import connection
from django.urls import resolve

from django.utils import timezone as tz


log = logging.getLogger(__name__)


def generate_new_cookie(user):
    groups_list = list(user.groups.values_list("name", flat=True))
    updated_at_str = user.updated_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ')

    return json.dumps(dict({
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "is_active": user.is_active,
        "id": user.id,
        "groups": groups_list,
        "updated_at": updated_at_str,
    })) 


class UserDataCookies:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = None
        if hasattr(self, "process_request"):
            response = self.process_request(request)
        response = response or self.get_response(request)
        if hasattr(self, "process_response"):
            response = self.process_response(request, response)
        return response

    def process_response(self, request, response):
        resp = response
        user = request.user
        
        if user.is_anonymous:
            return resp

        current_cookie = request.COOKIES.get("user")

        try:
            cookie_time = json.dumps(current_cookie)["updated_at"]

            if cookie_time != user.updated_at.strftime("%Y-%m-%d"):
                resp.set_cookie("user", generate_new_cookie(user))

        except:
            resp.set_cookie("user",  generate_new_cookie(user))

        return resp
