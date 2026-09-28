from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    CategoryViewSet,
)


router = DefaultRouter()


router.register(
    r"categories",
    CategoryViewSet,
    basename="categories"
)


router.register(
    r"",
    EventViewSet,
    basename="events"
)


urlpatterns = router.urls