from django.db import models
from registrations.models import Registration


class Ticket(models.Model):
    STATUS_CHOICES = [
        ("valid", "Valid"),
        ("used", "Used"),
        ("cancelled", "Cancelled"),
    ]

    registration = models.OneToOneField(
        Registration,
        on_delete=models.CASCADE,
        related_name="ticket"
    )

    ticket_number = models.CharField(
        max_length=30,
        unique=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="valid"
    )

    generated_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.ticket_number} - {self.registration.student.email}"