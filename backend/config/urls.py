from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # Event APIs
    path("api/events/", include("events.urls")),

    # Authentication APIs
    path("api/auth/", include("accounts.urls")),

    # Registration APIs
    path("api/registrations/", include("registrations.urls")),

    # Feedback APIs
    path("api/feedback/", include("feedback.urls")),

    # Ticket APIs
    path("api/tickets/", include("tickets.urls")),

    # Certificate APIs
    path("api/certificates/", include("certificates.urls")),

    # Admin Panel APIs
    path("api/admin/", include("adminpanel.urls")),
    
]


# Serve uploaded media files during development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )