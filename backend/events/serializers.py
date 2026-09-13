
from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):

    organizer_name = serializers.CharField(
        source="organizer.name",
        read_only=True
    )

    # Keep local image URL functionality
    image_url = serializers.SerializerMethodField()

    # GitHub fields
    organizerName = serializers.CharField(
        source="organizer.name",
        read_only=True
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
            "image_url",
            "category",
            "date",
            "time",
            "venue",
            "capacity",

            "participationType",
            "minTeamSize",
            "maxTeamSize",

            "organizer",
            "organizer_name",
            "organizerName",
            "organizerMobile",

            "registrationFee",
            "registrationDeadline",

            "registration_deadline",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "organizer",
            "organizer_name",
            "organizerName",
            "created_at",
            "updated_at",
            "image_url",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if not obj.image:
            return None

        url = obj.image.url

        if request:
            return request.build_absolute_uri(url)

        return url

