from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    event_date = serializers.DateField(source="event.date", read_only=True)
    event_time = serializers.TimeField(source="event.time", read_only=True)
    event_venue = serializers.CharField(source="event.venue", read_only=True)

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
            "registration_date",
            "status",
        ]
        read_only_fields = [
            "id",
            "student",
            "registration_date",
            "status",
            "event_title",
            "event_date",
            "event_time",
            "event_venue",
        ]