from datetime import date

from django.http import FileResponse
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event
from registrations.models import Registration

from .models import Certificate, CertificateConfiguration
from .serializers import (
    CertificateSerializer,
    CertificateConfigurationSerializer,
)
from .services import (
    generate_certificate_number,
    generate_certificate_pdf,
)


# ============================================================
# CERTIFICATE CONFIGURATION
# ============================================================

class CertificateConfigurationView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_event(self, request, event_id):

        event = get_object_or_404(
            Event,
            id=event_id
        )

        if request.user.role != "organizer":
            return None

        if event.organizer != request.user:
            return None

        return event

    # --------------------------------------------------------
    # GET CERTIFICATE INFORMATION
    # --------------------------------------------------------

    def get(self, request, event_id):

        event = self.get_event(
            request,
            event_id
        )

        if event is None:
            return Response(
                {
                    "detail":
                    "You can only manage certificates for your own event."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        config, created = (
            CertificateConfiguration.objects
            .get_or_create(
                event=event
            )
        )

        serializer = CertificateConfigurationSerializer(
            config,
            context={
                "request": request
            }
        )

        data = serializer.data

        # ----------------------------------------------------
        # EVENT DETAILS
        # ----------------------------------------------------

        data["event_title"] = (
            config.event_title
            or event.title
        )

        data["event_type"] = (
            config.event_type
            or event.category
            or ""
        )

        data["event_date"] = (
            config.event_date
            or event.date
        )

        data["event_time"] = str(
            event.time
        )

        data["event_venue"] = (
            config.event_venue
            or event.venue
            or ""
        )

        # ----------------------------------------------------
        # PARTICIPANTS
        # ----------------------------------------------------

        registrations = (
            Registration.objects
            .filter(
                event_id=event.id,
                status="confirmed"
            )
            .select_related("student")
        )

        participants = []

        for registration in registrations:

            student = registration.student

            participants.append(
                {
                    "id": student.id,
                    "name": (
                        getattr(
                            student,
                            "name",
                            ""
                        )
                        or ""
                    ),
                    "email": (
                        getattr(
                            student,
                            "email",
                            ""
                        )
                        or ""
                    ),
                    "status": registration.status,
                }
            )

        data["participants"] = participants

        data["participant_count"] = len(
            participants
        )

        return Response(
            data,
            status=status.HTTP_200_OK
        )

    # --------------------------------------------------------
    # SAVE CERTIFICATE INFORMATION
    # --------------------------------------------------------

    def patch(self, request, event_id):

        event = self.get_event(
            request,
            event_id
        )

        if event is None:
            return Response(
                {
                    "detail":
                    "You can only manage certificates for your own event."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        config, created = (
            CertificateConfiguration.objects
            .get_or_create(
                event=event
            )
        )

        serializer = CertificateConfigurationSerializer(
            config,
            data=request.data,
            partial=True,
            context={
                "request": request
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        # Return fresh configuration
        response_serializer = (
            CertificateConfigurationSerializer(
                config,
                context={
                    "request": request
                }
            )
        )

        data = response_serializer.data

        data["event_title"] = (
            config.event_title
            or event.title
        )

        data["event_type"] = (
            config.event_type
            or event.category
            or ""
        )

        data["event_date"] = (
            config.event_date
            or event.date
        )

        data["event_time"] = str(
            event.time
        )

        data["event_venue"] = (
            config.event_venue
            or event.venue
            or ""
        )

        # ----------------------------------------------------
        # RETURN PARTICIPANTS AFTER SAVE TOO
        # ----------------------------------------------------

        registrations = (
            Registration.objects
            .filter(
                event_id=event.id,
                status="confirmed"
            )
            .select_related("student")
        )

        participants = []

        for registration in registrations:

            student = registration.student

            participants.append(
                {
                    "id": student.id,
                    "name": (
                        getattr(
                            student,
                            "name",
                            ""
                        )
                        or ""
                    ),
                    "email": (
                        getattr(
                            student,
                            "email",
                            ""
                        )
                        or ""
                    ),
                    "status": registration.status,
                }
            )

        data["participants"] = participants

        data["participant_count"] = len(
            participants
        )

        return Response(
            data,
            status=status.HTTP_200_OK
        )


# ============================================================
# GENERATE EVENT CERTIFICATES
# ============================================================

class GenerateEventCertificatesView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):

        # ----------------------------------------------------
        # ORGANIZER CHECK
        # ----------------------------------------------------

        if request.user.role != "organizer":
            return Response(
                {
                    "detail":
                    "Only organizers can generate certificates."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # EVENT
        # ----------------------------------------------------

        event = get_object_or_404(
            Event,
            id=event_id
        )

        # ----------------------------------------------------
        # EVENT OWNER CHECK
        # ----------------------------------------------------

        if event.organizer != request.user:
            return Response(
                {
                    "detail":
                    "You can only generate certificates for your own event."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ----------------------------------------------------
        # EVENT COMPLETED CHECK
        # ----------------------------------------------------

        if event.date >= date.today():
            return Response(
                {
                    "detail":
                    "Certificates can only be generated after the event is completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ----------------------------------------------------
        # CERTIFICATE CONFIGURATION
        # ----------------------------------------------------

        config, created = (
            CertificateConfiguration.objects
            .get_or_create(
                event=event
            )
        )

        # ----------------------------------------------------
        # CONFIRMED PARTICIPANTS
        # ----------------------------------------------------

        registrations = (
            Registration.objects
            .filter(
                event_id=event.id,
                status="confirmed"
            )
            .select_related("student")
        )

        generated = 0
        regenerated = 0

        # ----------------------------------------------------
        # GENERATE CERTIFICATE FOR EACH PARTICIPANT
        # ----------------------------------------------------

        for registration in registrations:

            student = registration.student

            certificate = (
                Certificate.objects
                .filter(
                    registration=registration
                )
                .first()
            )

            # -----------------------------------------------
            # EXISTING CERTIFICATE
            # -----------------------------------------------

            if certificate:

                certificate.student = student
                certificate.event = event
                certificate.student_name = student.name
                certificate.event_title = (
                    config.event_title
                    or event.title
                )
                certificate.status = "issued"

                certificate.save(
                    update_fields=[
                        "student",
                        "event",
                        "student_name",
                        "event_title",
                        "status",
                    ]
                )

                generate_certificate_pdf(
                    certificate
                )

                regenerated += 1

            # -----------------------------------------------
            # NEW CERTIFICATE
            # -----------------------------------------------

            else:

                certificate = (
                    Certificate.objects.create(
                        certificate_number=
                        generate_certificate_number(),

                        student=student,

                        event=event,

                        registration=registration,

                        student_name=
                        student.name,

                        event_title=(
                            config.event_title
                            or event.title
                        ),

                        status="issued",
                    )
                )

                generate_certificate_pdf(
                    certificate
                )

                generated += 1

        # ----------------------------------------------------
        # RESULT
        # ----------------------------------------------------

        return Response(
            {
                "message":
                "Certificate generation completed.",

                "event":
                event.title,

                "generated":
                generated,

                "regenerated":
                regenerated,

                "total_eligible":
                registrations.count(),
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# MY CERTIFICATES
# ============================================================

class MyCertificatesView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        certificates = (
            Certificate.objects
            .filter(
                student=request.user
            )
            .select_related("event")
        )

        serializer = CertificateSerializer(
            certificates,
            many=True,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data
        )


# ============================================================
# CERTIFICATE DETAIL
# ============================================================

class CertificateDetailView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        certificate = get_object_or_404(
            Certificate,
            id=pk,
            student=request.user
        )

        serializer = CertificateSerializer(
            certificate,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data
        )


# ============================================================
# CERTIFICATE PDF
# ============================================================

class CertificatePDFView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(
        self,
        request,
        pk,
        download=False
    ):

        certificate = get_object_or_404(
            Certificate,
            id=pk,
            student=request.user
        )

        generate_certificate_pdf(
            certificate
        )

        file_handle = (
            certificate
            .certificate_file
            .open("rb")
        )

        response = FileResponse(
            file_handle,
            content_type="application/pdf"
        )

        disposition = (
            "attachment"
            if download
            else "inline"
        )

        response["Content-Disposition"] = (
            f'{disposition}; '
            f'filename="{certificate.certificate_number}.pdf"'
        )

        response["Cache-Control"] = (
            "no-store, no-cache, "
            "must-revalidate, max-age=0"
        )

        response["Pragma"] = "no-cache"

        return response


# ============================================================
# VIEW PDF
# ============================================================

class ViewCertificatePDFView(
    CertificatePDFView
):

    def get(self, request, pk):

        return super().get(
            request,
            pk,
            download=False
        )


# ============================================================
# DOWNLOAD PDF
# ============================================================

class DownloadCertificatePDFView(
    CertificatePDFView
):

    def get(self, request, pk):

        return super().get(
            request,
            pk,
            download=True
        )