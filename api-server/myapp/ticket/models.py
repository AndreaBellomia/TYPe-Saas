from django.db import models

from myapp.core.models import AbstractModel
from myapp.authentication.models import CustomUser


class TicketType(AbstractModel):
    name = models.CharField(max_length=50, db_index=True)
    description = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        return self.name.upper()

class Ticket(AbstractModel):

    class Status(models.TextChoices):
        BACKLOG = "backlog"
        TODO = "todo"
        PROGRESS = "progress"
        BLOCKED = "blocked"
        DONE = "done"

    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        related_name="created_tickets",
        null=True,
        blank=True,
    )
    assigned_to = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        related_name="assigned_tickets",
        null=True,
        blank=True,
    )

    label = models.CharField(max_length=100)
    expiring_date = models.DateTimeField(null=True, blank=True)
    type = models.ForeignKey(
        TicketType, on_delete=models.PROTECT, related_name="tickets", db_index=True
    )
    description = models.CharField(max_length=5000, null=True, blank=True)

    status = models.CharField(
        choices=Status.choices, max_length=8, default=Status.BACKLOG
    )

