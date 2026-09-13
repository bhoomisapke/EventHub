from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event
from .serializers import EventSerializer
from .permissions import IsOrganizerOwnerOrReadOnly


class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.select_related("organizer").all()

    serializer_class = EventSerializer

    authentication_classes = [
        TokenAuthentication
    ]

    permission_classes = [
        IsOrganizerOwnerOrReadOnly
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    # ==========================================================
    # CREATE EVENT
    # ==========================================================

    def perform_create(self, serializer):
        serializer.save(
            organizer=self.request.user
        )

    # ==========================================================
    # GET EVENTS
    # ==========================================================

    def get_queryset(self):

        queryset = Event.objects.select_related(
            "organizer"
        ).all()

        # ------------------------------------------------------
        # PUBLIC EVENT LIST
        # GET /api/events/
        #
        # Students see published events.
        # ------------------------------------------------------

        if self.action == "list":
            return queryset.filter(
                status="published"
            )

        return queryset

    # ==========================================================
    # MY EVENTS
    # GET /api/events/my/
    #
    # Returns ONLY events created by the logged-in organizer.
    # ==========================================================

    @action(
        detail=False,
        methods=["get"],
        url_path="my",
        permission_classes=[IsAuthenticated],
        authentication_classes=[TokenAuthentication],
    )
    def my_events(self, request):

        # Make sure only organizers can access this endpoint
        if request.user.role != "organizer":
            return Response(
                {
                    "message": "Only organizers can access their events."
                },
                status=403,
            )

        events = Event.objects.select_related(
            "organizer"
        ).filter(
            organizer=request.user
        ).order_by(
            "-created_at"
        )

        serializer = self.get_serializer(
            events,
            many=True
        )

        return Response(
            serializer.data
        )