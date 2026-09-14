from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import TokenAuthentication

from tickets.services import create_ticket

from .models import Registration
from .serializers import RegistrationSerializer


# =====================================================
# CREATE REGISTRATION
# =====================================================

class RegistrationCreateView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        student = self.request.user

        # -------------------------------------------------
        # ONLY STUDENTS CAN REGISTER
        # -------------------------------------------------

        if student.role != "student":
            raise ValidationError(
                {
                    "detail": "Only students can register for events."
                }
            )

        event = serializer.validated_data["event"]

        # -------------------------------------------------
        # PREVENT DUPLICATE REGISTRATION
        # -------------------------------------------------

        if Registration.objects.filter(
            student=student,
            event=event
        ).exists():

            raise ValidationError(
                {
                    "detail": "You are already registered for this event."
                }
            )

        # -------------------------------------------------
        # SAVE REGISTRATION
        # -------------------------------------------------

        registration = serializer.save(
            student=student
        )

        # -------------------------------------------------
        # CREATE TICKET AUTOMATICALLY
        # -------------------------------------------------

        create_ticket(registration)


# =====================================================
# MY REGISTRATIONS
# =====================================================

class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Registration.objects
            .filter(
                student=self.request.user
            )
            .select_related("event")
            .order_by("-registration_date")
        )


# =====================================================
# ORGANIZER PARTICIPANTS
# =====================================================

class OrganizerParticipantsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        organizer = self.request.user

        # -------------------------------------------------
        # ONLY ORGANIZERS CAN VIEW PARTICIPANTS
        # -------------------------------------------------

        if organizer.role != "organizer":
            raise ValidationError(
                {
                    "detail": "Only organizers can view participants."
                }
            )

        # -------------------------------------------------
        # GET EVENT ID
        # -------------------------------------------------
        #
        # If event_id exists:
        #
        # /api/registrations/organizer/1/
        #
        # → only Event 1 participants
        #
        # If event_id does not exist:
        #
        # /api/registrations/organizer/
        #
        # → all participants from organizer's events
        # -------------------------------------------------

        event_id = self.kwargs.get("event_id")

        # =================================================
        # EVENT-SPECIFIC PARTICIPANTS
        # =================================================

        if event_id is not None:

            return (
                Registration.objects
                .filter(
                    event_id=event_id,
                    event__organizer=organizer
                )
                .select_related(
                    "student",
                    "event"
                )
                .order_by(
                    "-registration_date"
                )
            )

        # =================================================
        # ALL PARTICIPANTS
        # =================================================

        return (
            Registration.objects
            .filter(
                event__organizer=organizer
            )
            .select_related(
                "student",
                "event"
            )
            .order_by(
                "-registration_date"
            )
        )