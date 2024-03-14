from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class BasicPaginationController(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        if not request.query_params.get("ordering"):
            queryset = queryset.order_by("-pk")
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "num_pages": self.page.paginator.num_pages,
                "results": data,
            }
        )
