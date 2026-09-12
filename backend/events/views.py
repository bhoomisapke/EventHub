from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Event
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.all().order_by("-created_at")

    serializer_class = EventSerializer

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]