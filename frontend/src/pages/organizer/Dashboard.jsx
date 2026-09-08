import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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

  const displayedEvents = events;

  const totalEvents = events.length;

  const upcomingEvents = events.filter((event) => {
    if (!event.date) return false;

    const eventDate = new Date(event.date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return eventDate >= today;
  }).length;

  const totalParticipants = events.reduce(
    (total, event) =>
      total + Number(event.participants || 0),
    0
  );

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div className="organizer-dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="organizer-topbar">

        <Link
          to="/organizer/dashboard"
          className="organizer-brand"
        >
          Event<span>Hub</span>
        </Link>

        <nav className="organizer-navigation">

          <Link
            to="/organizer/dashboard"
            className="organizer-navigation-link active"
          >
            <span className="nav-icon">⌂</span>
            Dashboard
          </Link>

          <Link
            to="/organizer/events"
            className="organizer-navigation-link"
          >
            <span className="nav-icon">▣</span>
            My Events
          </Link>

          <Link
            to="/organizer/events"
            className="organizer-navigation-link"
          >
            <span className="nav-icon">♧</span>
            Participants
          </Link>

        </nav>

        {/* CREATE EVENT BUTTON */}

        <Link
          to="/organizer/create-event"
          className="organizer-create-button"
        >
          <span>+</span>
          Create Event
        </Link>

        {/* ================= ORGANIZER PROFILE ================= */}

        <div className="organizer-user-section">

          {/* PROFILE */}

          <Link
            to="/organizer/profile"
            className="organizer-user-profile"
          >

            <div className="organizer-user-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M5 20C5.8 16.5 8.2 14.5 12 14.5C15.8 14.5 18.2 16.5 19 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

            </div>

            <div className="organizer-user-info">

              <strong>
                Organizer
              </strong>

              <small>
                My Profile
              </small>

            </div>

          </Link>

          {/* LOGOUT ICON */}

          <button
            type="button"
            className="organizer-logout-button"
            onClick={handleLogout}
            title="Logout"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <path
                d="M10 4H6.5C5.67 4 5 4.67 5 5.5V18.5C5 19.33 5.67 20 6.5 20H10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              <path
                d="M13 8L17 12L13 16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M9 12H17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

            </svg>

          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="organizer-dashboard-main">

        {/* ================= HERO ================= */}

        <section className="clean-organizer-hero">

          <div className="clean-hero-content">

            <div className="clean-hero-label">
              <span></span>
              ORGANIZER
            </div>

            <h1>
              Bring your
              <br />
              <span>best events</span> to life.
            </h1>

            <p>
              Create and manage your events, track registrations,
              <br />
              and connect with students through EventHub.
            </p>

            <div className="clean-hero-features">

              <div className="clean-feature">

                <div className="clean-feature-icon">
                  ▣
                </div>

                <div>
                  <strong>My Events</strong>
                  <small>Events created by you</small>
                </div>

              </div>

              <div className="clean-feature">

                <div className="clean-feature-icon pink">
                  ♧
                </div>

                <div>
                  <strong>Participants</strong>
                  <small>View event registrations</small>
                </div>

              </div>

            </div>

          </div>


          {/* HERO VISUAL */}

          <div className="clean-hero-visual">

            <div className="hero-gradient-square"></div>

            <div className="hero-gradient-circle"></div>

            <div className="clean-hero-card">

              <div className="clean-card-header">

                <strong>
                  EVENTHUB
                </strong>

                <span>
                  <i></i>
                  ORGANIZER
                </span>

              </div>

              <div className="clean-card-center">

                <small>
                  MY EVENTS
                </small>

                <strong>
                  {totalEvents}
                </strong>

                <span>
                  {totalEvents === 1
                    ? "event created"
                    : "events created"}
                </span>

              </div>

              <div className="clean-card-footer">
                <span>CREATE</span>
                <span>MANAGE</span>
                <span>CONNECT</span>
              </div>

            </div>


            <div className="clean-floating-card floating-create">

              <div className="floating-round-icon">
                ✦
              </div>

              <div>
                <strong>Create</strong>
                <small>New event</small>
              </div>

            </div>


            <div className="clean-floating-card floating-users">

              <div className="floating-round-icon pink">
                ♧
              </div>

              <div>
                <strong>Participants</strong>
                <small>Manage registrations</small>
              </div>

            </div>

          </div>

        </section>


        {/* ================= STATISTICS ================= */}

        <section className="clean-statistics">

          <div className="clean-stat-card">

            <div className="clean-stat-icon">
              ✦
            </div>

            <span>
              Total Events
            </span>

            <strong>
              {totalEvents}
            </strong>

            <small>
              Events created by you
            </small>

          </div>


          <div className="clean-stat-card">

            <div className="clean-stat-icon pink">
              ◷
            </div>

            <span>
              Upcoming Events
            </span>

            <strong>
              {upcomingEvents}
            </strong>

            <small>
              Events scheduled ahead
            </small>

          </div>


          <div className="clean-stat-card">

            <div className="clean-stat-icon purple">
              ◎
            </div>

            <span>
              Total Participants
            </span>

            <strong>
              {totalParticipants}
            </strong>

            <small>
              Registrations across your events
            </small>

          </div>

        </section>


        {/* ================= MY EVENTS ================= */}

        <section className="clean-events-section">

          <div className="clean-events-heading">

            <div>

              <h2>
                My Events
              </h2>

              <p>
                Events created and managed by you.
              </p>

            </div>

            <Link
              to="/organizer/events"
              className="clean-view-all"
            >
              View all
              <span>→</span>
            </Link>

          </div>


          <div className="clean-events-grid">

            {displayedEvents.map((event) => {

              const percentage = event.capacity
                ? Math.min(
                    ((event.participants || 0) /
                      event.capacity) *
                      100,
                    100
                  )
                : 0;

              return (
                <article
                  className="clean-event-card"
                  key={event.id}
                >

                  {/* IMAGE */}

                  <div className="clean-event-image">

                    <img
                      src={event.image}
                      alt={event.title}
                    />

                    <span className="clean-category">
                      {event.category}
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="clean-event-content">

                    <div className="clean-event-date">

                      <span>
                        ▣
                      </span>

                      {event.date}

                    </div>

                    <h3>
                      {event.title}
                    </h3>


                    <div className="clean-event-meta">

                      <span>
                        ◷ {event.time || "Not specified"}
                      </span>

                      <span>
                        ⌖ {event.venue || "Not specified"}
                      </span>

                    </div>


                    {/* DEADLINE */}

                    <div className="clean-deadline">

                      <span>
                        ◷
                      </span>

                      <strong>
                        Registration Deadline
                      </strong>

                      <b>
                        {event.registrationDeadline ||
                          "Not specified"}
                      </b>

                    </div>


                    {/* REGISTRATIONS */}

                    <div className="clean-registration">

                      <div className="registration-heading">

                        <span>
                          Registrations
                        </span>

                        <strong>

                          {event.participants || 0}

                          <small>
                            / {event.capacity || 0}
                          </small>

                        </strong>

                      </div>


                      <div className="clean-progress-row">

                        <div className="clean-progress">

                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></span>

                        </div>

                        <b>
                          {Math.round(percentage)}%
                        </b>

                      </div>

                    </div>


                    {/* ONLY VIEW DETAILS BUTTON */}

                    <div className="clean-event-actions">

                      <Link
                        to={`/organizer/events/${event.id}`}
                        className="view-event-button"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        </section>


      

      </main>

    </div>
  );
}

export default Dashboard;