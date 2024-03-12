from django.urls import path

from myapp.authentication import views

app_name = "authentication"

urlpatterns = [
    path('login', views.LoginView.as_view(), name='login')
    
]
