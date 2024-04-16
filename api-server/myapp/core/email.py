from django.core.mail import send_mail
from django.utils.html import strip_tags


def send_html_email(subject: str, html_message: str, from_email: str, to: list):
    plain_message = strip_tags(html_message)
    return send_mail(subject, plain_message, from_email, to, html_message=html_message)