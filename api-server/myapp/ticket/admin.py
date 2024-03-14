from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from myapp.ticket.models import TicketType, Ticket


@admin.register(TicketType)
class TicketType(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name", "id")


@admin.register(Ticket)
class TicketType(admin.ModelAdmin):
    list_display = (
        "id",
        "type_link",
        "status",
        "created_by_link",
        "assigned_to_link",
        "label",
    )
    search_fields = ("label", "type", "id", "status", "created_by", "label")
    ordering = ("id",)
    list_filter = (
        "type",
        "status",
    )

    def created_by_link(self, obj):
        if obj.created_by is None:
            return "--"
        url = reverse(
            "admin:authentication_customuser_change", args=(obj.created_by.id,)
        )
        return format_html('<a href="{}">{}</a>', url, obj.created_by)

    created_by_link.short_description = "Created By"

    def assigned_to_link(self, obj):
        if obj.assigned_to is None:
            return "--"
        url = reverse(
            "admin:authentication_customuser_change", args=(obj.assigned_to.id,)
        )
        return format_html('<a href="{}">{}</a>', url, obj.assigned_to)

    assigned_to_link.short_description = "Assigned To"

    def type_link(self, obj):
        url = reverse("admin:ticket_tickettype_change", args=(obj.type.id,))
        return format_html('<a href="{}">{}</a>', url, obj.type)

    type_link.short_description = "Type"
