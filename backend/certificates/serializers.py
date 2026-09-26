from rest_framework import serializers
from .models import Certificate


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