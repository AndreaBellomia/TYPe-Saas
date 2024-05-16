from django.core.mail import EmailMultiAlternatives
from django.template import loader


def send_html_email(subject: str, html_email_template: str, context: dict, to: str):
    body = loader.render_to_string(html_email_template, context)

    email_message = EmailMultiAlternatives(subject, body, None, [to])
    if subject is not None:
        html_email = loader.render_to_string(html_email_template, context)
        email_message.attach_alternative(html_email, "text/html")

    return email_message.send()
