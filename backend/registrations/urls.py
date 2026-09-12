from django.urls import path
from .views import RegistrationCreateView, MyRegistrationsView

urlpatterns = [
    path("", RegistrationCreateView.as_view(), name="registration-create"),
    path("my/", MyRegistrationsView.as_view(), name="my-registrations"),
]