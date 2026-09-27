from django.contrib.auth import get_user_model
from django.db.models import Count, DateField
from django.db.models.functions import Cast
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from events.models import Event
from registrations.models import Registration
from tickets.models import Ticket

from .notification_service import create_admin_notification


User = get_user_model()


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_dashboard(request):

    today = timezone.localdate()

    # -------------------------
    # USERS
    # -------------------------

    total_users = User.objects.count()

    total_students = User.objects.filter(
        role="student"
    ).count()

    total_organizers = User.objects.filter(
        role="organizer"
    ).count()

    # -------------------------
    # EVENTS
    # -------------------------

    total_events = Event.objects.count()

    published_events = Event.objects.filter(
        status="published"
    ).count()

    draft_events = Event.objects.filter(
        status="draft"
    ).count()

    cancelled_events = Event.objects.filter(
        status="cancelled"
    ).count()

    upcoming_events = Event.objects.filter(
        date__gte=today,
        status="published"
    ).count()

    # -------------------------
    # REGISTRATIONS
    # -------------------------

    total_registrations = Registration.objects.count()

    confirmed_registrations = Registration.objects.filter(
        status="confirmed"
    ).count()

    cancelled_registrations = Registration.objects.filter(
        status="cancelled"
    ).count()

    # -------------------------
    # TICKETS
    # -------------------------

    total_tickets = Ticket.objects.count()

    valid_tickets = Ticket.objects.filter(
        status="valid"
    ).count()

    used_tickets = Ticket.objects.filter(
        status="used"
    ).count()

    cancelled_tickets = Ticket.objects.filter(
        status="cancelled"
    ).count()

    # -------------------------
    # REGISTRATION GRAPH
    # -------------------------

    registration_graph = (
        Registration.objects
        .annotate(
            registration_day=Cast(
                "registration_date",
                output_field=DateField()
            )
        )
        .values("registration_day")
        .annotate(
            count=Count("id")
        )
        .order_by("registration_day")
    )

    graph_data = []

    for item in registration_graph:

        if item["registration_day"]:

            graph_data.append({
                "month": item["registration_day"].strftime("%b"),
                "registrations": item["count"],
            })

    # -------------------------
    # EVENT CATEGORIES
    # -------------------------

    category_data = (
        Event.objects
        .values("category")
        .annotate(
            count=Count("id")
        )
        .order_by("-count")
    )

    categories = [
        {
            "category": item["category"],
            "count": item["count"],
        }
        for item in category_data
    ]

    # -------------------------
    # RESPONSE
    # -------------------------

    return Response({

        "users": {
            "total": total_users,
            "students": total_students,
            "organizers": total_organizers,
        },

        "events": {
            "total": total_events,
            "published": published_events,
            "draft": draft_events,
            "cancelled": cancelled_events,
            "upcoming": upcoming_events,
        },

        "registrations": {
            "total": total_registrations,
            "confirmed": confirmed_registrations,
            "cancelled": cancelled_registrations,
        },

        "tickets": {
            "total": total_tickets,
            "valid": valid_tickets,
            "used": used_tickets,
            "cancelled": cancelled_tickets,
        },

        "registration_graph": graph_data,

        "event_categories": categories,
    })


# =========================================================
# GET ALL USERS
# =========================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_users(request):

    users = User.objects.all().order_by("-created_at")

    user_data = []

    for user in users:

        user_data.append({

            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role,

            "status": (
                "Active"
                if user.is_active
                else "Inactive"
            ),

            "created_at": user.created_at,
        })

    return Response({

        "users": user_data,

        "total": len(user_data),
    })


# =========================================================
# ACTIVATE / DEACTIVATE USER
# =========================================================

@api_view(["PATCH"])
@permission_classes([AllowAny])
def admin_user_status(request, user_id):

    user = get_object_or_404(
        User,
        id=user_id
    )

    is_active = request.data.get("is_active")

    if is_active is None:

        return Response(
            {
                "error": "is_active is required"
            },
            status=400
        )

    # -----------------------------------------
    # CONVERT VALUE CORRECTLY
    # -----------------------------------------

    if isinstance(is_active, str):

        is_active = (
            is_active.lower() == "true"
        )

    is_active = bool(is_active)

    # -----------------------------------------
    # SAVE USER STATUS
    # -----------------------------------------

    user.is_active = is_active

    user.save(
        update_fields=["is_active"]
    )

    # -----------------------------------------
    # CREATE REAL-TIME ADMIN NOTIFICATION
    # -----------------------------------------

    if is_active:

        create_admin_notification(
            notification_type="user",
            title="User Activated",
            message=(
                f"{user.name or 'User'} "
                f"has been activated successfully."
            ),
        )

    else:

        create_admin_notification(
            notification_type="user",
            title="User Deactivated",
            message=(
                f"{user.name or 'User'} "
                f"has been deactivated successfully."
            ),
        )

    # -----------------------------------------
    # RESPONSE
    # -----------------------------------------

    return Response({

        "message":
            "User status updated successfully",

        "user": {

            "id":
                user.id,

            "name":
                user.name,

            "email":
                user.email,

            "is_active":
                user.is_active,
        }
    })


