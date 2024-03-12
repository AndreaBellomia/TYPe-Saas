from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from myapp.authentication.forms import AuthChangeForm, AuthCreationForm

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
