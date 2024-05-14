
from myapp.authentication import views
from rest_framework.routers import DefaultRouter


app_name = "authentication"

router = DefaultRouter()
router.register(r'', views.AuthenticationViewset, basename='auth')
router.register(r'users', views.AdminUserViewset, basename='admin')
router.register(r'utility', views.PasswordResetViewset, basename='password')

urlpatterns = router.urls

urlpatterns += []
