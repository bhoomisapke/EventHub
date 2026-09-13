from rest_framework.permissions import BasePermission


class IsOrganizer(BasePermission):
    """
    Only authenticated users with role='organizer'
    can create/update/delete events.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "organizer"
        )


class IsOrganizerOwnerOrReadOnly(BasePermission):
    """
    Anyone can read events.

    Only the organizer who created an event
    can update or delete it.
    """

    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "organizer"
        )

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return obj.organizer == request.user