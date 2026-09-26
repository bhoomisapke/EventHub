from django.urls import path

from .views import (
    RegistrationCreateView,
    MyRegistrationsView,
    RegistrationDetailView,
    CancelRegistrationView,
    OrganizerParticipantsView,
)


urlpatterns = [

    # ========================================================
    # CREATE REGISTRATION
    # ========================================================

    path(
        "",
        RegistrationCreateView.as_view(),
        name="registration-create"
    ),


    # ========================================================
    # LOGGED-IN STUDENT REGISTRATIONS
    # ========================================================

    path(
        "my/",
        MyRegistrationsView.as_view(),
        name="my-registrations"
    ),


    # ========================================================
    # ORGANIZER - ALL PARTICIPANTS
    # ========================================================

    path(
        "organizer/",
        OrganizerParticipantsView.as_view(),
        name="organizer-participants"
    ),


    # ========================================================
    # ORGANIZER - PARTICIPANTS FOR ONE EVENT
    # ========================================================

    path(
        "organizer/<int:event_id>/",
        OrganizerParticipantsView.as_view(),
        name="organizer-event-participants"
    ),


    # ========================================================
    # SINGLE REGISTRATION
    # ========================================================

    path(
        "<int:pk>/",
        RegistrationDetailView.as_view(),
        name="registration-detail"
    ),


    # ========================================================
    # CANCEL REGISTRATION
    # ========================================================

    path(
        "<int:pk>/cancel/",
        CancelRegistrationView.as_view(),
        name="registration-cancel"
    ),
]