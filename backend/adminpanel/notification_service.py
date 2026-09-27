from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from django.contrib.auth import get_user_model

from .models import Notification


User = get_user_model()


def create_admin_notification(
    notification_type,
    title,
    message,
):
    """
    Create a notification for every admin/superuser
    and immediately send it through WebSocket.
    """

    admins = User.objects.filter(
        is_superuser=True,
        is_active=True,
    )

    channel_layer = get_channel_layer()

    for admin_user in admins:

        notification = Notification.objects.create(
            recipient=admin_user,
            notification_type=notification_type,
            title=title,
            message=message,
        )

        notification_data = {
            "id": notification.id,
            "type": notification.notification_type,
            "title": notification.title,
            "message": notification.message,
            "is_read": notification.is_read,
            "created_at": notification.created_at.isoformat(),
        }

        if channel_layer:
            async_to_sync(
                channel_layer.group_send
            )(
                "admin_notifications",
                {
                    "type": "notification_message",
                    "notification": notification_data,
                },
            )