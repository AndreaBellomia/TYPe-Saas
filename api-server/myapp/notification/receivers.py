from asgiref.sync import sync_to_async
from django.dispatch import receiver

from myapp.ticket.models import Ticket
from myapp.notification import signals, models

@receiver(signals.notify_ticket)
def handle_notify_ticket(sender, ticket, user, message, **kwargs):
    if not user.is_authenticated:
        return
    
    models.Notifications.objects.create(
        user=user,
        message=message,
        ticket=ticket
    )
    