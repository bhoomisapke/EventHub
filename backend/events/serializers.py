from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):

    # Frontend field name -> backend field name
    organizerName = serializers.CharField(
        source="organizer_name",
        required=False,
        allow_blank=True
    )

    registrationFee = serializers.DecimalField(
        source="registration_fee",
        max_digits=10,
        decimal_places=2,
        required=False,
        default=0
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
            "organizerName",
            "registrationFee",
            "registrationDeadline",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]