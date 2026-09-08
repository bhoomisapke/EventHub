import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function OrganizerEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${id}/`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || data.message || "Failed to fetch event.");
          return;
        }

        setEvent(data);
      } catch (error) {
        console.error("Fetch event error:", error);
        alert("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="organizer-event-details-page">
        <div className="event-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Event...</h2>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="organizer-event-details-page">
        <div className="event-not-found">
          <h2>Event Not Found</h2>

          <Link to="/organizer/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* Registration Fee */
  const registrationFee =
    event.registrationFee &&
    event.registrationFee !== "0" &&
    event.registrationFee !== "0.00"
      ? `₹${event.registrationFee}`
      : event.registration_fee &&
        event.registration_fee !== "0" &&
        event.registration_fee !== "0.00"
      ? `₹${event.registration_fee}`
      : "Free";

  /* Organizer */
  const organizerName =
    event.organizerName ||
    event.organizer_name ||
    "Not specified";

  /* Participants */
  const participants = event.participants || 0;

  /* Register Button */
  const handleRegister = () => {
    navigate(`/events/${event.id}/register`);
  };

  return (
    <div className="organizer-event-details-page">

      {/* =========================
          TOP NAVIGATION
      ========================== */}

      <header className="event-details-navbar">

        <Link
          to="/organizer/dashboard"
          className="event-details-brand"
        >
          <span className="brand-icon">▣</span>

          <span>
            Event<span>Hub</span>
          </span>
        </Link>

        <nav className="event-details-nav">

          <Link to="/organizer/dashboard">
            Dashboard
          </Link>

          <Link to="/organizer/profile">
            Profile
          </Link>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </button>

        </nav>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main className="event-details-main">

        {/* Back Button */}

        <Link
          to="/organizer/dashboard"
          className="event-back-button"
        >
          ← Back to Dashboard
        </Link>


        {/* =========================
            EVENT MAIN CARD
        ========================== */}

        <section className="event-details-card">

          {/* =====================
              LEFT - EVENT IMAGE
          ====================== */}

          <div className="event-image-section">

            {event.image ? (

              <img
                src={event.image}
                alt={event.title}
                className="event-main-image"
              />

            ) : (

              <div className="event-no-image">

                <span>▣</span>

                <p>No Event Image</p>

              </div>

            )}

          </div>


          {/* =====================
              RIGHT - EVENT DETAILS
          ====================== */}

          <div className="event-information-section">

            {/* Category */}

            <span className="event-category-badge">
              {event.category || "Event"}
            </span>


            {/* Title */}

            <h1 className="event-details-title">
              {event.title}
            </h1>


            {/* Description */}

            <p className="event-details-description">
              {event.description ||
                "No description available for this event."}
            </p>


            {/* =====================
                EVENT INFORMATION GRID
            ====================== */}

            <div className="event-info-grid">

              {/* Category */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  🏷️
                </div>

                <div>
                  <span>Category</span>

                  <strong>
                    {event.category || "Not specified"}
                  </strong>
                </div>

              </div>


              {/* Date */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  📅
                </div>

                <div>
                  <span>Date</span>

                  <strong>
                    {event.date || "Not specified"}
                  </strong>
                </div>

              </div>


              {/* Time */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  ◷
                </div>

                <div>
                  <span>Time</span>

                  <strong>
                    {event.time || "Not specified"}
                  </strong>
                </div>

              </div>


              {/* Venue */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  📍
                </div>

                <div>
                  <span>Venue</span>

                  <strong>
                    {event.venue || "Not specified"}
                  </strong>
                </div>

              </div>


              {/* Capacity */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  👥
                </div>

                <div>
                  <span>Capacity</span>

                  <strong>
                    {event.capacity || 0} Participants
                  </strong>
                </div>

              </div>


              {/* Participants */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  ♧
                </div>

                <div>
                  <span>Participants</span>

                  <strong>
                    {participants} / {event.capacity || 0}
                  </strong>
                </div>

              </div>


              {/* Registration Fee */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  ₹
                </div>

                <div>
                  <span>Registration Fee</span>

                  <strong>
                    {registrationFee}
                  </strong>
                </div>

              </div>


              {/* Organizer */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  👤
                </div>

                <div>
                  <span>Organizer</span>

                  <strong>
                    {organizerName}
                  </strong>
                </div>

              </div>


              {/* Status */}

              <div className="event-info-box">

                <div className="event-info-icon">
                  ●
                </div>

                <div>
                  <span>Status</span>

                  <strong className="event-status-value">
                    {event.status || "Upcoming"}
                  </strong>
                </div>

              </div>

            </div>


            {/* =====================
                REGISTRATION DEADLINE
            ====================== */}

            <div className="event-deadline-box">

              <div className="deadline-icon">
                📅
              </div>

              <div>

                <span>
                  Registration Deadline
                </span>

                <strong>
                  {event.registrationDeadline ||
                    event.registration_deadline ||
                    "Not specified"}
                </strong>

              </div>

            </div>


            {/* =====================
                REGISTER BUTTON
            ====================== */}

            <button
              type="button"
              className="event-register-button"
              onClick={handleRegister}
            >
              Register Now

              <span>
                →
              </span>

            </button>

          </div>

        </section>


        {/* =========================
            GO TO HOME
        ========================== */}

        <div className="event-home-section">

          <Link
            to="/"
            className="event-home-button"
          >
            ← Go to Home
          </Link>

        </div>

      </main>

    </div>
  );
}

export default OrganizerEventDetails;