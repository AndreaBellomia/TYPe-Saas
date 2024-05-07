from django.contrib import admin

from myapp.notification import models


@admin.register(models.Notifications)
class NotificationsPage(admin.ModelAdmin):
    list_display = ("id", "user", "ticket")
    search_fields = ("user__email", "ticket__label")
    ordering = ("user__email", "id")
    
    raw_id_fields = [
        "user",
        "ticket",
    ]

