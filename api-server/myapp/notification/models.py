from django.db import models

from myapp.authentication.models import CustomUser
from myapp.core.models import AbstractModel
from myapp.ticket.models import Ticket

class Notifications(AbstractModel):
    message = models.CharField(max_length=1000)
    to_read = models.BooleanField(default=True)
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name="notifications")
    