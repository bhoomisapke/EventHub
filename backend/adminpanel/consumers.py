import json

from channels.generic.websocket import AsyncWebsocketConsumer


class AdminNotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time admin notifications.
    """

    async def connect(self):
        # All connected admin browsers join this group.
        self.group_name = "admin_notifications"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        # Tell the frontend that the WebSocket connected successfully.
        await self.send(
            text_data=json.dumps(
                {
                    "type": "connection",
                    "message": "Admin notifications connected",
                }
            )
        )

    async def disconnect(self, close_code):
        # Remove this browser from the notification group.
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def notification_message(self, event):
        """
        Receives a notification event from Django Channels
        and sends it to the React admin panel.
        """

        await self.send(
            text_data=json.dumps(
                {
                    "type": "notification",
                    "notification": event.get(
                        "notification",
                        {},
                    ),
                }
            )
        )