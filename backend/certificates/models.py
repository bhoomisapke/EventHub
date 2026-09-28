from django.db import models
from django.conf import settings
from events.models import Event
from registrations.models import Registration


class Certificate(models.Model):

    STATUS_CHOICES = [
        ("issued", "Issued"),
        ("revoked", "Revoked"),
    ]

    certificate_number = models.CharField(max_length=40, unique=True)

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

    student_name = models.CharField(max_length=150)
    event_title = models.CharField(max_length=255)
    issued_at = models.DateTimeField(auto_now_add=True)

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


class CertificateConfiguration(models.Model):
    """One editable certificate configuration per event.

    The visual certificate design remains fixed. These fields control
    the information printed into the existing design.
    """

    event = models.OneToOneField(
        Event,
        on_delete=models.CASCADE,
        related_name="certificate_configuration"
    )

    # Institute / official issuer
    institute_name = models.CharField(max_length=255, blank=True)
    department_name = models.CharField(max_length=255, blank=True)
    institute_logo = models.ImageField(
        upload_to="certificate_assets/institute/",
        blank=True,
        null=True
    )

    # Certificate wording
    certificate_heading = models.CharField(
        max_length=100,
        default="CERTIFICATE",
        blank=True
    )
    certificate_subheading = models.CharField(
        max_length=100,
        default="OF PARTICIPATION",
        blank=True
    )
    presentation_text = models.CharField(
        max_length=255,
        default="THIS CERTIFICATE IS PROUDLY PRESENTED TO",
        blank=True
    )
    participation_text = models.CharField(
        max_length=255,
        default="for actively participating in the event",
        blank=True
    )
    organized_by_text = models.CharField(
        max_length=255,
        default="organized by EventHub, College Events.",
        blank=True
    )

    # Event information. Blank values fall back to the Event record.
    event_title = models.CharField(max_length=255, blank=True)
    event_type = models.CharField(max_length=100, blank=True)
    event_venue = models.CharField(max_length=255, blank=True)
    event_date = models.DateField(blank=True, null=True)

    # Sponsor
    sponsor_name = models.CharField(max_length=255, blank=True)
    sponsor_logo = models.ImageField(
        upload_to="certificate_assets/sponsors/",
        blank=True,
        null=True
    )

    # Signatories
    coordinator_name = models.CharField(max_length=150, blank=True)
    coordinator_designation = models.CharField(
        max_length=150,
        default="Event Coordinator",
        blank=True
    )
    coordinator_signature = models.ImageField(
        upload_to="certificate_assets/signatures/",
        blank=True,
        null=True
    )

    head_name = models.CharField(max_length=150, blank=True)
    head_designation = models.CharField(
        max_length=150,
        default="Head of Department",
        blank=True
    )
    head_signature = models.ImageField(
        upload_to="certificate_assets/signatures/",
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Certificate Configuration"
        verbose_name_plural = "Certificate Configurations"

    def __str__(self):
        return f"Certificate configuration - {self.event.title}"
