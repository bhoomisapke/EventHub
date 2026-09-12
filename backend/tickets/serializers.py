from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(
        source="registration.event.title",
        read_only=True
    )

    event_date = serializers.DateField(
        source="registration.event.date",
        read_only=True
    )

    event_time = serializers.TimeField(
        source="registration.event.time",
        read_only=True
    )

    event_venue = serializers.CharField(
        source="registration.event.venue",
        read_only=True
    )

    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_number",
            "status",
            "generated_at",
            "event_title",
            "event_date",
            "event_time",
            "event_venue",
        ]

        read_only_fields = [
            "id",
            "ticket_number",
            "status",
            "generated_at",
            "event_title",
            "event_date",
            "event_time",
            "event_venue",
        ]