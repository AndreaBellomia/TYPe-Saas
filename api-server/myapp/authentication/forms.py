from django.contrib.auth import get_user_model
from django.contrib.auth.forms import (
    UsernameField,
    BaseUserCreationForm,
    UserChangeForm,
)
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

ref_model = get_user_model()


class EmailField(UsernameField):

    def widget_attrs(self, widget):
        return {
            **super().widget_attrs(widget),
            "autocapitalize": "none",
            "autocomplete": "email",
        }


class BaseAuthCreationForm(BaseUserCreationForm):

    class Meta:
        model = ref_model
        fields = ("email",)
        field_classes = {"email": EmailField}


class AuthChangeForm(UserChangeForm):
    class Meta:
        model = ref_model
        fields = "__all__"
        field_classes = {"email": EmailField}


class AuthCreationForm(BaseAuthCreationForm):
    def clean_email(self):
        """Reject usernames that differ only in case."""
        email = self.cleaned_data.get("email")
        if email and self._meta.model.objects.filter(email__iexact=email).exists():
            self._update_errors(
                ValidationError(
                    {
                        "email": self.instance.unique_error_message(
                            self._meta.model, ["email"]
                        )
                    }
                )
            )
        else:
            return email
