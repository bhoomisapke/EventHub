import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="my-events-container">

        {/* BACK ARROW */}
        <Link
          to="/organizer/dashboard"
          className="my-events-back-arrow"
          aria-label="Back to Dashboard"
        >
          ←
        </Link>

        {/* PAGE HEADER */}
        <div className="my-events-header">
          <div>
            <h1>My Events</h1>
            <p>Manage the events you have created.</p>
          </div>
        </div>

        {/* EVENTS */}
        {events.length === 0 ? (
          <div className="my-events-empty">
            <h2>No events created yet</h2>
            <p>
              You don't have any events created at the moment.
            </p>
          </div>
        ) : (
          <div className="my-events-grid">
            {events.map((event) => (
              <article
                className="my-event-card"
                key={event.id}
              >
                {/* IMAGE */}
                <div className="my-event-image">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <div className="my-event-no-image">
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="my-event-content">

                  <div className="my-event-category">
                    {event.category || "Event"}
                  </div>

                  <h2>{event.title}</h2>

                  {/* EVENT INFO */}
                  <div className="my-event-info">

                    <div>
                      <span>📅</span>
                      <strong>{event.date}</strong>
                    </div>

                    <div>
                      <span>◷</span>
                      <strong>
                        {event.time || "Not specified"}
                      </strong>
                    </div>

                    <div>
                      <span>⌖</span>
                      <strong>
                        {event.venue || "Not specified"}
                      </strong>
                    </div>

                  </div>

                  {/* REGISTRATION */}
                  <div className="my-event-registration">
                    <div>
                      <span>Registrations</span>

                      <strong>
                        {event.participants || 0}
                        {event.capacity
                          ? ` / ${event.capacity}`
                          : ""}
                      </strong>
                    </div>

                    {event.capacity && (
                      <div className="registration-progress">
                        <span
                          style={{
                            width: `${Math.min(
                              ((event.participants || 0) /
                                event.capacity) *
                                100,
                              100
                            )}%`,
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
                      Edit Event
                    </Link>

                    <Link
                      to={`/organizer/events/${event.id}/participants`}
                      className="participants-event-button"
                    >
                      Participants
                    </Link>

                    <button
                      className="delete-event-button"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyEvents;