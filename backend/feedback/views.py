from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def perform_create(self, serializer):
        if self.request.user.role != "student":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "Only students can submit feedback."
            )

        serializer.save(student=self.request.user)


class MyFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return (
            Feedback.objects
            .filter(student=self.request.user)
            .select_related("event", "student")
            .order_by("-created_at")
        )


class OrganizerFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        organizer = self.request.user

        if organizer.role != "organizer":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "Only organizers can view feedback."
            )

        return (
            Feedback.objects
            .filter(event__organizer=organizer)
            .select_related("event", "student")
            .order_by("-created_at")
        )