from django.db import models
from django.conf import settings
from events.models import Event


class Feedback(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedbacks"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="feedbacks"
    )

    rating = models.PositiveSmallIntegerField()

    feedback_text = models.TextField()

    liked_things = models.JSONField(
        default=list,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.email} - {self.event.title} - {self.rating}/5"