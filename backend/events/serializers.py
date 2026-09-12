from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):

    organizer_name = serializers.CharField(
        source="organizer.name",
        read_only=True
    )

    image_url = serializers.SerializerMethodField()

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
            "registration_deadline",
            "organizer",
            "organizer_name",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "organizer",
            "organizer_name",
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