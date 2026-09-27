from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from events.models import Event
from registrations.models import Registration

from .notification_service import create_admin_notification


User = get_user_model()


# ============================================================
# NEW USER
# ============================================================

@receiver(post_save, sender=User)
def user_created_notification(
    sender,
    instance,
    created,
    **kwargs,
):
    if not created:
        return

    # Do not create a notification for a newly created admin.
    if instance.is_superuser:
        return

    user_name = (
        instance.name
        or instance.email
        or "New user"
    )

    role = (
        instance.role.capitalize()
        if instance.role
        else "User"
    )

    create_admin_notification(
        notification_type="user",
        title="New User Registered",
        message=(
            f"{user_name} registered as a {role}."
        ),
    )


# ============================================================
# NEW EVENT
# ============================================================

@receiver(post_save, sender=Event)
def event_created_notification(
    sender,
    instance,
    created,
    **kwargs,
):
    if not created:
        return

    organizer_name = (
        instance.organizer.name
        or instance.organizer.email
        or "Organizer"
    )

    create_admin_notification(
        notification_type="event",
        title="New Event Created",
        message=(
            f"{organizer_name} created "
            f"the event '{instance.title}'."
        ),
    )


# ============================================================
# NEW REGISTRATION
# ============================================================

@receiver(post_save, sender=Registration)
def registration_created_notification(
    sender,
    instance,
    created,
    **kwargs,
):
    if not created:
        return

    student_name = (
        instance.name
        or instance.student.name
        or instance.student.email
        or "A student"
    )

    event_title = (
        instance.event.title
        or "an event"
    )

    create_admin_notification(
        notification_type="registration",
        title="New Registration",
        message=(
            f"{student_name} registered for "
            f"'{event_title}'."
        ),
    )