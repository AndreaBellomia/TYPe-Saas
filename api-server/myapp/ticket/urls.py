from django.urls import path

from myapp.ticket import views

app_name = "ticket"

urlpatterns = [
    path('types/list', views.TicketTypeListAPI.as_view(), name='ticket_types_list'),
    path('tickets/list', views.UserTicketAPI.as_view(), name='tickets_list')
]
