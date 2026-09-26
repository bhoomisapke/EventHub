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

        # Only students can register.
        if getattr(student, "role", None) != "student":
            raise ValidationError({
                "detail": "Only students can register for events."
            })

        event = serializer.validated_data["event"]

        # Prevent duplicate registration.
        existing_registration = Registration.objects.filter(
            student=student,
            event=event
        ).first()

        if existing_registration:

            if existing_registration.status == "confirmed":
                raise ValidationError({
                    "detail": "You are already registered for this event."
                })

            # If an old registration was cancelled,
            # allow the student to register again.
            existing_registration.status = "confirmed"

            # Update registration details.
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

            # Create a ticket again if necessary.
            create_ticket(existing_registration)

            return

        # Create completely new registration.
        registration = serializer.save(
            student=student
        )

        # Automatically generate ticket.
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
            registration = Registration.objects.select_related(
                "event"
            ).get(
                pk=pk,
                student=request.user
            )

        except Registration.DoesNotExist:

            return Response(
                {
                    "detail": "Registration not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Already cancelled
        if registration.status == "cancelled":

            return Response(
                {
                    "detail": "This registration is already cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cancel registration
        registration.status = "cancelled"

        registration.save(
            update_fields=["status"]
        )

        # Cancel connected ticket
        try:

            ticket = registration.ticket

            ticket.status = "cancelled"

            ticket.save(
                update_fields=["status"]
            )

        except Exception:
            # Registration cancellation should still succeed
            # if a ticket does not exist.
            pass

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

        # ----------------------------------------------------
        # ORGANIZER ROLE CHECK
        # ----------------------------------------------------

        if getattr(organizer, "role", None) != "organizer":
            return Response(
                {
                    "detail": "Only organizers can view participants."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # GET REGISTRATIONS
        # ----------------------------------------------------

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

        # ----------------------------------------------------
        # OPTIONAL EVENT FILTER
        # ----------------------------------------------------

        if event_id is not None:
            registrations = registrations.filter(
                event_id=event_id
            )

        # ----------------------------------------------------
        # RESPONSE DATA
        # ----------------------------------------------------

        participants = []

        for registration in registrations:

            student = registration.student
            event = registration.event

            # Registration-time name has priority.
            student_name = (
                registration.name
                or getattr(student, "name", None)
                or getattr(student, "full_name", None)
                or getattr(student, "username", None)
                or getattr(student, "email", None)
                or "Unknown Student"
            )

            # Registration-time email has priority.
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