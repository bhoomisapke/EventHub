import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  MapPin,
  Plus,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

import "./Dashboard.css";

const API_BASE = "http://localhost:8000";

/* ============================================================
   AUTH TOKEN
============================================================ */

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

/* ============================================================
   API HELPERS
============================================================ */

async function apiRequest(url, options = {}) {
  const token = getAuthToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = errorData.detail;
      } else if (errorData?.message) {
        message = errorData.message;
      } else {
        message = JSON.stringify(errorData);
      }
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* ============================================================
   IMAGE
============================================================ */

function getImageUrl(image) {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_BASE}${image.startsWith("/") ? "" : "/"}${image}`;
}

/* ============================================================
   DATE / TIME HELPERS
============================================================ */

function formatDate(dateValue) {
  if (!dateValue) return "Date not set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateParts(dateValue) {
  if (!dateValue) {
    return {
      day: "--",
      month: "---",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      day: "--",
      month: "---",
    };
  }

  return {
    day: date.toLocaleDateString("en-US", {
      day: "2-digit",
    }),

    month: date
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase(),
  };
}

function formatTime(timeValue) {
  if (!timeValue) return "Time not set";

  const parts = timeValue.split(":");

  if (parts.length < 2) {
    return timeValue;
  }

  const date = new Date();

  date.setHours(
    Number(parts[0]),
    Number(parts[1]),
    0,
    0
  );

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ============================================================
   EVENT DATA HELPERS
============================================================ */

function getParticipants(event) {
  return Number(
    event?.participants ??
      event?.participantCount ??
      event?.registeredParticipants ??
      event?.registrations_count ??
      event?.registration_count ??
      0
  );
}

function getCapacity(event) {
  const capacity = Number(event?.capacity ?? 0);

  return capacity > 0 ? capacity : 0;
}

function getRegistrationPercentage(event) {
  const participants = getParticipants(event);
  const capacity = getCapacity(event);

  if (!capacity) return 0;

  return Math.min(
    100,
    Math.round((participants / capacity) * 100)
  );
}

/*
  Django backend currently uses:
  draft
  published
  cancelled

  The dashboard also supports:
  upcoming
  ongoing
  completed
*/
function getStatus(event) {
  const backendStatus = String(
    event?.status || ""
  ).toLowerCase();

  if (backendStatus === "published") {
    return "upcoming";
  }

  if (backendStatus === "draft") {
    return "draft";
  }

  if (backendStatus === "cancelled") {
    return "cancelled";
  }

  if (
    backendStatus === "upcoming" ||
    backendStatus === "ongoing" ||
    backendStatus === "completed"
  ) {
    return backendStatus;
  }

  return "upcoming";
}

function statusLabel(status) {
  const labels = {
    upcoming: "UPCOMING",
    ongoing: "ONGOING",
    completed: "COMPLETED",
    cancelled: "CANCELLED",
    draft: "DRAFT",
  };

  return labels[status] || status.toUpperCase();
}

function sortByDate(events) {
  return [...events].sort((a, b) => {
    const first = new Date(
      `${a.date || ""}T${a.time || "00:00"}`
    ).getTime();

    const second = new Date(
      `${b.date || ""}T${b.time || "00:00"}`
    ).getTime();

    return first - second;
  });
}

/* ============================================================
   DASHBOARD
============================================================ */

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* ==========================================================
     LOAD ORGANIZER EVENTS
  ========================================================== */

  useEffect(() => {
    let isMounted = true;

    async function loadMyEvents() {
      try {
        setLoading(true);
        setError("");

        /*
          IMPORTANT:

          This endpoint returns events belonging to the
          currently logged-in organizer.

          Backend:
          GET /api/events/my/
        */

        const data = await apiRequest(
          `${API_BASE}/api/events/my/`
        );

        const eventList = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        if (isMounted) {
          setEvents(eventList);
        }
      } catch (err) {
        console.error(
          "Organizer dashboard event fetch error:",
          err
        );

        if (isMounted) {
          setEvents([]);

          setError(
            err?.message ||
              "Unable to load your events. Please make sure the backend is running and you are logged in."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMyEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ==========================================================
     STATISTICS
  ========================================================== */

  const statistics = useMemo(() => {
    const totalEvents = events.length;

    const upcomingEvents = events.filter(
      (event) => getStatus(event) === "upcoming"
    ).length;

    const ongoingEvents = events.filter(
      (event) => getStatus(event) === "ongoing"
    ).length;

    const totalParticipants = events.reduce(
      (total, event) =>
        total + getParticipants(event),
      0
    );

    return {
      totalEvents,
      upcomingEvents,
      ongoingEvents,
      totalParticipants,
    };
  }, [events]);

  /* ==========================================================
     SORT EVENTS
  ========================================================== */

  const sortedEvents = useMemo(
    () => sortByDate(events),
    [events]
  );

  const displayedEvents = sortedEvents.slice(0, 6);

  /* ==========================================================
     UPCOMING DEADLINES
  ========================================================== */

  const upcomingDeadlines = useMemo(() => {
    return [...events]
      .filter(
        (event) =>
          event.registration_deadline ||
          event.registrationDeadline
      )
      .sort((a, b) => {
        const first = new Date(
          a.registration_deadline ||
            a.registrationDeadline
        ).getTime();

        const second = new Date(
          b.registration_deadline ||
            b.registrationDeadline
        ).getTime();

        return first - second;
      })
      .slice(0, 3);
  }, [events]);

  /* ==========================================================
     RECENT ACTIVITY
  ========================================================== */

  const recentActivity = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const first = new Date(
          b.updated_at ||
            b.updatedAt ||
            b.created_at ||
            b.createdAt ||
            0
        ).getTime();

        const second = new Date(
          a.updated_at ||
            a.updatedAt ||
            a.created_at ||
            a.createdAt ||
            0
        ).getTime();

        return first - second;
      })
      .slice(0, 3);
  }, [events]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="organizer-dashboard-page">
      <main className="organizer-dashboard-main">

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="clean-organizer-hero">
          <div className="clean-hero-content">

            <div className="clean-hero-label">
              <span />
              ORGANIZER PANEL
            </div>

            <h1>
              Welcome back,
              <br />
              <span>Event Organizer.</span>
            </h1>

            <p>
              Create memorable experiences, manage your events,
              <br />
              and keep your participants connected.
            </p>

            <div className="clean-hero-actions">

              <Link
                to="/organizer/create-event"
                className="dashboard-primary-button"
              >
                <Plus size={17} />
                Create Event
              </Link>

              <Link
                to="/organizer/events"
                className="dashboard-glass-button"
              >
                View My Events
                <ArrowRight size={15} />
              </Link>

            </div>

            <div className="clean-hero-features">

              <div className="clean-feature">

                <div className="clean-feature-icon">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <strong>Plan events</strong>
                  <small>
                    Keep everything organized
                  </small>
                </div>

              </div>

              <div className="clean-feature">

                <div className="clean-feature-icon pink">
                  <Users size={18} />
                </div>

                <div>
                  <strong>
                    Manage participants
                  </strong>

                  <small>
                    Track registrations easily
                  </small>
                </div>

              </div>

            </div>

          </div>

          {/* ===================================================
              HERO VISUAL
          ==================================================== */}

          <div
            className="clean-hero-visual"
            aria-hidden="true"
          >

            <div className="hero-visual-glow" />

            <div className="hero-grid-pattern" />

            <div className="hero-gradient-square" />

            <div className="hero-gradient-circle" />

            <div className="clean-hero-card">

              <div className="clean-card-header">

                <div>
                  <i />
                  EVENTHUB
                </div>

                <span>ORGANIZER</span>

              </div>

              <div className="clean-card-center">

                <small>EVENTS CREATED</small>

                <strong>
                  {statistics.totalEvents}
                </strong>

                <span>
                  events in your dashboard
                </span>

              </div>

              <div className="clean-card-footer">

                <span>
                  {statistics.upcomingEvents} UPCOMING
                </span>

                <span>
                  {statistics.ongoingEvents} LIVE
                </span>

                <span>
                  {statistics.totalParticipants} PEOPLE
                </span>

              </div>

            </div>

            <div className="clean-floating-card floating-create">

              <div className="floating-round-icon">
                <CalendarPlus size={17} />
              </div>

              <div>
                <strong>Create Event</strong>

                <small>
                  Build your next experience
                </small>
              </div>

            </div>

            <div className="clean-floating-card floating-users">

              <div className="floating-round-icon pink">
                <Users size={17} />
              </div>

              <div>
                <strong>
                  {statistics.totalParticipants}
                </strong>

                <small>
                  Total participants
                </small>
              </div>

            </div>

            <div className="hero-mini-orbit orbit-one" />

            <div className="hero-mini-orbit orbit-two" />

          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ====================================================== */}

        <section className="organizer-dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon purple">
              <CalendarDays size={20} />
            </div>

            <div>
              <span>Total Events</span>

              <strong>
                {statistics.totalEvents}
              </strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon pink">
              <Timer size={20} />
            </div>

            <div>
              <span>Upcoming Events</span>

              <strong>
                {statistics.upcomingEvents}
              </strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon blue">
              <Activity size={20} />
            </div>

            <div>
              <span>Live Events</span>

              <strong>
                {statistics.ongoingEvents}
              </strong>
            </div>

          </div>

          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon purple">
              <Users size={20} />
            </div>

            <div>
              <span>Participants</span>

              <strong>
                {statistics.totalParticipants}
              </strong>
            </div>

          </div>

        </section>

        {/* =====================================================
            MY EVENTS
        ====================================================== */}

        <section className="dashboard-panel events-panel">

          <div className="dashboard-panel-heading">

            <div>
              <span className="dashboard-section-label">
                YOUR EVENTS
              </span>

              <h2>My Events</h2>
            </div>

            <Link
              to="/organizer/events"
              className="dashboard-panel-link"
            >
              View all
              <ArrowRight size={15} />
            </Link>

          </div>

          {/* ERROR */}

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="dashboard-loading">
              <div className="dashboard-loading-spinner" />
              <span>Loading your events...</span>
            </div>
          ) : displayedEvents.length === 0 ? (

            /* EMPTY */

            <div className="dashboard-empty-wide">

              <Sparkles size={22} />

              <div>
                <strong>
                  No events created yet
                </strong>

                <span>
                  Create your first EventHub event to see it here.
                </span>
              </div>

              <Link
                to="/organizer/create-event"
                className="dashboard-primary-button"
              >
                <Plus size={16} />
                Create Event
              </Link>

            </div>

          ) : (

            /* EVENT GRID */

            <div className="eventhub-dashboard-event-grid">

              {displayedEvents.map((event, index) => {

                const imageUrl = getImageUrl(
                  event.image || event.image_url
                );

                const dateParts = getDateParts(
                  event.date
                );

                const status = getStatus(event);

                const participants =
                  getParticipants(event);

                const capacity =
                  getCapacity(event);

                const percentage =
                  getRegistrationPercentage(event);

                const deadline =
                  event.registration_deadline ||
                  event.registrationDeadline;

                return (

                  <article
                    className="eventhub-dashboard-event-card"
                    key={event.id}
                  >

                    {/* IMAGE */}

                    <div className="eventhub-dashboard-event-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            event.title || "Event"
                          }
                        />

                      ) : (

                        <div className="eventhub-event-image-placeholder">

                          <CalendarDays size={42} />

                          <span>
                            EVENTHUB
                          </span>

                        </div>

                      )}

                      <div className="eventhub-event-image-overlay" />

                      <div className="eventhub-event-category">
                        {String(
                          event.category || "EVENT"
                        ).toUpperCase()}
                      </div>

                      <div className="eventhub-event-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="eventhub-event-date">

                        <strong>
                          {dateParts.day}
                        </strong>

                        <span>
                          {dateParts.month}
                        </span>

                      </div>

                      <div
                        className={`eventhub-event-status status-${status}`}
                      >
                        {statusLabel(status)}
                      </div>

                    </div>

                    {/* EVENT INFO */}

                    <div className="eventhub-dashboard-event-info">

                      <h3>
                        {event.title ||
                          "Untitled Event"}
                      </h3>

                      <div className="eventhub-event-details">

                        <span>
                          <Clock3 size={12} />
                          {formatTime(event.time)}
                        </span>

                        <span>
                          <MapPin size={12} />
                          {event.venue ||
                            event.location ||
                            "Venue not set"}
                        </span>

                      </div>

                      {/* DEADLINE */}

                      <div className="eventhub-event-deadline">

                        <Timer size={14} />

                        <span>
                          Registration deadline
                        </span>

                        <strong>
                          {deadline
                            ? formatDate(deadline)
                            : "Not set"}
                        </strong>

                      </div>

                      {/* REGISTRATIONS */}

                      <div className="eventhub-registration">

                        <div className="eventhub-registration-heading">

                          <span>
                            Registrations
                          </span>

                          <strong>
                            {participants}

                            {capacity > 0
                              ? ` / ${capacity}`
                              : ""}
                          </strong>

                        </div>

                        <div className="eventhub-progress-row">

                          <div className="eventhub-progress">
                            <span
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <b>
                            {percentage}%
                          </b>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="eventhub-dashboard-event-actions">

                        <Link
                          to={`/organizer/events/${event.id}`}
                          className="eventhub-view-event"
                        >
                          <Eye size={14} />
                          View Event
                          <ArrowRight size={14} />
                        </Link>

                        <Link
                          to={`/organizer/events/${event.id}/edit`}
                          className="eventhub-edit-event"
                        >
                          <Edit3 size={14} />
                          Edit
                        </Link>

                        <Link
                          to={`/organizer/events/${event.id}/participants`}
                          className="eventhub-participants-event"
                        >
                          <Users size={14} />
                          Participants
                        </Link>

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

        {/* =====================================================
            LOWER DASHBOARD
        ====================================================== */}

        <section className="organizer-dashboard-lower-grid">

          {/* QUICK ACTIONS */}

          <div className="dashboard-panel quick-section">

            <div className="dashboard-panel-heading">

              <div>

                <span className="dashboard-section-label">
                  WORKSPACE
                </span>

                <h2>
                  Quick Actions
                </h2>

              </div>

            </div>

            <div className="quick-actions-grid">

              <Link
                to="/organizer/create-event"
                className="quick-action-card"
              >

                <div className="quick-action-icon pink">
                  <Plus size={19} />
                </div>

                <div>
                  <strong>
                    Create Event
                  </strong>

                  <small>
                    Publish a new event
                  </small>
                </div>

                <ArrowRight size={16} />

              </Link>

              <Link
                to="/organizer/events"
                className="quick-action-card"
              >

                <div className="quick-action-icon purple">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <strong>
                    Manage Events
                  </strong>

                  <small>
                    View and edit events
                  </small>
                </div>

                <ArrowRight size={16} />

              </Link>

              <Link
                to="/organizer/participants"
                className="quick-action-card"
              >

                <div className="quick-action-icon blue">
                  <Users size={19} />
                </div>

                <div>
                  <strong>
                    Participants
                  </strong>

                  <small>
                    Review registrations
                  </small>
                </div>

                <ArrowRight size={16} />

              </Link>

            </div>

          </div>

          {/* RECENT ACTIVITY */}

          <div className="dashboard-panel">

            <div className="dashboard-panel-heading">

              <div>

                <span className="dashboard-section-label">
                  ACTIVITY
                </span>

                <h2>
                  Recent Activity
                </h2>

              </div>

              <Activity size={18} />

            </div>

            <div className="recent-activity-list">

              {recentActivity.length === 0 ? (

                <div className="dashboard-empty-mini">

                  <Sparkles size={17} />

                  <span>
                    No recent activity yet.
                  </span>

                </div>

              ) : (

                recentActivity.map((event) => (

                  <div
                    className="recent-activity-item"
                    key={`activity-${event.id}`}
                  >

                    <div className="activity-dot">
                      <CheckCircle2 size={14} />
                    </div>

                    <div>

                      <strong>
                        {event.title ||
                          "Untitled Event"}
                      </strong>

                      <p>
                        Event is currently{" "}
                        <span>
                          {statusLabel(
                            getStatus(event)
                          ).toLowerCase()}
                        </span>
                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </section>

        {/* =====================================================
            UPCOMING DEADLINES
        ====================================================== */}

        <section className="dashboard-panel deadlines-panel">

          <div className="dashboard-panel-heading">

            <div>

              <span className="dashboard-section-label">
                STAY ON TRACK
              </span>

              <h2>
                Upcoming Deadlines
              </h2>

            </div>

            <Timer size={18} />

          </div>

          {upcomingDeadlines.length === 0 ? (

            <div className="dashboard-empty-wide">

              <CalendarDays size={20} />

              <span>
                No registration deadlines available.
              </span>

            </div>

          ) : (

            <div className="deadline-list">

              {upcomingDeadlines.map((event) => {

                const deadline =
                  event.registration_deadline ||
                  event.registrationDeadline;

                return (

                  <Link
                    to={`/organizer/events/${event.id}/edit`}
                    className="deadline-item"
                    key={`deadline-${event.id}`}
                  >

                    <div className="deadline-icon">
                      <Timer size={17} />
                    </div>

                    <div className="deadline-content">

                      <strong>
                        {event.title ||
                          "Untitled Event"}
                      </strong>

                      <span>
                        Deadline:{" "}
                        {formatDate(deadline)}
                      </span>

                    </div>

                    <ArrowRight size={16} />

                  </Link>

                );
              })}

            </div>

          )}

        </section>

        <div className="organizer-dashboard-footer-space" />

      </main>
    </div>
  );
}