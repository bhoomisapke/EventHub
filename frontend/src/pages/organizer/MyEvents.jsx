import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
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
import "./MyEvents.css";

function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/events/"
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to fetch events.");
          return;
        }

        setEvents(data);
      } catch (error) {
        console.error("Fetch events error:", error);
        alert("Unable to connect to the backend.");
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/events/${id}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to delete event.";

        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // No JSON response from backend
        }

        alert(errorMessage);
        return;
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event.id !== id)
      );

      alert("Event deleted successfully.");
    } catch (error) {
      console.error("Delete event error:", error);
      alert("Unable to connect to the backend.");
    }
  };

  return (
    <div className="my-events-page">

      {/* Decorative background */}

      <div className="my-events-glow glow-one"></div>
      <div className="my-events-glow glow-two"></div>


      <div className="my-events-container">

        {/* =========================================
            PAGE TOP
        ========================================= */}

        <div className="my-events-top">

          <Link
            to="/organizer/dashboard"
            className="my-events-back-arrow"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft size={19} />
          </Link>

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
            <Plus size={18} />
            Create Event
          </Link>

        </div>


        {/* =========================================
            EVENT COUNT
        ========================================= */}

        {events.length > 0 && (
          <div className="my-events-summary">

            <div className="summary-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <strong>{events.length}</strong>
              <span>
                {events.length === 1
                  ? " Event created"
                  : " Events created"}
              </span>
            </div>

          </div>
        )}


        {/* =========================================
            EVENTS
        ========================================= */}

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

            <Link
              to="/organizer/create-event"
              className="empty-create-button"
            >
              <Plus size={18} />
              Create Event
            </Link>

          </div>

        ) : (

          <div className="my-events-grid">

            {events.map((event) => {

              const participants = event.participants || 0;

              const capacity = event.capacity
                ? Number(event.capacity)
                : 0;

              const registrationPercentage = capacity
                ? Math.min(
                    (participants / capacity) * 100,
                    100
                  )
                : 0;

              return (
                <article
                  className="my-event-card"
                  key={event.id}
                >

                  {/* =================================
                      IMAGE
                  ================================= */}

                  <div className="my-event-image">

                    {event.image ? (

                      <img
                        src={event.image}
                        alt={event.title}
                      />

                    ) : (

                      <div className="my-event-no-image">
                        <CalendarDays size={42} />
                        <span>EVENTHUB</span>
                      </div>

                    )}

                    <div className="event-image-overlay"></div>

                    <div className="event-category-badge">
                      {event.category || "Event"}
                    </div>

                  </div>


                  {/* =================================
                      CONTENT
                  ================================= */}

                  <div className="my-event-content">

                    <h2>
                      {event.title}
                    </h2>

                    {/* EVENT INFORMATION */}

                    <div className="my-event-info">

                      <div className="event-info-item">
                        <span className="event-info-icon">
                          <CalendarDays size={16} />
                        </span>

                        <div>
                          <small>Date</small>
                          <strong>
                            {event.date || "Not specified"}
                          </strong>
                        </div>
                      </div>


                      <div className="event-info-item">
                        <span className="event-info-icon">
                          <Clock3 size={16} />
                        </span>

                        <div>
                          <small>Time</small>
                          <strong>
                            {event.time || "Not specified"}
                          </strong>
                        </div>
                      </div>


                      <div className="event-info-item">
                        <span className="event-info-icon">
                          <MapPin size={16} />
                        </span>

                        <div>
                          <small>Venue</small>
                          <strong>
                            {event.venue || "Not specified"}
                          </strong>
                        </div>
                      </div>

                    </div>


                    {/* REGISTRATIONS */}

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
                          {capacity ? ` / ${capacity}` : ""}
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


                    {/* ACTIONS */}

                    <div className="my-event-actions">

                      <Link
                        to={`/organizer/events/${event.id}/edit`}
                        className="edit-event-button"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>


                      <Link
                        to={`/organizer/events/${event.id}/participants`}
                        className="participants-event-button"
                      >
                        <UserRound size={15} />
                        Participants
                      </Link>


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