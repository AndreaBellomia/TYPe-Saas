import logging

from django.db import connection
from django.urls import resolve


log = logging.getLogger(__name__)


class DatabaseLoggingMiddleware:
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
        view = resolve(request.path_info)

        view_name = (
            view.func.view_class.__name__ if hasattr(view.func, "view_class") else None
        )

        log.debug(
            "Database queries: %s.%s [ %s ]",
            view.namespace,
            view_name,
            len(connection.queries),
        )
        return response
