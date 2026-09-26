from datetime import date

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event
from registrations.models import Registration

from .models import Certificate
from .serializers import CertificateSerializer
from .services import generate_certificate_number, generate_certificate_pdf


class GenerateEventCertificatesView(APIView):
    """
    Organizer generates certificates for all eligible
    participants of one completed event.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):

        # ---------------------------------------------
        # 1. Only organizers can generate certificates
        # ---------------------------------------------

        if request.user.role != "organizer":
            return Response(
                {
                    "detail": "Only organizers can generate certificates."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ---------------------------------------------
        # 2. Find the event
        # ---------------------------------------------

        event = get_object_or_404(
            Event,
            id=event_id
        )

        # ---------------------------------------------
        # 3. Organizer can only generate certificates
        #    for their own event
        # ---------------------------------------------

        if event.organizer != request.user:
            return Response(
                {
                    "detail": "You can only generate certificates for your own events."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # ---------------------------------------------
        # 4. Event must be completed
        #
        # For now we consider an event completed when
        # its event date has passed.
        # ---------------------------------------------

        if event.date >= date.today():
            return Response(
                {
                    "detail": "Certificates can only be generated after the event is completed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------
        # 5. Find eligible registrations
        #
        # confirmed = eligible
        # cancelled = not eligible
        # ---------------------------------------------

        registrations = Registration.objects.filter(
            event=event,
            status="confirmed"
        ).select_related(
            "student"
        )

        generated = 0
        regenerated = 0

        # ---------------------------------------------
        # 6. Generate certificate for each student
        # ---------------------------------------------

        for registration in registrations:

            student = registration.student

            # Reuse an existing certificate when one already exists.
            # The PDF is regenerated every time this endpoint is called.
            # This is important when the certificate design/template has
            # been changed: all previously generated certificates are then
            # updated to the latest design without creating duplicates.
            certificate = Certificate.objects.filter(
                registration=registration
            ).first()

            if certificate:
                certificate.student_name = student.name
                certificate.event_title = event.title
                certificate.status = "issued"
                certificate.save(
                    update_fields=[
                        "student_name",
                        "event_title",
                        "status",
                    ]
                )

                generate_certificate_pdf(certificate)
                regenerated += 1
                continue

            certificate = Certificate.objects.create(
                certificate_number=generate_certificate_number(),
                student=student,
                event=event,
                registration=registration,
                student_name=student.name,
                event_title=event.title,
                status="issued",
            )

            # Generate the actual PDF for the new certificate.
            generate_certificate_pdf(certificate)

            generated += 1

        # ---------------------------------------------
        # 7. Return generation summary
        # ---------------------------------------------

        return Response(
            {
                "message": "Certificate generation completed.",
                "event": event.title,
                "generated": generated,
                "regenerated": regenerated,
                "total_eligible": registrations.count(),
            },
            status=status.HTTP_200_OK
        )


class MyCertificatesView(APIView):
    """
    Returns certificates belonging to the logged-in student.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        certificates = Certificate.objects.filter(
            student=request.user
        ).select_related(
            "event"
        )

        serializer = CertificateSerializer(
            certificates,
            many=True,
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class CertificateDetailView(APIView):
    """
    Returns one certificate belonging to the logged-in student.
    """

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
            context={"request": request}
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

# ============================================================
# CERTIFICATE PDF VIEW / DOWNLOAD
# ============================================================

from django.http import FileResponse
from .services import generate_certificate_pdf


class CertificatePDFView(APIView):
    """
    Securely serves a certificate PDF to its owner.

    The PDF is regenerated immediately before serving it.
    This guarantees that an old PDF generated with a previous
    certificate design is never returned after the template/code
    has been changed.
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, download=False):
        certificate = get_object_or_404(
            Certificate,
            id=pk,
            student=request.user,
        )

        # Always regenerate using the CURRENT services.py/template.
        generate_certificate_pdf(certificate)

        if not certificate.certificate_file:
            return Response(
                {"detail": "Certificate PDF is not available."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            file_handle = certificate.certificate_file.open("rb")
        except FileNotFoundError:
            # If the database path exists but the physical file was
            # deleted, generate it once more.
            generate_certificate_pdf(certificate)
            file_handle = certificate.certificate_file.open("rb")

        response = FileResponse(
            file_handle,
            content_type="application/pdf",
        )

        response["Content-Disposition"] = (
            f'{"attachment" if download else "inline"}; '
            f'filename="{certificate.certificate_number}.pdf"'
        )

        response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response["Pragma"] = "no-cache"

        return response


class ViewCertificatePDFView(CertificatePDFView):
    def get(self, request, pk):
        return super().get(request, pk, download=False)


class DownloadCertificatePDFView(CertificatePDFView):
    def get(self, request, pk):
        return super().get(request, pk, download=True)
