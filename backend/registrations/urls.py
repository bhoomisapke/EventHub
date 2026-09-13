from django.urls import path

from .views import (
    RegistrationCreateView,
    MyRegistrationsView,
    OrganizerParticipantsView,
)


urlpatterns = [

    # =====================================================
    # STUDENT REGISTRATION
    # =====================================================
    #
    # POST
    # /api/registrations/
    #
    # =====================================================

    path(
        "",
        RegistrationCreateView.as_view(),
        name="registration-create",
    ),


    # =====================================================
    # STUDENT'S OWN REGISTRATIONS
    # =====================================================
    #
    # GET
    # /api/registrations/my/
    #
    # =====================================================

    path(
        "my/",
        MyRegistrationsView.as_view(),
        name="my-registrations",
    ),


    # =====================================================
    # ALL ORGANIZER PARTICIPANTS
    # =====================================================
    #
    # GET
    # /api/registrations/organizer/
    #
    # Shows participants from ALL events
    # created by the logged-in organizer.
    #
    # =====================================================

    path(
        "organizer/",
        OrganizerParticipantsView.as_view(),
        name="organizer-participants",
    ),


    # =====================================================
    # EVENT-SPECIFIC PARTICIPANTS
    # =====================================================
    #
    # GET
    # /api/registrations/organizer/1/
    #
    # Shows ONLY participants registered for Event 1.
    #
    # =====================================================

    path(
        "organizer/<int:event_id>/",
        OrganizerParticipantsView.as_view(),
        name="organizer-event-participants",
    ),
]