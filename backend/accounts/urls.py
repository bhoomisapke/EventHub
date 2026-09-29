from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    AdminLoginView,
    LogoutView,
    MeView,
    ForgotPasswordView,
    ResetPasswordView,
)


urlpatterns = [
    # Register
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    # Student / Organizer Login
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    # Admin Login
    path(
        "admin-login/",
        AdminLoginView.as_view(),
        name="admin-login",
    ),

    # Logout
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),

    # Current User / Profile
    path(
        "me/",
        MeView.as_view(),
        name="me",
    ),

    # Forgot Password
    path(
        "forgot-password/",
        ForgotPasswordView.as_view(),
        name="forgot-password",
    ),

    # Reset Password
    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),
]