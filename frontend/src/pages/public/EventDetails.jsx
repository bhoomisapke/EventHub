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
} from "lucide-react";

import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFullImage, setShowFullImage] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  /* ============================================================
     FETCH EVENT
  ============================================================ */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/api/events/${id}/`
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
      return `http://localhost:8000${image}`;
    }

    return `http://localhost:8000/${image}`;
  };

  /* ============================================================
     IMAGE MODAL
  ============================================================ */

  const openFullImage = () => {
    setShowFullImage(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = "";
  };

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
     DESCRIPTION
  ============================================================ */

  const toggleDescription = () => {
    setShowFullDescription((previous) => !previous);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDescription();
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

          <p>Loading event details...</p>
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

          <h2>Event not found</h2>

          <p>
            {error || "The requested event could not be found."}
          </p>

          <Link
            to="/events"
            className="back-events-btn"
          >
            <ArrowLeft size={16} />
            Back to All Events
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
    fullDescription.length > descriptionLimit;

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
          to="/events"
          className="event-back-button"
        >
          <ArrowLeft size={16} />

          <span>
            Back to All Events
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

            {/* IMAGE HOVER */}

            <div className="event-image-hover">

              <div className="event-image-view-button">

                <Maximize2 size={14} />

                <span>
                  View Full Image
                </span>

              </div>

            </div>

            {/* CATEGORY */}

            <div className="hero-category">

              <Tag size={14} />

              {event.category || "General"}

            </div>

            {/* STATUS */}

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
            EVENT DETAILS
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

            {/* DATE */}

            <div className="information-item">

              <div className="information-icon purple">
                <CalendarDays size={19} />
              </div>

              <div>

                <span>
                  Date
                </span>

                <strong>
                  {formatDate(event.date)}
                </strong>

              </div>

            </div>

            {/* TIME */}

            <div className="information-item">

              <div className="information-icon pink">
                <Clock3 size={19} />
              </div>

              <div>

                <span>
                  Time
                </span>

                <strong>
                  {event.time || "Not specified"}
                </strong>

              </div>

            </div>

            {/* VENUE */}

            <div className="information-item">

              <div className="information-icon blue">
                <MapPin size={19} />
              </div>

              <div>

                <span>
                  Venue
                </span>

                <strong>
                  {event.venue || "Not specified"}
                </strong>

              </div>

            </div>

            {/* CATEGORY */}

            <div className="information-item">

              <div className="information-icon violet">
                <Tag size={19} />
              </div>

              <div>

                <span>
                  Category
                </span>

                <strong>
                  {event.category || "General"}
                </strong>

              </div>

            </div>

            {/* CAPACITY */}

            <div className="information-item">

              <div className="information-icon pink">
                <Users size={19} />
              </div>

              <div>

                <span>
                  Capacity
                </span>

                <strong>
                  {capacity || "Unlimited"}
                </strong>

              </div>

            </div>

            {/* PARTICIPATION */}

            <div className="information-item">

              <div className="information-icon violet">
                <Users size={19} />
              </div>

              <div>

                <span>
                  Participation
                </span>

                <strong>
                  {participationLabel}
                </strong>

              </div>

            </div>

            {/* TEAM SIZE */}

            <div className="information-item">

              <div className="information-icon purple">
                <Users size={19} />
              </div>

              <div>

                <span>
                  Team Size
                </span>

                <strong>
                  {teamSizeLabel}
                </strong>

              </div>

            </div>

            {/* REGISTRATION FEE */}

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
                  ).toLocaleString("en-IN")}
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
            REGISTER BUTTON
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
            />

          </div>

        </div>

      )}

    </div>
  );
}

export default EventDetails;