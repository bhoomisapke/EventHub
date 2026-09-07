from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):

    # Accept frontend names
    organizerName = serializers.CharField(
        source="organizer_name",
        required=False,
        allow_blank=True
    )

    registrationFee = serializers.CharField(
        source="registration_fee",
        required=False,
        allow_blank=True
    )

    registrationDeadline = serializers.DateField(
        source="registration_deadline",
        required=False,
        allow_null=True
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "image",
            "category",
            "date",
            "time",
            "venue",
            "capacity",

            # frontend names
            "organizerName",
            "registrationFee",
            "registrationDeadline",

            # backend fields
            "status",
            "created_at",
            "updated_at",
        ]