import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  Pencil,
  Trash2,
  UserRound,
  Plus,
  Sparkles,
} from "lucide-react";
import Notification from "../../components/Notification";
import "./MyEvents.css";

function MyEvents() {
  const [events, setEvents] = useState([]);

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });

  const [deleteEventId, setDeleteEventId] = useState(null);

  /* =========================================================
     NOTIFICATION
  ========================================================= */

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });
  };

  const closeNotification = () => {
    setNotification({
      message: "",
      type: "success",
    });
  };

  /* =========================================================
     GET AUTH TOKEN
  ========================================================= */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      ""
    );
  };

  /* =========================================================
     FETCH ORGANIZER EVENTS
  ========================================================= */

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = getToken();

        if (!token) {
          showNotification(
            "Your login session was not found. Please login again.",
            "error"
          );
          return;
        }

        const response = await fetch(
          "http://localhost:8000/api/events/my/",
          {
            method: "GET",
            headers: {
              Authorization: `Token ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        console.log("My Events Status:", response.status);
        console.log("My Events Response:", data);

        if (!response.ok) {
          if (response.status === 401) {
            showNotification(
              "Authentication failed. Please login again.",
              "error"
            );
            return;
          }

          if (response.status === 403) {
            showNotification(
              "Only organizers can view their events.",
              "error"
            );
            return;
          }

          showNotification(
            data.detail ||
              data.message ||
              "Failed to fetch events.",
            "error"
          );

          return;
        }

        setEvents(
          Array.isArray(data)
            ? data
            : data.results || []
        );
      } catch (error) {
        console.error("Fetch events error:", error);

        showNotification(
          "Unable to connect to the backend.",
          "error"
        );
      }
    };

    fetchEvents();
  }, []);

  /* =========================================================
     OPEN DELETE CONFIRMATION
  ========================================================= */

  const handleDelete = (id) => {
    setDeleteEventId(id);
  };

  /* =========================================================
     CONFIRM DELETE
  ========================================================= */

  const confirmDelete = async () => {
    if (!deleteEventId) {
      return;
    }

    const id = deleteEventId;

    setDeleteEventId(null);

    try {
      const token = getToken();

      if (!token) {
        showNotification(
          "Your login session has expired. Please login again.",
          "error"
        );
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/events/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log(
        "Delete Event Status:",
        response.status
      );

      if (response.ok) {
        setEvents((previousEvents) =>
          previousEvents.filter(
            (event) => event.id !== id
          )
        );

        showNotification(
          "Event deleted successfully.",
          "success"
        );

        return;
      }

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.error(
        "Delete event rejected:",
        data
      );

      if (response.status === 401) {
        showNotification(
          "Authentication failed. Please login again.",
          "error"
        );
        return;
      }

      if (response.status === 403) {
        showNotification(
          "You do not have permission to delete this event.",
          "error"
        );
        return;
      }

      if (response.status === 404) {
        showNotification(
          "Event not found.",
          "error"
        );
        return;
      }

      showNotification(
        data.detail ||
          data.message ||
          "Failed to delete event.",
        "error"
      );
    } catch (error) {
      console.error(
        "Delete event error:",
        error
      );

      showNotification(
        "Unable to connect to the backend.",
        "error"
      );
    }
  };

  /* =========================================================
     CANCEL DELETE
  ========================================================= */

  const cancelDelete = () => {
    setDeleteEventId(null);
  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="my-events-page">

      {/* =====================================================
          NOTIFICATION
      ===================================================== */}

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deleteEventId && (
        <div className="delete-confirm-overlay">

          <div className="delete-confirm-modal">

            <div className="delete-confirm-icon">
              <Trash2 size={24} />
            </div>

            <h3>
              Delete Event?
            </h3>

            <p>
              Are you sure you want to delete this event?
              This action cannot be undone.
            </p>

            <div className="delete-confirm-actions">

              <button
                type="button"
                className="delete-cancel-button"
                onClick={cancelDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={confirmDelete}
              >
                <Trash2 size={15} />
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

      <div className="my-events-glow glow-one"></div>

      <div className="my-events-glow glow-two"></div>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="my-events-container">

        {/* ===================================================
            TOP SECTION
        =================================================== */}

        <div className="my-events-top">

          <div className="my-events-heading">

            <span className="my-events-label">
              <Sparkles size={14} />
              ORGANIZER EVENTS
            </span>

            <h1>
              My <span>Events.</span>
            </h1>

            <p>
              Manage, edit and monitor the events you have created.
            </p>

          </div>

          <Link
            to="/organizer/create-event"
            className="my-events-create-button"
          >
            <Plus size={19} />
            Create Event
          </Link>

        </div>

        {/* ===================================================
            EVENT COUNT
        =================================================== */}

        {events.length > 0 && (
          <div className="my-events-summary">

            <div className="summary-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <strong>
                {events.length}
              </strong>

              <span>
                {events.length === 1
                  ? " Event created"
                  : " Events created"}
              </span>
            </div>

          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {events.length === 0 ? (

          <div className="my-events-empty">

            <div className="empty-icon">
              <CalendarDays size={35} />
            </div>

            <span className="empty-label">
              NO EVENTS YET
            </span>

            <h2>
              Create your first event.
            </h2>

            <p>
              You don't have any events created at the moment.
              Start by creating an event for your students.
            </p>

          </div>

        ) : (

          /* =================================================
             EVENTS GRID
          ================================================= */

          <div className="my-events-grid">

            {events.map((event) => {

              const participants =
                event.participants || 0;

              const capacity = event.capacity
                ? Number(event.capacity)
                : 0;

              const registrationPercentage =
                capacity
                  ? Math.min(
                      (participants / capacity) * 100,
                      100
                    )
                  : 0;

              /* =============================================
                 IMAGE URL
              ============================================= */

              let imageUrl = "";

              if (event.image) {
                if (
                  event.image.startsWith("http://") ||
                  event.image.startsWith("https://") ||
                  event.image.startsWith("data:")
                ) {
                  imageUrl = event.image;
                } else {
                  imageUrl =
                    `http://localhost:8000${event.image}`;
                }
              }

              return (
                <article
                  className="my-event-card"
                  key={event.id}
                >

                  {/* =========================================
                      EVENT IMAGE
                  ========================================= */}

                  <div className="my-event-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={event.title}
                      />

                    ) : (

                      <div className="my-event-no-image">

                        <CalendarDays size={42} />

                        <span>
                          EVENTHUB
                        </span>

                      </div>

                    )}

                    <div className="event-image-overlay"></div>

                    <div className="event-category-badge">
                      {event.category || "Event"}
                    </div>

                  </div>

                  {/* =========================================
                      EVENT CONTENT
                  ========================================= */}

                  <div className="my-event-content">

                    <h2>
                      {event.title}
                    </h2>

                    {/* =======================================
                        EVENT INFORMATION
                    ======================================= */}

                    <div className="my-event-info">

                      {/* DATE */}

                      <div className="event-info-item">

                        <span className="event-info-icon">
                          <CalendarDays size={16} />
                        </span>

                        <div>

                          <small>
                            Date
                          </small>

                          <strong>
                            {event.date ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                      {/* TIME */}

                      <div className="event-info-item">

                        <span className="event-info-icon">
                          <Clock3 size={16} />
                        </span>

                        <div>

                          <small>
                            Time
                          </small>

                          <strong>
                            {event.time ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                      {/* VENUE */}

                      <div className="event-info-item">

                        <span className="event-info-icon">
                          <MapPin size={16} />
                        </span>

                        <div>

                          <small>
                            Venue
                          </small>

                          <strong>
                            {event.venue ||
                              "Not specified"}
                          </strong>

                        </div>

                      </div>

                    </div>

                    {/* =======================================
                        REGISTRATION
                    ======================================= */}

                    <div className="my-event-registration">

                      <div className="registration-heading">

                        <div className="registration-title">

                          <Users size={16} />

                          <span>
                            Registrations
                          </span>

                        </div>

                        <strong>
                          {participants}
                          {capacity
                            ? ` / ${capacity}`
                            : ""}
                        </strong>

                      </div>

                      {capacity > 0 && (
                        <div className="registration-progress">

                          <span
                            style={{
                              width: `${registrationPercentage}%`,
                            }}
                          />

                        </div>
                      )}

                    </div>

                    {/* =======================================
                        ACTION BUTTONS
                    ======================================= */}

                    <div className="my-event-actions">

                      {/* EDIT */}

                      <Link
                        to={`/organizer/events/${event.id}/edit`}
                        className="edit-event-button"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      {/* PARTICIPANTS */}

                      <Link
                        to={`/organizer/events/${event.id}/participants`}
                        className="participants-event-button"
                      >
                        <UserRound size={15} />
                        Participants
                      </Link>

                      {/* DELETE */}

                      <button
                        type="button"
                        className="delete-event-button"
                        onClick={() =>
                          handleDelete(event.id)
                        }
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyEvents;