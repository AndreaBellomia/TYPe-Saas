from django.urls import path

from myapp.authentication import views

app_name = "authentication"

urlpatterns = [
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.LogoutView.as_view(), name="logout"),
    path("profile", views.ProfileUserView.as_view(), name="profile"),
    path("authenticated", views.UserAuthenticated.as_view(), name="authenticated"),
    path("users/list/small", views.UsersSmallListView.as_view(), name="users-list-small"),
    path("users/list", views.UsersListView.as_view(), name="users-list"),
    path("users/<int:id>", views.UserDetailView.as_view(), name="users-detail"),
    path("user/change_password", views.ChangePasswordView.as_view(), name="change_password")
]