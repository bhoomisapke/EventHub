from rest_framework import serializers
from .models import Event


class EventSerializer(serializers.ModelSerializer):

    # Frontend field name -> backend field name
    organizerName = serializers.CharField(
        source="organizer_name",
        required=False,
        allow_blank=True
    )

    organizerMobile = serializers.CharField(
        source="organizer_mobile",
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

    # Participation fields
    participationType = serializers.ChoiceField(
        source="participation_type",
        choices=["individual", "group"],
        required=False,
        default="individual"
    )

    minTeamSize = serializers.IntegerField(
        source="min_team_size",
        required=False,
        default=1,
        min_value=1
    )

    maxTeamSize = serializers.IntegerField(
        source="max_team_size",
        required=False,
        default=1,
        min_value=1
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

            "participationType",
            "minTeamSize",
            "maxTeamSize",

            "organizerName",
            "organizerMobile",
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