from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Registration
from .serializers import RegistrationSerializer


class RegistrationCreateView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        student = self.request.user

        # Only students can register for events
        if student.role != "student":
            raise ValidationError(
                {"detail": "Only students can register for events."}
            )

        event = serializer.validated_data["event"]

        # Prevent duplicate registration
        if Registration.objects.filter(
            student=student,
            event=event
        ).exists():
            raise ValidationError(
                {"detail": "You are already registered for this event."}
            )

        serializer.save(student=student)


class MyRegistrationsView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Registration.objects.filter(
            student=self.request.user
        ).select_related("event")