import React, { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminEvents.css";

function AdminEvents() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH REAL EVENTS FROM DATABASE
  // ==========================================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin/events/")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load events (${response.status})`
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log("Events from database:", data);

        setEvents(data.events || []);
        setError("");
      })
      .catch((err) => {
        console.error("Events API error:", err);
        setError("Unable to load events from database.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredEvents = events.filter((event) => {
    const value = search.toLowerCase();

    return (
      (event.title || "").toLowerCase().includes(value) ||
      (event.organizer || "").toLowerCase().includes(value) ||
      (event.location || "").toLowerCase().includes(value) ||
      (event.category || "").toLowerCase().includes(value)
    );
  });

  // ==========================================
  // EVENT STATUS
  // ==========================================

  const getEventStatus = (status) => {
    if (status === "published") {
      return "Published";
    }

    if (status === "draft") {
      return "Draft";
    }

    if (status === "cancelled") {
      return "Cancelled";
    }

    return status;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-events-page">
        <div className="admin-dashboard-loading">
          Loading events...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-events-page">
        <div className="admin-dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-events-page">

      {/* =========================
          HEADER
      ========================== */}

      <section className="admin-events-header">

        <div className="admin-events-heading">

          <span className="admin-events-eyebrow">
            EVENT MANAGEMENT
          </span>

          <h1>
            Events
          </h1>

          <p>
            View and manage all events created on the
            EventHub platform.
          </p>

        </div>

        <div className="admin-events-total-card">

          <div className="admin-events-total-icon">
            <CalendarDays size={23} />
          </div>

          <div>
            <strong>
              {events.length}
            </strong>

            <span>
              Total Events
            </span>
          </div>

        </div>

      </section>


      {/* =========================
          SEARCH + CREATE
      ========================== */}

      <section className="admin-events-toolbar">

        <div className="admin-events-search">

          <Search size={21} />

          <input
            type="text"
            placeholder="Search event, organizer or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          type="button"
          className="admin-create-event-btn"
          onClick={() =>
            navigate("/organizer/create-event")
          }
        >
          <Plus size={18} />
          Create Event
        </button>

      </section>


      {/* =========================
          EVENTS PANEL
      ========================== */}

      <section className="admin-events-panel">

        <div className="admin-events-panel-header">

          <div>

            <span className="admin-events-panel-label">
              EVENT MANAGEMENT
            </span>

            <h2>
              All Events
            </h2>

            <p>
              Showing {filteredEvents.length} events
            </p>

          </div>

          <div className="admin-events-panel-icon">
            <CalendarDays size={21} />
          </div>

        </div>


        {/* =========================
            EVENT GRID
        ========================== */}

        <div className="admin-events-grid">

          {filteredEvents.length > 0 ? (

            filteredEvents.map((event) => (

              <article
                className="admin-event-card"
                key={event.id}
              >

                {/* EVENT IMAGE */}

                <div className="admin-event-image">

                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                    />
                  ) : (
                    <>
                      <CalendarDays size={43} />

                      <span>
                        No Event Image
                      </span>
                    </>
                  )}

                </div>


                {/* EVENT CONTENT */}

                <div className="admin-event-content">

                  <div className="admin-event-top">

                    <span
                      className={`admin-event-status ${
                        event.status === "published"
                          ? "event-upcoming"
                          : event.status === "cancelled"
                          ? "event-completed"
                          : ""
                      }`}
                    >
                      {getEventStatus(event.status)}
                    </span>

                    <span className="admin-event-id">
                      #{event.id}
                    </span>

                  </div>


                  <h3>
                    {event.title}
                  </h3>


                  <p className="admin-event-organizer">
                    {event.organizer || "Unknown Organizer"}
                  </p>


                  <div className="admin-event-details">

                    <div>
                      <CalendarDays size={15} />

                      <span>
                        {event.date}
                      </span>
                    </div>

                    <div>
                      <MapPin size={15} />

                      <span>
                        {event.location}
                      </span>
                    </div>

                  </div>


                  <div className="admin-event-footer">

                    <div className="admin-participant-count">

                      <strong>
                        {event.participants}
                      </strong>

                      <span>
                        Participants
                      </span>

                    </div>


                    <div className="admin-event-actions">

                      <button
                        type="button"
                        className="admin-event-action view"
                        title="View Event"
                        onClick={() =>
                          navigate(`/event/${event.id}`)
                        }
                      >
                        <Eye size={16} />
                      </button>


                      <button
                        type="button"
                        className="admin-event-action edit"
                        title="Edit Event"
                        onClick={() =>
                          navigate(
                            `/organizer/events/${event.id}/edit`
                          )
                        }
                      >
                        <Pencil size={16} />
                      </button>


                      <button
                        type="button"
                        className="admin-event-action delete"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>

              </article>

            ))

          ) : (

            <div className="admin-no-events">

              <CalendarDays size={44} />

              <h3>
                No Events Found
              </h3>

              <p>
                {search
                  ? "Try searching with a different keyword."
                  : "There are no events in the database yet."}
              </p>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default AdminEvents;