from rest_framework import serializers

from events.models import Event
from registrations.models import Registration

from .models import Certificate, CertificateConfiguration


class CertificateSerializer(serializers.ModelSerializer):
    event_date = serializers.DateField(
        source="event.date",
        read_only=True
    )

    event_venue = serializers.CharField(
        source="event.venue",
        read_only=True
    )

    certificate_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate

        fields = [
            "id",
            "certificate_number",
            "student_name",
            "event_title",
            "event_date",
            "event_venue",
            "issued_at",
            "status",
            "certificate_url",
        ]

        read_only_fields = fields

    def get_certificate_url(self, obj):
        if not obj.certificate_file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.certificate_file.url
            )

        return obj.certificate_file.url


class CertificateConfigurationSerializer(
    serializers.ModelSerializer
):
    # Event time comes from Event, not CertificateConfiguration.
    event_time = serializers.TimeField(
        source="event.time",
        read_only=True
    )

    # Confirmed students are automatically fetched.
    participants = serializers.SerializerMethodField()

    participant_count = serializers.SerializerMethodField()

    class Meta:
        model = CertificateConfiguration

        fields = [
            "id",
            "event",

            # Institute
            "institute_name",
            "department_name",
            "institute_logo",

            # Certificate wording
            "certificate_heading",
            "certificate_subheading",
            "presentation_text",
            "participation_text",
            "organized_by_text",

            # Event
            "event_title",
            "event_type",
            "event_venue",
            "event_date",
            "event_time",

            # Sponsor
            "sponsor_name",
            "sponsor_logo",

            # Coordinator
            "coordinator_name",
            "coordinator_designation",
            "coordinator_signature",

            # Head
            "head_name",
            "head_designation",
            "head_signature",

            # Automatically fetched students
            "participants",
            "participant_count",

            "updated_at",
        ]

        read_only_fields = [
            "id",
            "event",
            "event_time",
            "participants",
            "participant_count",
            "updated_at",
        ]

    def get_participants(self, obj):
        registrations = (
            Registration.objects
            .filter(
                event=obj.event,
                status="confirmed"
            )
            .select_related("student")
        )

        participants = []

        for registration in registrations:
            student = registration.student

            participants.append({
                "id": student.id,
                "name": getattr(
                    student,
                    "name",
                    ""
                ) or "",
            })

        return participants

    def get_participant_count(self, obj):
        return (
            Registration.objects
            .filter(
                event=obj.event,
                status="confirmed"
            )
            .count()
        )