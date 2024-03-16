from rest_framework.permissions import BasePermission

from myapp.authentication.models import CustomUser


class UserReadOnly(BasePermission):
    """
    Allow any access in GET request.
    Allow POST action only fo staff users
    """

    def has_permission(self, request, view):
        user: CustomUser = request.user

        if request.method == "GET":
            return True

        if user.is_staff:
            return True

        return False


class GroupPermission(BasePermission):

    def has_permission(self, request, view):
        user: CustomUser = request.user

        groups = list(user.groups.all().values_list("name", flat=True))

        if [i for i in groups if i in view.permission_groups]:
            return True
        return False
