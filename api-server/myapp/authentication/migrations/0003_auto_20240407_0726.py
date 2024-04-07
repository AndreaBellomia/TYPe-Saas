# Generated by Django 5.0.3 on 2024-04-07 07:26

from django.db import migrations


GROUPS = [
    {"name": "manager"},
    {"name": "employer"},
]


def generate_permissions(apps, schema_editor):
    Group = apps.get_model("auth", "Group")

    for g in GROUPS:
        group = Group(**g)
        group.save()


class Migration(migrations.Migration):

    dependencies = [
        ("authentication", "0002_userinfo"),
    ]

    operations = [
        migrations.RunPython(generate_permissions),
    ]
