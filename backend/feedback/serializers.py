from rest_framework import serializers
from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = [
            "id",
            "student",
            "event",
            "rating",
            "feedback_text",
            "liked_things",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value