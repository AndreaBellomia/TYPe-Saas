from django.urls import path

from myapp.authentication import views

app_name = "authentication"

urlpatterns = [
    path('login', views.LoginView.as_view(), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('authenticated', views.UserAuthenticated.as_view(), name='authenticated')
]