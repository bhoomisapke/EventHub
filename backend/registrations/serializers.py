from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(
        source="student.email",
        read_only=True
    )

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

    event_image = serializers.ImageField(
        source="event.image",
        read_only=True
    )

    def get_student_name(self, obj):
        student = obj.student

        full_name = student.get_full_name()

        if full_name:
            return full_name

        return student.email

    class Meta:
        model = Registration

        fields = [
            "id",

            "student",
            "student_name",
            "student_email",

            "event",

            "event_title",
            "event_date",
            "event_time",
            "event_venue",
            "event_image",

            "registration_date",
            "status",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "student_email",
            "registration_date",
            "status",

            "event_title",
            "event_date",
            "event_time",
            "event_venue",
            "event_image",
        ]