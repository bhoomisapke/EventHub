from django.urls import path

from .views import (
    FeedbackCreateView,
    MyFeedbackView,
    OrganizerFeedbackView,
)


urlpatterns = [
    path("", FeedbackCreateView.as_view(), name="feedback-create"),
    path("my/", MyFeedbackView.as_view(), name="my-feedback"),
    path(
        "organizer/",
        OrganizerFeedbackView.as_view(),
        name="organizer-feedback",
    ),
]