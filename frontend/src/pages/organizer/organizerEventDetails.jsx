import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  IndianRupee,
  UserRound,
  Phone,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Maximize2,
  Award,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import "./OrganizerEventDetails.css";

function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://localhost:8000";

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     IMAGE MODAL
  ============================================================ */

  const [showFullImage, setShowFullImage] = useState(false);

  /* ============================================================
     DESCRIPTION
  ============================================================ */

  const [showFullDescription, setShowFullDescription] =
    useState(false);

  /* ============================================================
     CERTIFICATE STATES
  ============================================================ */

  const [showCertificateConfirm, setShowCertificateConfirm] =
    useState(false);

  const [generatingCertificates, setGeneratingCertificates] =
    useState(false);

  const [certificateResult, setCertificateResult] =
    useState(null);

  const [certificateError, setCertificateError] =
    useState("");

  /* ============================================================
     FETCH EVENT
  ============================================================ */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events/${id}/`
        );

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();

        setEvent(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Unable to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /* ============================================================
     CLEANUP
  ============================================================ */

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ============================================================
     DATE FORMAT
  ============================================================ */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* ============================================================
     IMAGE URL
  ============================================================ */

  const getImageUrl = () => {
    if (!event?.image) {
      return "/images/event-placeholder.jpg";
    }

    const image = String(event.image);

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    return `${API_URL}/${image}`;
  };

  /* ============================================================
     OPEN FULL IMAGE
  ============================================================ */

  const openFullImage = () => {
    setShowFullImage(true);
    document.body.style.overflow = "hidden";
  };

  /* ============================================================
     CLOSE FULL IMAGE
  ============================================================ */

  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = "";
  };

  /* ============================================================
     IMAGE KEYBOARD
  ============================================================ */

  const handleImageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFullImage();
    }

    if (e.key === "Escape") {
      closeFullImage();
    }
  };

  /* ============================================================
     DESCRIPTION TOGGLE
  ============================================================ */

  const toggleDescription = () => {
    setShowFullDescription((previous) => !previous);
  };

  /* ============================================================
     DESCRIPTION KEYBOARD
  ============================================================ */

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDescription();
    }
  };

  /* ============================================================
     CERTIFICATE ELIGIBILITY
  ============================================================ */

  const isEventCompleted = () => {
    if (!event?.date) {
      return false;
    }

    const eventDate = new Date(event.date);
    const today = new Date();

    eventDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    return eventDate < today;
  };

  /* ============================================================
     OPEN CERTIFICATE CONFIRMATION
  ============================================================ */

  const openCertificateConfirmation = () => {
    setCertificateError("");
    setCertificateResult(null);

    if (!isEventCompleted()) {
      setCertificateError(
        "Certificates can only be generated after the event is completed."
      );
      return;
    }

    setShowCertificateConfirm(true);
    document.body.style.overflow = "hidden";
  };

  /* ============================================================
     CLOSE CERTIFICATE CONFIRMATION
  ============================================================ */

  const closeCertificateConfirmation = () => {
    if (generatingCertificates) {
      return;
    }

    setShowCertificateConfirm(false);
    document.body.style.overflow = "";
  };

  /* ============================================================
     GENERATE CERTIFICATES
  ============================================================ */

  const generateCertificates = async () => {
    if (generatingCertificates) {
      return;
    }

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setCertificateError(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setGeneratingCertificates(true);
      setCertificateError("");
      setCertificateResult(null);

      const response = await fetch(
        `${API_URL}/api/certificates/events/${event.id}/generate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.status === 401) {
        setCertificateError(
          "Your session has expired. Please login again."
        );
        return;
      }

      if (response.status === 403) {
        setCertificateError(
          data.detail ||
            "You are not allowed to generate certificates for this event."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Unable to generate certificates."
        );
      }

      setCertificateResult({
        generated: Number(data.generated || 0),
        alreadyGenerated: Number(
          data.already_generated || 0
        ),
        totalEligible: Number(
          data.total_eligible || 0
        ),
        message:
          data.message ||
          "Certificate generation completed.",
      });

      setShowCertificateConfirm(false);
    } catch (err) {
      console.error(
        "Certificate generation error:",
        err
      );

      setCertificateError(
        err.message ||
          "Unable to generate certificates. Please try again."
      );
    } finally {
      setGeneratingCertificates(false);
      document.body.style.overflow = "";
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="organizer-event-details-page">
        <div className="event-details-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error || !event) {
    return (
      <div className="organizer-event-details-page">
        <div className="event-details-error">
          <AlertCircle size={38} />

          <h2>
            Event not found
          </h2>

          <p>
            {error ||
              "The requested event could not be found."}
          </p>

          <Link
            to="/organizer/events"
            className="back-events-btn"
          >
            <ArrowLeft size={16} />
            Back to My Events
          </Link>
        </div>
      </div>
    );
  }

  /* ============================================================
     EVENT DATA
  ============================================================ */

  const registrationFee =
    event.registrationFee ??
    event.registration_fee ??
    0;

  const organizerName =
    event.organizerName ||
    event.organizer_name ||
    "EventHub Organizer";

  const organizerMobile =
    event.organizerMobile ||
    event.organizer_mobile ||
    "Not provided";

  const participants =
    Number(event.participants || 0);

  const capacity =
    Number(event.capacity || 0);

  const registrationPercentage =
    capacity > 0
      ? Math.min(
          (participants / capacity) * 100,
          100
        )
      : 0;

  const status =
    event.status || "upcoming";

  const deadline =
    event.registrationDeadline ||
    event.registration_deadline;

  /* ============================================================
     PARTICIPATION DATA
  ============================================================ */

  const participationType =
    event.participationType ||
    event.participation_type ||
    "individual";

  const minTeamSize =
    Number(
      event.minTeamSize ??
        event.min_team_size ??
        1
    );

  const maxTeamSize =
    Number(
      event.maxTeamSize ??
        event.max_team_size ??
        1
    );

  const isGroupEvent =
    participationType === "group";

  const participationLabel =
    isGroupEvent
      ? "Group Event"
      : "Individual Event";

  const teamSizeLabel =
    isGroupEvent
      ? `${minTeamSize}–${maxTeamSize} Members`
      : "1 Participant";

  /* ============================================================
     DESCRIPTION
  ============================================================ */

  const fullDescription =
    event.description ||
    "No description available for this event.";

  const descriptionLimit = 55;

  const isLongDescription =
    fullDescription.length >
    descriptionLimit;

  const shortDescription =
    isLongDescription
      ? `${fullDescription.substring(
          0,
          descriptionLimit
        )}...`
      : fullDescription;

  const displayedDescription =
    showFullDescription
      ? fullDescription
      : shortDescription;

  const eventCompleted =
    isEventCompleted();

  /* ============================================================
     PAGE
  ============================================================ */

  return (
    <div className="organizer-event-details-page">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <div className="event-details-wrapper">

        <Link
          to="/organizer/events"
          className="event-back-button"
        >
          <ArrowLeft size={16} />

          <span>
            Back to My Events
          </span>
        </Link>

      </div>

      {/* ======================================================
          MAIN EVENT CONTENT
      ====================================================== */}

      <main className="event-details-main">

        {/* ====================================================
            HERO IMAGE
        ==================================================== */}

        <section className="event-hero-section">

          <div
            className="event-hero-image-wrapper"
            onClick={openFullImage}
            onKeyDown={handleImageKeyDown}
            role="button"
            tabIndex={0}
            aria-label="View full event image"
            title="Click to view full image"
          >

            <img
              src={getImageUrl()}
              alt={event.title || "Event"}
              className="event-hero-image"
              onError={(e) => {
                e.currentTarget.src =
                  "/images/event-placeholder.jpg";
              }}
            />

            <div className="event-image-hover">

              <div className="event-image-view-button">

                <Maximize2 size={14} />

                <span>
                  View Full Image
                </span>

              </div>

            </div>

            <div className="hero-category">

              <Tag size={14} />

              {event.category || "General"}

            </div>

            <div
              className={`hero-status ${status}`}
            >

              <CheckCircle2 size={14} />

              {status.charAt(0).toUpperCase() +
                status.slice(1)}

            </div>

          </div>

        </section>

        {/* ====================================================
            EVENT TITLE
        ==================================================== */}

        <section className="event-title-section">

          <span className="event-details-label">
            EVENT DETAILS 1234
          </span>

          <h1>
            {event.title}
          </h1>

          <div className="title-gradient-line"></div>

        </section>

        {/* ====================================================
            ABOUT THIS EVENT
        ==================================================== */}

        <section
          className={`about-event-card ${
            showFullDescription
              ? "is-expanded"
              : ""
          }`}
          onClick={toggleDescription}
          onKeyDown={handleDescriptionKeyDown}
          role="button"
          tabIndex={0}
          aria-expanded={showFullDescription}
          aria-label={
            showFullDescription
              ? "Collapse event description"
              : "Expand event description"
          }
        >

          <div className="about-icon">

            <FileText size={20} />

          </div>

          <div className="about-content">

            <h2>
              About This Event
            </h2>

            <p
              className={
                showFullDescription
                  ? "description-expanded"
                  : "description-collapsed"
              }
            >
              {displayedDescription}
            </p>

            {isLongDescription && (
              <button
                type="button"
                className="description-toggle-button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription();
                }}
              >
                {showFullDescription
                  ? "Show Less"
                  : "Read More"}
              </button>
            )}

            {!showFullDescription &&
              isLongDescription && (
                <span className="character-note">
                  Showing only first 55 characters
                </span>
              )}

          </div>

        </section>

        {/* ====================================================
            EVENT INFORMATION
        ==================================================== */}

        <section className="details-section">

          <div className="section-title-row">

            <div className="section-title-left">

              <CalendarDays size={19} />

              <h2>
                Event Information
              </h2>

            </div>

            <div className="section-title-line"></div>

          </div>

          <div className="event-information-card">

            <div className="information-item">

              <div className="information-icon purple">
                <CalendarDays size={19} />
              </div>

              <div>
                <span>Date</span>

                <strong>
                  {formatDate(event.date)}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon pink">
                <Clock3 size={19} />
              </div>

              <div>
                <span>Time</span>

                <strong>
                  {event.time ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon blue">
                <MapPin size={19} />
              </div>

              <div>
                <span>Venue</span>

                <strong>
                  {event.venue ||
                    "Not specified"}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon violet">
                <Tag size={19} />
              </div>

              <div>
                <span>Category</span>

                <strong>
                  {event.category ||
                    "General"}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon pink">
                <Users size={19} />
              </div>

              <div>
                <span>Capacity</span>

                <strong>
                  {capacity ||
                    "Unlimited"}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon violet">
                <Users size={19} />
              </div>

              <div>
                <span>Participation</span>

                <strong>
                  {participationLabel}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon purple">
                <Users size={19} />
              </div>

              <div>
                <span>Team Size</span>

                <strong>
                  {teamSizeLabel}
                </strong>
              </div>

            </div>

            <div className="information-item">

              <div className="information-icon green">
                <IndianRupee size={19} />
              </div>

              <div>
                <span>
                  Registration Fee
                </span>

                <strong>
                  ₹{" "}
                  {Number(
                    registrationFee
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            ORGANIZER INFORMATION
        ==================================================== */}

        <section className="details-section">

          <div className="section-title-row">

            <div className="section-title-left">

              <UserRound size={19} />

              <h2>
                Organizer Information
              </h2>

            </div>

            <div className="section-title-line"></div>

          </div>

          <div className="organizer-information-card">

            <div className="organizer-avatar">

              {organizerName
                .charAt(0)
                .toUpperCase()}

            </div>

            <div className="organizer-details">

              <h3>
                {organizerName}
              </h3>

              <p>
                Professional event management team
              </p>

              <div className="organizer-phone">

                <Phone size={14} />

                <span>
                  {organizerMobile}
                </span>

              </div>

            </div>

            <div className="organizer-decoration">

              <span>
                Building
              </span>

              <span>
                Better Events
              </span>

            </div>

          </div>

        </section>

        {/* ====================================================
            REGISTRATION DEADLINE
        ==================================================== */}

        <section className="deadline-card">

          <div className="deadline-icon">

            <CalendarDays size={20} />

          </div>

          <div className="deadline-content">

            <span>
              Registration Deadline
            </span>

            <strong>
              {deadline
                ? formatDate(deadline)
                : "No deadline specified"}
            </strong>

          </div>

          <div className="deadline-right">

            <Clock3 size={15} />

            <span>
              Registration
            </span>

          </div>

        </section>

        {/* ====================================================
            REGISTRATION PROGRESS
        ==================================================== */}

        <section className="details-section registration-section">

          <div className="section-title-row">

            <div className="section-title-left">

              <Users size={19} />

              <h2>
                Registration Progress
              </h2>

            </div>

            <div className="section-title-line"></div>

          </div>

          <div className="registration-progress-card">

            <div className="progress-top">

              <span>

                <strong>
                  {participants}
                </strong>

                {" / "}

                {capacity || "∞"}

                {" participants"}

              </span>

              <strong>

                {Math.round(
                  registrationPercentage
                )}
                %

              </strong>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${registrationPercentage}%`,
                }}
              ></div>

            </div>

          </div>

        </section>

        {/* ====================================================
            CERTIFICATE GENERATION
        ==================================================== */}

        <section
          className="details-section"
          style={{
            marginTop: "28px",
          }}
        >

          <div className="section-title-row">

            <div className="section-title-left">

              <Award size={19} />

              <h2>
                Certificates
              </h2>

            </div>

            <div className="section-title-line"></div>

          </div>

          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "24px",
              borderRadius: "20px",
              border: "1px solid #E9DDFB",
              background:
                "linear-gradient(135deg, #FFFFFF 0%, #F8F1FF 55%, #FFF1F7 100%)",
              boxShadow:
                "0 10px 30px rgba(109, 40, 217, 0.08)",
            }}
          >

            {/* Decorative glow */}

            <div
              style={{
                position: "absolute",
                width: "120px",
                height: "120px",
                right: "-45px",
                top: "-50px",
                borderRadius: "50%",
                background:
                  "rgba(236, 72, 153, 0.10)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: "17px",
              }}
            >

              <div
                style={{
                  flexShrink: 0,
                  width: "46px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #6D28D9, #EC4899)",
                  color: "#FFFFFF",
                  boxShadow:
                    "0 8px 18px rgba(109, 40, 217, 0.22)",
                }}
              >
                <Award size={22} />
              </div>

              <div style={{ flex: 1 }}>

                <h3
                  style={{
                    margin: "0 0 7px",
                    color: "#10152C",
                    fontSize: "16px",
                    fontWeight: 800,
                  }}
                >
                  Generate Participation Certificates
                </h3>

                <p
                  style={{
                    margin: "0",
                    color: "#6B7280",
                    fontSize: "12px",
                    lineHeight: 1.6,
                    maxWidth: "650px",
                  }}
                >
                  Generate an EventHub certificate
                  automatically for every confirmed
                  participant of this event after the
                  event has been completed.
                </p>

              </div>

            </div>

            {/* Certificate result */}

            {certificateResult && (
              <div
                style={{
                  position: "relative",
                  marginTop: "20px",
                  padding: "15px 17px",
                  borderRadius: "14px",
                  border:
                    "1px solid #BBF7D0",
                  background: "#F0FDF4",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "9px",
                    color: "#166534",
                    fontSize: "13px",
                    fontWeight: 800,
                    marginBottom: "9px",
                  }}
                >

                  <CheckCircle2 size={17} />

                  Certificates Generated

                </div>

                <p
                  style={{
                    margin: "0",
                    color: "#166534",
                    fontSize: "11px",
                    lineHeight: 1.6,
                  }}
                >
                  {certificateResult.generated} new certificate
                  {certificateResult.generated !== 1
                    ? "s"
                    : ""}{" "}
                  generated successfully.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "12px",
                  }}
                >

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "20px",
                      background: "#DCFCE7",
                      color: "#166534",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Generated:{" "}
                    {certificateResult.generated}
                  </span>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "20px",
                      background: "#F3E8FF",
                      color: "#6D28D9",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Already Generated:{" "}
                    {certificateResult.alreadyGenerated}
                  </span>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "20px",
                      background: "#FCE7F3",
                      color: "#BE185D",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    Eligible:{" "}
                    {certificateResult.totalEligible}
                  </span>

                </div>

              </div>
            )}

            {/* Certificate error */}

            {certificateError && (
              <div
                style={{
                  position: "relative",
                  marginTop: "18px",
                  padding: "13px 15px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "9px",
                  borderRadius: "13px",
                  border:
                    "1px solid #FECACA",
                  background: "#FEF2F2",
                  color: "#B91C1C",
                  fontSize: "11px",
                  lineHeight: 1.5,
                }}
              >

                <AlertCircle
                  size={16}
                  style={{
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />

                <span>
                  {certificateError}
                </span>

              </div>
            )}

            {/* Certificate action */}

            {!certificateResult && (
              <div
                style={{
                  position: "relative",
                  marginTop: "21px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: eventCompleted
                      ? "#166534"
                      : "#7C3AED",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >

                  <ShieldCheck size={15} />

                  {eventCompleted
                    ? "Event completed — certificates available"
                    : "Certificates unlock after the event"}

                </div>

                <button
                  type="button"
                  onClick={
                    openCertificateConfirmation
                  }
                  disabled={!eventCompleted}
                  style={{
                    border: "none",
                    outline: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    minHeight: "42px",
                    padding: "0 18px",
                    borderRadius: "12px",
                    background: eventCompleted
                      ? "linear-gradient(135deg, #6D28D9, #EC4899)"
                      : "#E5E7EB",
                    color: eventCompleted
                      ? "#FFFFFF"
                      : "#9CA3AF",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: eventCompleted
                      ? "pointer"
                      : "not-allowed",
                    boxShadow: eventCompleted
                      ? "0 8px 18px rgba(109, 40, 217, 0.20)"
                      : "none",
                    transition:
                      "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  title={
                    eventCompleted
                      ? "Generate certificates"
                      : "Available after event completion"
                  }
                >

                  <Award size={16} />

                  Generate Certificates

                </button>

              </div>
            )}

          </div>

        </section>

        {/* ====================================================
            ORGANIZER ACTION
        ==================================================== */}

        <div className="register-event-wrapper">

          <button
            type="button"
            className="register-event-button"
            onClick={() =>
              navigate(
                `/events/${event.id}/register`
              )
            }
          >

            <UserRound size={17} />

            <span>
              Register for This Event
            </span>

            <span className="register-arrow">
              →
            </span>

          </button>

        </div>

      </main>

      {/* ======================================================
          FULL IMAGE MODAL
      ====================================================== */}

      {showFullImage && (

        <div
          className="event-image-modal"
          onClick={closeFullImage}
          role="dialog"
          aria-modal="true"
          aria-label="Full event image"
        >

          <div
            className="event-image-modal-content"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="event-image-close"
              onClick={closeFullImage}
              aria-label="Close full image"
              title="Close"
            >

              <X size={20} />

            </button>

            <img
              src={getImageUrl()}
              alt={
                event.title ||
                "Full event image"
              }
              className="event-full-image"
              onError={(e) => {
                e.currentTarget.src =
                  "/images/event-placeholder.jpg";
              }}
            />

          </div>

        </div>

      )}

      {/* ======================================================
          CERTIFICATE CONFIRMATION MODAL
      ====================================================== */}

      {showCertificateConfirm && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background:
              "rgba(8, 10, 28, 0.62)",
            backdropFilter: "blur(7px)",
          }}
          onClick={closeCertificateConfirmation}
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-confirm-title"
        >

          <div
            style={{
              width: "min(430px, 94vw)",
              overflow: "hidden",
              borderRadius: "22px",
              background: "#FFFFFF",
              boxShadow:
                "0 25px 70px rgba(16, 21, 44, 0.30)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal header */}

            <div
              style={{
                position: "relative",
                padding: "24px 24px 20px",
                background:
                  "linear-gradient(135deg, #F5EEFF, #FFF0F7)",
                borderBottom:
                  "1px solid #EEE5F8",
              }}
            >

              <button
                type="button"
                onClick={
                  closeCertificateConfirmation
                }
                disabled={
                  generatingCertificates
                }
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  color: "#6B7280",
                  cursor: generatingCertificates
                    ? "not-allowed"
                    : "pointer",
                }}
              >

                <X size={17} />

              </button>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "15px",
                  background:
                    "linear-gradient(135deg, #6D28D9, #EC4899)",
                  color: "#FFFFFF",
                  marginBottom: "14px",
                }}
              >

                <Award size={23} />

              </div>

              <h2
                id="certificate-confirm-title"
                style={{
                  margin: "0 0 7px",
                  color: "#10152C",
                  fontSize: "19px",
                  fontWeight: 800,
                }}
              >
                Generate Certificates?
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6B7280",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                This will generate EventHub
                participation certificates for all
                confirmed participants of this event.
              </p>

            </div>

            {/* Modal content */}

            <div
              style={{
                padding: "20px 24px 24px",
              }}
            >

              <div
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  background: "#F8F7FC",
                  border:
                    "1px solid #ECE8F5",
                  marginBottom: "19px",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "15px",
                    marginBottom: "9px",
                  }}
                >

                  <span
                    style={{
                      color: "#7C8195",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    EVENT
                  </span>

                  <span
                    style={{
                      color: "#10152C",
                      fontSize: "11px",
                      fontWeight: 800,
                      textAlign: "right",
                    }}
                  >
                    {event.title}
                  </span>

                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "15px",
                  }}
                >

                  <span
                    style={{
                      color: "#7C8195",
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    PARTICIPANTS
                  </span>

                  <span
                    style={{
                      color: "#6D28D9",
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    {participants}
                  </span>

                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "9px",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                  color: "#6B7280",
                  fontSize: "10px",
                  lineHeight: 1.5,
                }}
              >

                <ShieldCheck
                  size={15}
                  style={{
                    flexShrink: 0,
                    color: "#6D28D9",
                  }}
                />

                <span>
                  Certificates will be generated only
                  for confirmed, non-cancelled
                  registrations. Existing certificates
                  will not be duplicated.
                </span>

              </div>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  type="button"
                  onClick={
                    closeCertificateConfirmation
                  }
                  disabled={
                    generatingCertificates
                  }
                  style={{
                    flex: 1,
                    minHeight: "43px",
                    border:
                      "1px solid #E5E7EB",
                    borderRadius: "11px",
                    background: "#FFFFFF",
                    color: "#4B5563",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor:
                      generatingCertificates
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    generateCertificates
                  }
                  disabled={
                    generatingCertificates
                  }
                  style={{
                    flex: 1.3,
                    minHeight: "43px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                    gap: "8px",
                    border: "none",
                    borderRadius: "11px",
                    background:
                      "linear-gradient(135deg, #6D28D9, #EC4899)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor:
                      generatingCertificates
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      generatingCertificates
                        ? 0.75
                        : 1,
                  }}
                >

                  {generatingCertificates ? (
                    <>
                      <Loader2
                        size={16}
                        className="certificate-spinner"
                      />

                      Generating...
                    </>
                  ) : (
                    <>
                      <Award size={16} />

                      Generate
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default OrganizerEventDetails;