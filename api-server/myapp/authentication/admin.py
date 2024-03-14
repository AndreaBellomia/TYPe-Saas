from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from myapp.authentication.forms import AuthChangeForm, AuthCreationForm
from myapp.authentication.models import UserInfo

ref_model = get_user_model()


@admin.register(ref_model)
class AuthAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        # (_("Personal info"), {"fields": ("name", "phone", "address")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    form = AuthChangeForm
    add_form = AuthCreationForm
    list_display = ("id", "email", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )


@admin.register(UserInfo)
class UserInfoPage(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name")
    search_fields = ("first_name", "last_name")
    ordering = ("id",)

    def user_link(self, obj):
        if obj.user is None:
            return "--"
        url = reverse(
            "admin:authentication_customuser_change", args=(obj.created_by.id,)
        )
        return format_html('<a href="{}">{}</a>', url, obj.created_by)

    user_link.short_description = "User"
