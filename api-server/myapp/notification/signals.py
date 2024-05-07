from django.dispatch import Signal

notify_ticket = Signal(["ticket", "message", "user"])