# =========================================================
# GET ALL EVENTS
# =========================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_events(request):

    events = (
        Event.objects
        .select_related("organizer")
        .all()
        .order_by("-created_at")
    )

    event_data = []

    for event in events:

        event_data.append({

            "id": event.id,

            "title": event.title,

            "organizer": (
                event.organizer.name
                if event.organizer
                else "Unknown Organizer"
            ),

            "date": event.date,

            "time": event.time,

            "location": event.venue,

            "status": event.status,

            "image": (
                request.build_absolute_uri(
                    event.image.url
                )
                if event.image
                else None
            ),

            "participants":
                event.registrations.count(),

            "capacity":
                event.capacity,

            "category":
                event.category,
        })

    return Response({

        "events": event_data,

        "total": len(event_data),
    })


# =========================================================
# UPDATE EVENT
# =========================================================

@api_view(["PUT", "PATCH"])
@permission_classes([AllowAny])
def admin_update_event(request, event_id):

    event = get_object_or_404(
        Event,
        id=event_id
    )

    data = request.data

    if "title" in data:
        event.title = data["title"]

    if "description" in data:
        event.description = data["description"]

    if "category" in data:
        event.category = data["category"]

    if "date" in data:
        event.date = data["date"]

    if "time" in data:
        event.time = data["time"]

    if "venue" in data:
        event.venue = data["venue"]

    if "capacity" in data:
        event.capacity = data["capacity"]

    if "participation_type" in data:
        event.participation_type = (
            data["participation_type"]
        )

    if "min_team_size" in data:
        event.min_team_size = (
            data["min_team_size"]
        )

    if "max_team_size" in data:
        event.max_team_size = (
            data["max_team_size"]
        )

    if "registration_fee" in data:
        event.registration_fee = (
            data["registration_fee"]
        )

    if "registration_deadline" in data:
        event.registration_deadline = (
            data["registration_deadline"]
        )

    if "status" in data:
        event.status = data["status"]

    event.save()

    return Response({

        "message":
            "Event updated successfully",

        "event": {

            "id":
                event.id,

            "title":
                event.title,

            "status":
                event.status,
        }
    })


# =========================================================
# DELETE EVENT
# =========================================================

@api_view(["DELETE"])
@permission_classes([AllowAny])
def admin_delete_event(request, event_id):

    event = get_object_or_404(
        Event,
        id=event_id
    )

    event.delete()

    return Response({

        "message":
            "Event deleted successfully"
    })


# =========================================================
# GET ALL REGISTRATIONS
# =========================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def admin_registrations(request):

    registrations = (
        Registration.objects
        .select_related(
            "student",
            "event"
        )
        .all()
        .order_by("-registration_date")
    )

    registration_data = []

    for registration in registrations:

        registration_data.append({

            "id":
                registration.id,

            "student": (
                registration.student.name
                if registration.student
                else "Unknown Student"
            ),

            "email": (
                registration.student.email
                if registration.student
                else ""
            ),

            "event": (
                registration.event.title
                if registration.event
                else "Unknown Event"
            ),

            "event_id": (
                registration.event.id
                if registration.event
                else None
            ),

            "registration_date":
                registration.registration_date,

            "status":
                registration.status,
        })

    return Response({

        "registrations":
            registration_data,

        "total":
            len(registration_data),
    })


# =========================================================
# CANCEL REGISTRATION
# =========================================================

@api_view(["PATCH"])
@permission_classes([AllowAny])
def admin_cancel_registration(
    request,
    registration_id
):

    registration = get_object_or_404(
        Registration.objects.select_related(
            "student",
            "event"
        ),
        id=registration_id
    )

    # -----------------------------------------
    # ALREADY CANCELLED
    # -----------------------------------------

    if registration.status == "cancelled":

        ticket = None

        try:
            ticket = registration.ticket

        except Ticket.DoesNotExist:

            ticket = None

        return Response({

            "message":
                "Registration is already cancelled.",

            "registration": {

                "id":
                    registration.id,

                "status":
                    "cancelled",

                "student": (
                    registration.student.name
                    if registration.student
                    else "Unknown Student"
                ),

                "event": (
                    registration.event.title
                    if registration.event
                    else "Unknown Event"
                ),
            },

            "ticket": {

                "id":
                    ticket.id
                    if ticket
                    else None,

                "ticket_number":
                    ticket.ticket_number
                    if ticket
                    else None,

                "status":
                    ticket.status
                    if ticket
                    else None,
            }
        })

    # -----------------------------------------
    # CANCEL REGISTRATION
    # -----------------------------------------

    registration.status = "cancelled"

    registration.save(
        update_fields=["status"]
    )

    # -----------------------------------------
    # CANCEL RELATED TICKET
    # -----------------------------------------

    ticket = None

    try:

        ticket = registration.ticket

    except Ticket.DoesNotExist:

        ticket = None

    if ticket:

        ticket.status = "cancelled"

        ticket.save(
            update_fields=["status"]
        )

    # -----------------------------------------
    # RESPONSE
    # -----------------------------------------

    return Response({

        "message":
            "Registration cancelled successfully.",

        "registration": {

            "id":
                registration.id,

            "status":
                registration.status,

            "student": (
                registration.student.name
                if registration.student
                else "Unknown Student"
            ),

            "event": (
                registration.event.title
                if registration.event
                else "Unknown Event"
            ),
        },

        "ticket": {

            "id":
                ticket.id
                if ticket
                else None,

            "ticket_number":
                ticket.ticket_number
                if ticket
                else None,

            "status":
                ticket.status
                if ticket
                else None,
        }
    })