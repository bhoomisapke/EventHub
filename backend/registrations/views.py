from datetime import datetime

from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from tickets.services import create_ticket

from .models import Registration
from .serializers import RegistrationSerializer


# ============================================================
# CREATE REGISTRATION
# ============================================================

class RegistrationCreateView(generics.CreateAPIView):

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = RegistrationSerializer

    def perform_create(self, serializer):

        student = self.request.user

        if getattr(student, "role", None) != "student":
            raise ValidationError({
                "detail": "Only students can register for events."
            })

        event = serializer.validated_data["event"]

        existing_registration = Registration.objects.filter(
            student=student,
            event=event
        ).first()

        if existing_registration:

            if existing_registration.status == "confirmed":
                raise ValidationError({
                    "detail": "You are already registered for this event."
                })

            # Do not allow re-registration after the event date.
            today = timezone.localdate()

            if event.date < today:
                raise ValidationError({
                    "detail": (
                        "You cannot register for an event "
                        "that has already ended."
                    )
                })

            if event.status == "cancelled":
                raise ValidationError({
                    "detail": "You cannot register for a cancelled event."
                })

            existing_registration.status = "confirmed"

            existing_registration.name = serializer.validated_data.get(
                "name",
                existing_registration.name
            )

            existing_registration.email = serializer.validated_data.get(
                "email",
                existing_registration.email
            )

            existing_registration.phone = serializer.validated_data.get(
                "phone",
                existing_registration.phone
            )

            existing_registration.student_number = serializer.validated_data.get(
                "student_number",
                existing_registration.student_number
            )

            existing_registration.department = serializer.validated_data.get(
                "department",
                existing_registration.department
            )

            existing_registration.year = serializer.validated_data.get(
                "year",
                existing_registration.year
            )

            existing_registration.save()

            create_ticket(existing_registration)

            return

        # ----------------------------------------------------
        # CANCELLED EVENT
        # ----------------------------------------------------

        if event.status == "cancelled":
            raise ValidationError({
                "detail": "You cannot register for a cancelled event."
            })

        # ----------------------------------------------------
        # PAST EVENT
        # ----------------------------------------------------

        today = timezone.localdate()

        if event.date < today:
            raise ValidationError({
                "detail": (
                    "You cannot register for an event "
                    "that has already ended."
                )
            })

        # ----------------------------------------------------
        # CREATE REGISTRATION
        # ----------------------------------------------------

        registration = serializer.save(
            student=student
        )

        create_ticket(registration)


# ============================================================
# MY REGISTRATIONS
# ============================================================

class MyRegistrationsView(generics.ListAPIView):

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = RegistrationSerializer

    def get_queryset(self):

        return (
            Registration.objects
            .filter(student=self.request.user)
            .select_related("event")
        )


# ============================================================
# REGISTRATION DETAIL
# ============================================================

class RegistrationDetailView(generics.RetrieveAPIView):

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    serializer_class = RegistrationSerializer

    def get_queryset(self):

        return (
            Registration.objects
            .filter(student=self.request.user)
            .select_related("event")
        )


# ============================================================
# CANCEL REGISTRATION
# ============================================================

class CancelRegistrationView(APIView):

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request, pk):

        try:

            registration = (
                Registration.objects
                .select_related("event")
                .get(
                    pk=pk,
                    student=request.user
                )
            )

        except Registration.DoesNotExist:

            return Response(
                {
                    "detail": "Registration not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        event = registration.event

        # ----------------------------------------------------
        # ALREADY CANCELLED
        # ----------------------------------------------------

        if registration.status == "cancelled":

            return Response(
                {
                    "detail": "This registration is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # CANCELLED EVENT
        # ----------------------------------------------------

        if event.status == "cancelled":

            return Response(
                {
                    "detail": (
                        "This event has been cancelled. "
                        "Your registration cannot be cancelled manually."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # PAST EVENT
        #
        # Cancellation is allowed on the event day.
        # Cancellation is blocked from the next day.
        # ----------------------------------------------------

        today = timezone.localdate()

        if event.date < today:

            return Response(
                {
                    "detail": (
                        "Registration cannot be cancelled "
                        "because this event has already ended."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # CANCEL REGISTRATION
        # ----------------------------------------------------

        registration.status = "cancelled"

        registration.save(
            update_fields=["status"]
        )

        # ----------------------------------------------------
        # CANCEL CONNECTED TICKET
        # ----------------------------------------------------

        try:

            ticket = registration.ticket

            ticket.status = "cancelled"

            ticket.save(
                update_fields=["status"]
            )

        except Exception:
            pass

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return Response(
            {
                "message": "Registration cancelled successfully.",

                "registration": RegistrationSerializer(
                    registration,
                    context={"request": request}
                ).data,
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# ORGANIZER PARTICIPANTS
# ============================================================

class OrganizerParticipantsView(APIView):

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, event_id=None):

        organizer = request.user

        if getattr(organizer, "role", None) != "organizer":

            return Response(
                {
                    "detail": "Only organizers can view participants."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        registrations = (
            Registration.objects
            .select_related(
                "student",
                "event"
            )
            .filter(
                event__organizer=organizer
            )
            .order_by("-registration_date")
        )

        if event_id is not None:

            registrations = registrations.filter(
                event_id=event_id
            )

        participants = []

        for registration in registrations:

            student = registration.student
            event = registration.event

            student_name = (
                registration.name
                or getattr(student, "name", None)
                or getattr(student, "full_name", None)
                or getattr(student, "username", None)
                or getattr(student, "email", None)
                or "Unknown Student"
            )

            student_email = (
                registration.email
                or getattr(student, "email", None)
                or ""
            )

            participants.append(
                {
                    "id": registration.id,

                    "student": student.id,

                    "student_name": student_name,

                    "student_email": student_email,

                    "event": event.id,

                    "event_title": getattr(
                        event,
                        "title",
                        "Event"
                    ),

                    "event_date": getattr(
                        event,
                        "date",
                        None
                    ),

                    "event_time": getattr(
                        event,
                        "time",
                        None
                    ),

                    "event_venue": getattr(
                        event,
                        "venue",
                        ""
                    ),

                    "registration_date":
                        registration.registration_date,

                    "status": registration.status,

                    "phone": registration.phone,

                    "student_number":
                        registration.student_number,

                    "department":
                        registration.department,

                    "year":
                        registration.year,
                }
            )

        return Response(
            participants,
            status=status.HTTP_200_OK
        )