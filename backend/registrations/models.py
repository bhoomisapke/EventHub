from django.db import models
from django.conf import settings
from events.models import Event


class Registration(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="registrations"
    )

    # Details entered at the time of registration.
    # These are kept separately from the student's profile.
    name = models.CharField(
        max_length=150,
        blank=True,
        default=""
    )

    email = models.EmailField(
        blank=True,
        default=""
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        default=""
    )

    student_number = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    department = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    year = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    registration_date = models.DateTimeField(
        auto_now_add=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="confirmed"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["student", "event"],
                name="unique_student_event_registration"
            )
        ]

        ordering = ["-registration_date"]

    def __str__(self):
        return f"{self.name or self.student.email} - {self.event.title}"