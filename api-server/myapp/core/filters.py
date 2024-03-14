from rest_framework.filters import BaseFilterBackend


class StatusFilter(BaseFilterBackend):

    status_params = "statuses"

    def get_status_field(self, view):
        return getattr(view, "status_field", None)

    def filter_queryset(self, request, queryset, view):
        status_field = self.get_status_field(view)
        _request = getattr(request, request.method)
        status = _request.get(self.status_params)

        if not status:
            return queryset

        status_list = [x for x in status.split(",")]
        return queryset.filter(**{f"{status_field}__in": status_list})
