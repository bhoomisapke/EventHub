from django.urls import path

from .views import (
    admin_dashboard,
    admin_users,
    admin_user_status,
    admin_events,
    admin_update_event,
    admin_delete_event,
    admin_registrations,
    admin_cancel_registration,
)


urlpatterns = [

    # Dashboard
    path(
        "dashboard/",
        admin_dashboard,
        name="admin-dashboard"
    ),

    # Users
    path(
        "users/",
        admin_users,
        name="admin-users"
    ),

    path(
        "users/<int:user_id>/status/",
        admin_user_status,
        name="admin-user-status"
    ),

    # Events
    path(
        "events/",
        admin_events,
        name="admin-events"
    ),

    path(
        "events/<int:event_id>/",
        admin_update_event,
        name="admin-update-event"
    ),

    path(
        "events/<int:event_id>/delete/",
        admin_delete_event,
        name="admin-delete-event"
    ),

    # Registrations
    path(
        "registrations/",
        admin_registrations,
        name="admin-registrations"
    ),

    path(
        "registrations/<int:registration_id>/cancel/",
        admin_cancel_registration,
        name="admin-cancel-registration"
    ),
]