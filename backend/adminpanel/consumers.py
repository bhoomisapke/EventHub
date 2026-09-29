import json

try:
    from channels.generic.websocket import AsyncWebsocketConsumer  # type: ignore[reportMissingModuleSource]
except ImportError:  # pragma: no cover
    class AsyncWebsocketConsumer:  # type: ignore[no-redef]
        def __init__(self, *args, **kwargs):
            raise ImportError(
                "channels is not installed. Install django-channels to use WebSocket consumers."
            )


class AdminNotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "admin_notifications"

        # Add this WebSocket connection to the admin group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        print("✅ Admin WebSocket connected")

        # Send connection confirmation to frontend
        await self.send(
            text_data=json.dumps({
                "type": "connection",
                "message": "Admin notifications connected",
            })
        )

    async def disconnect(self, close_code):
        # Remove connection from admin group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

        print("⚠️ Admin WebSocket disconnected")

    async def notification_message(self, event):
        # Receive notification from Django channel layer
        notification = event.get("notification")

        if not notification:
            return

        print(
            "📢 Sending admin notification:",
            notification
        )

        # Send notification to React
        await self.send(
            text_data=json.dumps({
                "type": "notification",
                "notification": notification,
            })
        )