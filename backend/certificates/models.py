from django.db import models
from django.conf import settings
from events.models import Event
from registrations.models import Registration


class Certificate(models.Model):

    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("revoked", "Revoked"),
    ]

    certificate_number = models.CharField(
        max_length=40,
        unique=True
    )

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="certificates"
    )

    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="certificate"
    )

    # Snapshot values at the time certificate is generated
    student_name = models.CharField(
        max_length=150
    )

    event_title = models.CharField(
        max_length=255
    )

    issued_at = models.DateTimeField(
        auto_now_add=True
    )

    certificate_file = models.FileField(
        upload_to="certificates/",
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="issued"
    )

    class Meta:
        ordering = ["-issued_at"]

    def __str__(self):
        return f"{self.certificate_number} - {self.student_name}"