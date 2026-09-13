from django.urls import path

from .views import (
    FeedbackCreateView,
    MyFeedbackView,
)


urlpatterns = [
    path("", FeedbackCreateView.as_view(), name="feedback-create"),
    path("my/", MyFeedbackView.as_view(), name="my-feedback"),
]