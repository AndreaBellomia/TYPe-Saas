import logging

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group

logger = logging.getLogger(__name__)

GROUPS = [
    Group(name="manager"),
    Group(name="employer"),
]


class Command(BaseCommand):
    help = "Initialize django permissions group"

    def add_arguments(self, parser): ...

    def handle(self, *args, **options):
        logger.info("Checking initialization data [authentication]")

        for group in GROUPS:
            Group.objects.get_or_create(name=group.name)
