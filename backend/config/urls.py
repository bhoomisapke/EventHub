from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/events/", include("events.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/registrations/", include("registrations.urls")),
<<<<<<< HEAD
    path("api/feedback/", include("feedback.urls")),
=======

    path("api/tickets/", include("tickets.urls")),
>>>>>>> 7731be11c0b916f46fbf9fd0b31a8315110d5fd2
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )