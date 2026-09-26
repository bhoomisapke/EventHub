from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):

    event_title = serializers.CharField(
        source="event.title",
        read_only=True
    )

    event_date = serializers.DateField(
        source="event.date",
        read_only=True
    )

    event_time = serializers.TimeField(
        source="event.time",
        read_only=True
    )

    event_venue = serializers.CharField(
        source="event.venue",
        read_only=True
    )
    student_id = serializers.CharField(
        source="student_number",
        required=False,
        allow_blank=True
    )

    class Meta:
        model = Registration

        fields = [
            "id",
            "student",
            "event",

            "event_title",
            "event_date",
            "event_time",
            "event_venue",

            "name",
            "email",
            "phone",
            "student_id",
            "department",
            "year",

            "registration_date",
            "status",
        ]

        read_only_fields = [
            "id",
            "student",
            "event_title",
            "event_date",
            "event_time",
            "event_venue",
            "registration_date",
            "status",
        ]

    def validate_email(self, value):
        return value.strip().lower()

    def validate_name(self, value):
        return value.strip()

    def validate_phone(self, value):
        return value.strip()

    def validate_student_number(self, value):
        return value.strip()

    def validate_department(self, value):
        return value.strip()

    def validate_year(self, value):
        return value.strip()