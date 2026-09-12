from django.conf import settings
from django.db import models


class Event(models.Model):

    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
        ("cancelled", "Cancelled"),
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    image = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True
    )

    category = models.CharField(max_length=100)

    date = models.DateField()

    time = models.TimeField()

    venue = models.CharField(max_length=200)

    capacity = models.PositiveIntegerField(default=0)

    registration_deadline = models.DateField(
        blank=True,
        null=True
    )

    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="events"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="published"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title