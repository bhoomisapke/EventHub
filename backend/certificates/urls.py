from django.urls import path

from .views import (
    CertificateConfigurationView,
    GenerateEventCertificatesView,
    MyCertificatesView,
    CertificateDetailView,
    ViewCertificatePDFView,
    DownloadCertificatePDFView,
)


urlpatterns = [

    # Student certificates
    path(
        "my/",
        MyCertificatesView.as_view(),
        name="my-certificates",
    ),

    path(
        "<int:pk>/",
        CertificateDetailView.as_view(),
        name="certificate-detail",
    ),

    path(
        "<int:pk>/view/",
        ViewCertificatePDFView.as_view(),
        name="certificate-view-pdf",
    ),

    path(
        "<int:pk>/download/",
        DownloadCertificatePDFView.as_view(),
        name="certificate-download-pdf",
    ),

    # Organizer certificate customization
    path(
        "events/<int:event_id>/configuration/",
        CertificateConfigurationView.as_view(),
        name="certificate-configuration",
    ),

    # Organizer certificate generation
    path(
        "events/<int:event_id>/generate/",
        GenerateEventCertificatesView.as_view(),
        name="generate-event-certificates",
    ),
]