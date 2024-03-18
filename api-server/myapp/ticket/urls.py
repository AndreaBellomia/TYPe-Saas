from django.urls import path

from myapp.ticket import views

app_name = "ticket"

urlpatterns = [
    path('types/list', views.TicketTypeListAPI.as_view(), name='ticket_types_list'),
    path('tickets/list', views.UserTicketAPI.as_view(), name='tickets_list'),
    
    path('admin/tickets/list', views.AdminTicketAPI.as_view(), name='tickets_admin_list'),
    path('admin/tickets/board', views.BoardAdminAPI.as_view(), name='tickets_admin_board'),
    path('admin/tickets/update/<int:id>', views.AdminTicketUpdateAPI.as_view(), name='tickets_admin_update')
]
