import django
from django.apps import AppConfig


class NotificationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "myapp.notification"
    
    def ready(self) -> None:
        from myapp.notification import receivers
