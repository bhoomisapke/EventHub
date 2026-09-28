import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../components/EventCard";
import {
  CalendarDays,
  Ticket,
  Bookmark,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  Search,
} from "lucide-react";

import "./Dashboard.css";

// const myUpcomingRegistrations = [
//   {
//     id: 1,
//     title: "Tech Innovation Summit 2026",
//     category: "Technology",
//     date: "15 September 2026",
//     time: "10:00 AM",
//     location: "Main Auditorium",
//     status: "Confirmed",
//     image:
//       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
//   },
//   {
//     id: 2,
//     title: "Web Development Workshop",
//     category: "Workshop",
//     date: "20 September 2026",
//     time: "11:30 AM",
//     location: "Computer Lab 2",
//     status: "Confirmed",
//     image:
//       "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
//   },
//   {
//     id: 3,
//     title: "Robotics & AI Expo",
//     category: "Robotics",
//     date: "25 September 2026",
//     time: "9:30 AM",
//     location: "Innovation Hall",
//     status: "Confirmed",
//     image:
//       "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
//   },
// ];

const Dashboard = () => {

  const API_URL = "http://127.0.0.1:8000";

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardEvents = async () => {
      try {
        setEventsLoading(true);

        const response = await fetch(
          `${API_URL}/api/events/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail ||
            data?.message ||
            "Unable to load events."
          );
        }
        
        const eventList = Array.isArray(data)
          ? data
          : data.results || [];

        setEvents(eventList);
      } catch (error) {
        console.error("Dashboard events error:", error);
        setEventsError("Unable to load events.");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchDashboardEvents();
  }, []);
useEffect(() => {
  const fetchMyRegistrations = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setRegistrations([]);
      setRegistrationsLoading(false);
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

      if (!response.ok) {
        throw new Error("Unable to load registrations.");
      }
const data = await response.json();

const registrationList = Array.isArray(data)
  ? data
  : data.results || [];

// Only active registrations
const confirmedRegistrations = registrationList.filter(
  (registration) =>
    String(registration.status || "").toLowerCase() === "confirmed"
);

// Fetch event data so cards can use poster/image
let eventList = [];

try {
  const eventsResponse = await fetch(
    `${API_URL}/api/events/`
  );

  if (eventsResponse.ok) {
    const eventsData = await eventsResponse.json();

    eventList = Array.isArray(eventsData)
      ? eventsData
      : eventsData.results || [];
  }
} catch (eventError) {
  console.error(
    "Could not fetch event details:",
    eventError
  );
}

// Enrich registrations with event information
const enrichedRegistrations = confirmedRegistrations.map(
  (registration) => {

    const eventId =
      typeof registration.event === "object"
        ? registration.event?.id
        : registration.event;

    const matchingEvent = eventList.find(
      (event) =>
        Number(event.id) === Number(eventId)
    );

    return {
      ...registration,

      eventData: matchingEvent || null,

      event_title:
        registration.event_title ||
        registration.event?.title ||
        matchingEvent?.title ||
        "Event",

      event_date:
        registration.event_date ||
        registration.event?.date ||
        matchingEvent?.date ||
        "",

      event_time:
        registration.event_time ||
        registration.event?.time ||
        matchingEvent?.time ||
        "",

      event_venue:
        registration.event_venue ||
        registration.event?.venue ||
        matchingEvent?.venue ||
        "",

      event_image:
        registration.event_image ||
        registration.event_image_url ||
        registration.image_url ||
        registration.image ||
        matchingEvent?.image_url ||
        matchingEvent?.image ||
        "",
    };
  }
);

setRegistrations(enrichedRegistrations);
    } catch (error) {
      console.error("Dashboard registrations error:", error);
      setRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  fetchMyRegistrations();
}, []);

  return (
    <div className="student-page">
      
      {/* ================= HERO ================= */}
      <section className="student-hero">

        <div className="student-hero-content">
    
           <div className="student-badge">
            <span></span>
            STUDENT
          </div>
          <h1>
            Discover the
            <br />
            <span>best campus events</span>
            <br />
            around you.
          </h1>

          <p>
            Find exciting college events, register instantly,
            save your favorites and manage your complete
            event journey through EventHub.
          </p>

          <div className="student-hero-actions">

            <Link
              to="/events"
              className="primary-student-button"
            >
              <Search size={18} />
              Browse Events
            </Link>

            <Link
              to="/student/registrations"
              className="secondary-student-button"
            >
              My Registrations
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="student-hero-features">

            <div>
              <div className="feature-icon purple-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <strong>Discover Events</strong>
                <span>Explore campus activities</span>
              </div>
            </div>

            <div>
              <div className="feature-icon pink-icon">
                <Ticket size={19} />
              </div>

              <div>
                <strong>Easy Registration</strong>
                <span>Register in seconds</span>
              </div>
            </div>

          </div>

        </div>

        {/* ================= HERO VISUAL ================= */}
        <div className="student-hero-visual">

          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>

          <div className="student-preview-card">

            <div className="preview-top">
              EVENTHUB

              <span>
                <i></i>
                STUDENT
              </span>
            </div>

            <div className="preview-center">

              <small>WELCOME BACK</small>

              <h3>Student Workspace</h3>

              <div className="preview-stats">

                <div>
                  <span>REGISTERED</span>
                  <strong>03</strong>
                </div>

                <div>
                  <span>UPCOMING</span>
                  <strong>03</strong>
                </div>

                <div>
                  <span>TICKETS</span>
                  <strong>03</strong>
                </div>

              </div>

            </div>

            <div className="preview-bottom">
              <span>Discover</span>
              <span>Register</span>
              <span>Participate</span>
            </div>

          </div>

          <div className="floating-card floating-card-one">

            <div className="floating-icon">
              <Ticket size={17} />
            </div>

            <div>
              <strong>My Tickets</strong>
              <small>3 active tickets</small>
            </div>

          </div>

          <div className="floating-card floating-card-two">

            <div className="floating-icon pink-floating">
              <CheckCircle2 size={17} />
            </div>

            <div>
              <strong>Registered</strong>
              <small>03 events</small>
            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="student-stats">

        <div className="student-stat-card">

          <div className="stat-circle purple-stat">
            <CalendarDays size={22} />
          </div>

          <div>
            <span>UPCOMING REGISTRATIONS</span>
            <strong>03</strong>
            <small>Your upcoming events</small>
          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-circle pink-stat">
            <Ticket size={22} />
          </div>

          <div>
            <span>MY REGISTRATIONS</span>
            <strong>03</strong>
            <small>Registered events</small>
          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-circle blue-stat">
            <Bookmark size={22} />
          </div>

          <div>
            <span>SAVED EVENTS</span>
            <strong>07</strong>
            <small>Your favorites</small>
          </div>

        </div>

      </section>
{/* ================= RECENT REGISTRATIONS ================= */}
<section className="student-section">

  <div className="student-section-header">

    <div>
      <span className="section-small-label">
        YOUR ACTIVITY
      </span>

      <h2>Recent Registrations</h2>

      <p>
        Your latest confirmed campus events.
      </p>
    </div>

    <Link
      to="/student/registrations"
      className="view-all-link"
    >
      View all
      <ArrowRight size={16} />
    </Link>

  </div>

  {registrationsLoading ? (

    <div className="registrations-card">
      <div className="registration-row">
        <div className="registration-details">
          <strong>Loading registrations...</strong>
          <span>Please wait</span>
        </div>
      </div>
    </div>

  ) : registrations.length === 0 ? (

    <div className="registrations-card">
      <div className="registration-row">

        <div className="registration-icon">
          <CalendarDays size={20} />
        </div>

        <div className="registration-details">
          <strong>No active registrations</strong>
          <span>
            Register for an event to see it here.
          </span>
        </div>

        <Link to="/events">
          Browse Events
          <ArrowRight size={14} />
        </Link>

      </div>
    </div>

  ) : (

    <div className="events-grid dashboard-events-grid">

      {registrations
        .slice(0, 3)
        .map((registration, index) => {

          const event = {
            id:
              registration.eventData?.id ||
              registration.event?.id ||
              registration.event,

            title:
              registration.event_title ||
              "Event",

            description:
              registration.eventData?.description ||
              "",

            category:
              registration.eventData?.category ||
              "Campus Event",

            date:
              registration.event_date ||
              registration.eventData?.date ||
              "",

            time:
              registration.event_time ||
              registration.eventData?.time ||
              "",

            venue:
              registration.event_venue ||
              registration.eventData?.venue ||
              "",

            image:
              registration.event_image ||
              registration.eventData?.image ||
              registration.eventData?.image_url ||
              "",

            capacity:
              registration.eventData?.capacity,

            registration_count:
              registration.eventData?.registration_count ??
              registration.eventData?.participants ??
              0,

            registration_deadline:
              registration.eventData?.registration_deadline,
          };

          return (
            <div
              className="dashboard-registration-card"
              key={registration.id}
            >

              <EventCard
                event={event}
                index={index}
              />

              <div className="dashboard-registration-footer">

                <span className="dashboard-confirmed-badge">
                  <CheckCircle2 size={13} />
                  Confirmed
                </span>

                <Link
                  to="/student/tickets"
                  className="dashboard-ticket-link"
                >
                  <Ticket size={14} />
                  View Ticket
                </Link>

              </div>

            </div>
          );
        })}

    </div>

  )}

</section>


      {/* ================= BOTTOM CTA ================= */}
      <section className="student-cta">

        <div>

          <span>READY FOR YOUR NEXT EVENT?</span>

          <h2>
            There's always something
            <br />
            <span>happening on campus.</span>
          </h2>

        </div>

        <Link to="/events">
          Explore Events
          <ArrowRight size={17} />
        </Link>

      </section>

    </div>
  );
};

export default Dashboard;

