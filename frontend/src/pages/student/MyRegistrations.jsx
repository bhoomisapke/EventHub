import React from "react";
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

const registrations = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    category: "Technology",
    date: "15 September 2026",
    time: "10:00 AM",
    location: "Main Auditorium",
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Web Development Workshop",
    category: "Workshop",
    date: "20 September 2026",
    time: "11:30 AM",
    location: "Computer Lab 2",
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Robotics & AI Expo",
    category: "Robotics",
    date: "25 September 2026",
    time: "9:30 AM",
    location: "Innovation Hall",
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
  },
];

const MyRegistrations = () => {
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
            Manage all the events you have registered for
            and keep track of your upcoming experiences.
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
            <strong>03</strong>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon green-summary">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>CONFIRMED</span>
            <strong>03</strong>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon blue-summary">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>UPCOMING</span>
            <strong>03</strong>
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


        <div className="registration-list">

          {registrations.map((event) => (

            <article
              className="registration-item"
              key={event.id}
            >

              {/* Image */}

              <div className="registration-image">

                <img
                  src={event.image}
                  alt={event.title}
                />

                <span>
                  {event.category}
                </span>

              </div>


              {/* Details */}

              <div className="registration-event-details">

                <h3>{event.title}</h3>

                <div className="registration-detail-row">

                  <div>
                    <CalendarDays size={15} />
                    {event.date}
                  </div>

                  <div>
                    <Clock size={15} />
                    {event.time}
                  </div>

                </div>

                <div className="registration-location">

                  <MapPin size={15} />

                  {event.location}

                </div>

              </div>


              {/* Status */}

              <div className="registration-status-area">

                <span className="confirmed-badge">
                  <CheckCircle2 size={13} />
                  {event.status}
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

          ))}

        </div>

      </section>


      {/* ================= EMPTY / INFO CTA ================= */}

      <section className="registration-bottom">

        <div className="registration-bottom-icon">
          <CalendarDays size={23} />
        </div>

        <div>
          <h3>Looking for more events?</h3>

          <p>
            Discover workshops, competitions, seminars,
            cultural events and more.
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