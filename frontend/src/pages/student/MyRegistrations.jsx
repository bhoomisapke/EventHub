import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import "./MyRegistrations.css";

const API_URL = "http://127.0.0.1:8000";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH MY REGISTRATIONS
  // ==================================================
  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setError("Please login to view your registrations.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/registrations/my/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setError("Your session has expired. Please login again.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load registrations.");
      }

      const data = await response.json();

      setRegistrations(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.error("Registration fetch error:", err);
      setError("Unable to load your registrations.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ==================================================
  // FORMAT TIME
  // ==================================================
  const formatTime = (timeString) => {
    if (!timeString) return "Time not available";

    const [hours, minutes] = timeString.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==================================================
  // STATUS CLASS
  // ==================================================
  const getStatusClass = (status) => {
    if (status?.toLowerCase() === "cancelled") {
      return "cancelled-badge";
    }

    return "confirmed-badge";
  };

  // ==================================================
  // STATUS ICON
  // ==================================================
  const getStatusIcon = (status) => {
    if (status?.toLowerCase() === "cancelled") {
      return <XCircle size={13} />;
    }

    return <CheckCircle2 size={13} />;
  };

  // ==================================================
  // COUNTS
  // ==================================================
  const confirmedCount = registrations.filter(
    (registration) =>
      registration.status?.toLowerCase() === "confirmed"
  ).length;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcomingCount = registrations.filter(
    (registration) => {
      if (!registration.event_date) return false;

      const eventDate = new Date(
        registration.event_date
      );

      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= today;
    }
  ).length;

  // ==================================================
  // MAIN
  // ==================================================
  return (
    <div className="registrations-page">

      {/* ================= HEADER ================= */}

      <section className="registrations-header">

        <div>
          <span className="registration-label">
            YOUR EVENT ACTIVITY
          </span>

          <h1>My Registrations</h1>

          <p>
            Manage all the events you have registered
            for and keep track of your upcoming
            experiences.
          </p>
        </div>

        <Link
          to="/events"
          className="browse-registration-btn"
        >
          Browse Events
          <ArrowRight size={16} />
        </Link>

      </section>


      {/* ================= SUMMARY ================= */}

      <section className="registration-summary">

        <div className="registration-summary-card">

          <div className="summary-icon purple-summary">
            <Ticket size={21} />
          </div>

          <div>
            <span>TOTAL REGISTRATIONS</span>
            <strong>{registrations.length}</strong>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon green-summary">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>CONFIRMED</span>
            <strong>{confirmedCount}</strong>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon blue-summary">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>UPCOMING</span>
            <strong>{upcomingCount}</strong>
          </div>

        </div>

      </section>


      {/* ================= REGISTRATION LIST ================= */}

      <section className="registration-list-section">

        <div className="registration-list-heading">

          <div>
            <span>EVENTS YOU JOINED</span>
            <h2>Registered Events</h2>
          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="registration-empty-state">

            <CalendarDays size={30} />

            <h3>
              Loading your registrations...
            </h3>

            <p>
              Please wait while we fetch your events.
            </p>

          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="registration-empty-state">

            <XCircle size={30} />

            <h3>
              Unable to load registrations
            </h3>

            <p>{error}</p>

          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          registrations.length === 0 && (

            <div className="registration-empty-state">

              <CalendarDays size={30} />

              <h3>
                No registrations yet
              </h3>

              <p>
                You haven't registered for any
                events yet.
              </p>

              <Link
                to="/events"
                className="browse-registration-btn"
              >
                Explore Events
                <ArrowRight size={16} />
              </Link>

            </div>
          )}


        {/* REGISTRATION CARDS */}

        {!loading &&
          !error &&
          registrations.length > 0 && (

            <div className="registration-list">

              {registrations.map(
                (registration) => (

                  <article
                    className="registration-item"
                    key={registration.id}
                  >

                    {/* ================= IMAGE ================= */}

                   {/* Image */}

                  <div className="registration-image">

                    {registration.event_image ? (
                      <img
                        src={registration.event_image}
                        alt={registration.event_title || "Event"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const placeholder =
                            e.currentTarget.nextElementSibling;

                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="registration-image-placeholder"
                      style={{
                        display: registration.event_image
                          ? "none"
                          : "flex",
                      }}
                    >
                      <Ticket size={32} />
                    </div>

                    <span>
                      Event
                    </span>

                  </div>

                    {/* ================= DETAILS ================= */}

                    <div className="registration-event-details">

                      <div className="registration-event-top">

                        <div>

                          <span className="event-mini-label">
                            REGISTERED EVENT
                          </span>

                          <h3>
                            {registration.event_title ||
                              "Event"}
                          </h3>

                        </div>

                        <div className="registration-mini-ticket">
                          <Ticket size={13} />
                          EventHub
                        </div>

                      </div>


                      <div className="registration-detail-row">

                        <div>
                          <CalendarDays size={15} />

                          {formatDate(
                            registration.event_date
                          )}
                        </div>

                        <div>
                          <Clock size={15} />

                          {formatTime(
                            registration.event_time
                          )}
                        </div>

                      </div>


                      <div className="registration-location">

                        <MapPin size={15} />

                        {registration.event_venue ||
                          "Venue not available"}

                      </div>

                    </div>


                    {/* ================= STATUS ================= */}

                    <div className="registration-status-area">

                      <span
                        className={getStatusClass(
                          registration.status
                        )}
                      >

                        {getStatusIcon(
                          registration.status
                        )}

                        {registration.status ||
                          "Confirmed"}

                      </span>


                      <Link
                        to="/student/tickets"
                        className="ticket-button"
                      >

                        View Ticket

                        <ArrowRight size={14} />

                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

      </section>


      {/* ================= BOTTOM CTA ================= */}

      <section className="registration-bottom">

        <div className="registration-bottom-icon">
          <CalendarDays size={23} />
        </div>

        <div>

          <h3>
            Looking for more events?
          </h3>

          <p>
            Discover workshops, competitions,
            seminars, cultural events and more.
          </p>

        </div>

        <Link to="/events">

          Explore Events

          <ArrowRight size={15} />

        </Link>

      </section>

    </div>
  );
};

export default MyRegistrations;