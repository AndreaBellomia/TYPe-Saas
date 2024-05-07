from django.urls import path

from myapp.notification import views
from rest_framework.routers import DefaultRouter


app_name = "notification"

router = DefaultRouter()
router.register(r"", views.NotificationViewset, basename="notification")

urlpatterns = router.urls

urlpatterns += []
