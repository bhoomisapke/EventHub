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

    event_category = serializers.CharField(
        source="registration.event.category",
        read_only=True
    )

    event_image = serializers.SerializerMethodField()

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
            "event_category",
            "event_image",
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
            "event_category",
            "event_image",
        ]

    def get_event_image(self, obj):
        event = obj.registration.event

        if not event.image:
            return None

        try:
            url = event.image.url
        except Exception:
            url = str(event.image)

        request = self.context.get("request")

        if request and url.startswith("/"):
            return request.build_absolute_uri(url)

        return url