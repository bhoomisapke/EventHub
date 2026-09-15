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

      {/* ================= MY UPCOMING REGISTRATIONS ================= */}
      <section className="student-section">

        <div className="student-section-header">

          <div>

            <span className="section-small-label">
              YOUR EVENTS
            </span>

            <h2>My Upcoming Registrations</h2>

            <p>
              Events you have registered for and are coming up soon.
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

        <div className="events-grid dashboard-events-grid">
        {events.slice(0, 3).map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            index={index}
          />
        ))}
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
              Keep track of the events you've joined.
            </p>

          </div>

          <Link
            to="/student/registrations"
            className="view-all-link"
          >
            View registrations
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="registrations-card">

          <div className="registration-row">

            <div className="registration-icon">
              <Ticket size={20} />
            </div>

            <div className="registration-details">
              <strong>Tech Innovation Summit 2026</strong>
              <span>Registered recently</span>
            </div>

            <span className="registration-status">
              Confirmed
            </span>

            <Link to="/student/tickets">
              View Ticket
              <ArrowRight size={14} />
            </Link>

          </div>

          <div className="registration-row">

            <div className="registration-icon pink-registration">
              <Ticket size={20} />
            </div>

            <div className="registration-details">
              <strong>Web Development Workshop</strong>
              <span>Registered recently</span>
            </div>

            <span className="registration-status">
              Confirmed
            </span>

            <Link to="/student/tickets">
              View Ticket
              <ArrowRight size={14} />
            </Link>

          </div>

          <div className="registration-row">

            <div className="registration-icon">
              <Ticket size={20} />
            </div>

            <div className="registration-details">
              <strong>Robotics & AI Expo</strong>
              <span>Registered recently</span>
            </div>

            <span className="registration-status">
              Confirmed
            </span>

            <Link to="/student/tickets">
              View Ticket
              <ArrowRight size={14} />
            </Link>

          </div>

        </div>

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

