from django.urls import path

from myapp.ticket import views
from rest_framework.routers import DefaultRouter

app_name = "ticket"

router = DefaultRouter()
router.register(r'admin', views.TicketAdminViewset, basename='admin')
router.register(r'', views.TicketUserViewset, basename='user')

urlpatterns = router.urls

urlpatterns += [
    path('types/list', views.TicketTypeListAPI.as_view(), name='ticket_types_list'),
]

