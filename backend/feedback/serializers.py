from rest_framework import serializers

from .models import Feedback


class FeedbackSerializer(serializers.ModelSerializer):

    student_name = serializers.SerializerMethodField()
    student_email = serializers.EmailField(
        source="student.email",
        read_only=True
    )

    event_title = serializers.CharField(
        source="event.title",
        read_only=True
    )

    class Meta:
        model = Feedback

        fields = [
            "id",
            "student",
            "student_name",
            "student_email",
            "event",
            "event_title",
            "rating",
            "feedback_text",
            "liked_things",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "student_email",
            "event_title",
            "created_at",
            "updated_at",
        ]

    def get_student_name(self, obj):
        student = obj.student

        full_name = student.get_full_name()

        if full_name:
            return full_name

        return student.email
        

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(
                "Rating must be between 1 and 5."
            )

        return value