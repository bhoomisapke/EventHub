from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.parsers import (
    JSONParser,
    MultiPartParser,
    FormParser,
)
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny,
)
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event, Category
from .serializers import EventSerializer, CategorySerializer
from .permissions import IsOrganizerOwnerOrReadOnly


# ==========================================================
# EVENT VIEWSET
# ==========================================================

class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.select_related(
        "organizer"
    ).all()

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

    # ======================================================
    # CREATE EVENT
    # ======================================================

    def perform_create(self, serializer):

        serializer.save(
            organizer=self.request.user
        )

    # ======================================================
    # GET EVENTS
    # ======================================================

    def get_queryset(self):

        queryset = Event.objects.select_related(
            "organizer"
        ).all()

        # --------------------------------------------------
        # PUBLIC EVENT LIST
        #
        # GET /api/events/
        #
        # Students/public users see published events.
        # --------------------------------------------------

        if self.action == "list":

            return queryset.filter(
                status="published"
            )

        return queryset

    # ======================================================
    # MY EVENTS
    #
    # GET /api/events/my/
    #
    # Returns ONLY events created by the logged-in organizer.
    # ======================================================

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
                    "message": (
                        "Only organizers can access "
                        "their events."
                    )
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


# ==========================================================
# CATEGORY VIEWSET
# ==========================================================

class CategoryViewSet(viewsets.ModelViewSet):

    serializer_class = CategorySerializer

    authentication_classes = [
        TokenAuthentication
    ]

    # ------------------------------------------------------
    # ADMIN CATEGORY API
    #
    # These endpoints require an admin user.
    #
    # GET     /api/events/categories/
    # POST    /api/events/categories/
    # PUT     /api/events/categories/<id>/
    # PATCH   /api/events/categories/<id>/
    # DELETE  /api/events/categories/<id>/
    # ------------------------------------------------------

    permission_classes = [
        IsAdminUser
    ]

    # ======================================================
    # CATEGORY QUERYSET
    # ======================================================

    def get_queryset(self):

        categories = Category.objects.all()

        # --------------------------------------------------
        # SEARCH
        #
        # /api/events/categories/?search=technology
        # --------------------------------------------------

        search = self.request.query_params.get(
            "search"
        )

        if search:

            categories = categories.filter(
                name__icontains=search
            )

        # --------------------------------------------------
        # STATUS FILTER
        #
        # ?status=active
        # ?status=inactive
        # --------------------------------------------------

        status = self.request.query_params.get(
            "status"
        )

        if status == "active":

            categories = categories.filter(
                is_active=True
            )

        elif status == "inactive":

            categories = categories.filter(
                is_active=False
            )

        return categories

    # ======================================================
    # ADMIN CATEGORY LIST
    #
    # GET /api/events/categories/
    # ======================================================

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        categories = self.get_queryset()

        serializer = self.get_serializer(
            categories,
            many=True
        )

        data = serializer.data

        # Add event count for every category
        for item in data:

            item["event_count"] = Event.objects.filter(
                category__iexact=item["name"]
            ).count()

        return Response(
            data
        )

    # ======================================================
    # ADMIN CATEGORY DETAIL
    #
    # GET /api/events/categories/<id>/
    # ======================================================

    def retrieve(
        self,
        request,
        *args,
        **kwargs
    ):

        category = self.get_object()

        serializer = self.get_serializer(
            category
        )

        data = serializer.data

        # Add event count
        data["event_count"] = Event.objects.filter(
            category__iexact=category.name
        ).count()

        return Response(
            data
        )

    # ======================================================
    # PUBLIC CATEGORIES
    #
    # GET /api/events/categories/public/
    #
    # No login required.
    #
    # Only ACTIVE categories are returned.
    # Used by the public EventHub homepage.
    # ======================================================

    @action(
        detail=False,
        methods=["get"],
        url_path="public",
        permission_classes=[AllowAny],
        authentication_classes=[],
    )
    def public_categories(
        self,
        request
    ):

        categories = Category.objects.filter(
            is_active=True
        ).order_by(
            "name"
        )

        serializer = self.get_serializer(
            categories,
            many=True
        )

        return Response(
            serializer.data
        )

    # ======================================================
    # DELETE CATEGORY
    #
    # A category cannot be deleted if events are using it.
    # Instead, the admin should deactivate it.
    # ======================================================

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        category = self.get_object()

        event_count = Event.objects.filter(
            category__iexact=category.name
        ).count()

        # --------------------------------------------------
        # Prevent deletion when events use this category
        # --------------------------------------------------

        if event_count > 0:

            return Response(
                {
                    "detail": (
                        f"This category is currently "
                        f"used by {event_count} event(s). "
                        "Deactivate it instead of "
                        "deleting it."
                    ),
                    "event_count": event_count,
                },
                status=409,
            )

        return super().destroy(
            request,
            *args,
            **kwargs
        )