from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class MyFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Feedback.objects.filter(
            student=self.request.user
        )