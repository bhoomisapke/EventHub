from django.db import models


class Event(models.Model):
    STATUS_CHOICES = [
        ("upcoming", "Upcoming"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    title = models.CharField(max_length=255)

    description = models.TextField(
        blank=True,
        null=True
    )

    # Stores the actual uploaded event image
    image = models.ImageField(
        upload_to="events/",
        blank=True,
        null=True
    )

    category = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    date = models.DateField()

    time = models.TimeField(
        blank=True,
        null=True
    )

    venue = models.CharField(max_length=255)

    capacity = models.PositiveIntegerField()

    # Participation type
    participation_type = models.CharField(
        max_length=20,
        choices=[
            ("individual", "Individual"),
            ("group", "Group"),
        ],
        default="individual"
    )

    # Team size for group events
    min_team_size = models.PositiveIntegerField(
        default=1
    )

    max_team_size = models.PositiveIntegerField(
        default=1
    )

    registration_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    registration_deadline = models.DateField(
        blank=True,
        null=True
    )

    organizer_name = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    organizer_mobile = models.CharField(
        max_length=10,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="upcoming"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title