import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  CheckCircle2,
  X,
  QrCode,
  UserRound,
} from "lucide-react";

import "./MyTickets.css";

const API_URL = "http://127.0.0.1:8000/api";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // GET LOGGED-IN STUDENT'S TICKETS
  // ==================================================
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token") ||
          sessionStorage.getItem("token");

        if (!token) {
          setError("Please login to view your tickets.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/tickets/my/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          setError("Your session has expired. Please login again.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load your tickets.");
        }

        const data = await response.json();

        const ticketData = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];

        setTickets(ticketData);
      } catch (err) {
        console.error("Ticket fetch error:", err);
        setError("Unable to load your tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // ==================================================
  // GET STUDENT NAME
  // ==================================================
  const getStudentName = () => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        return (
          user.name ||
          user.full_name ||
          user.username ||
          "Student"
        );
      }
    } catch (err) {
      console.error("Unable to read user information:", err);
    }

    return "Student";
  };

  const studentName = getStudentName();

  // ==================================================
  // DATE FORMAT
  // ==================================================
  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatShortDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  };

  // ==================================================
  // TIME FORMAT
  // ==================================================
  const formatTime = (timeValue) => {
    if (!timeValue) return "Time not available";

    const parts = timeValue.split(":");

    if (parts.length < 2) {
      return timeValue;
    }

    const hours = Number(parts[0]);
    const minutes = parts[1];

    if (Number.isNaN(hours)) {
      return timeValue;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  // ==================================================
  // STATUS
  // ==================================================
  const getStatusText = (status) => {
    if (!status) return "Confirmed";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // ==================================================
  // LOADING
  // ==================================================
  if (loading) {
    return (
      <div className="tickets-page">
        <div className="tickets-header">
          <div>
            <span className="tickets-label">
              YOUR EVENT PASSES
            </span>

            <h1>My Tickets</h1>

            <p>
              Loading your registered event passes...
            </p>
          </div>

          <div className="ticket-total">
            <div className="ticket-total-icon">
              <Ticket size={18} />
            </div>

            <div>
              <span>TOTAL TICKETS</span>
              <strong>00</strong>
            </div>
          </div>
        </div>

        <section className="registered-section">
          <div className="section-heading">
            <span>REGISTERED EVENTS</span>
            <h2>Your Event Tickets</h2>
          </div>

          <div className="ticket-list">
            <p className="ticket-message">
              Loading tickets...
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================
  if (error) {
    return (
      <div className="tickets-page">
        <div className="tickets-header">
          <div>
            <span className="tickets-label">
              YOUR EVENT PASSES
            </span>

            <h1>My Tickets</h1>

            <p>{error}</p>
          </div>

          <div className="ticket-total">
            <div className="ticket-total-icon">
              <Ticket size={18} />
            </div>

            <div>
              <span>TOTAL TICKETS</span>
              <strong>00</strong>
            </div>
          </div>
        </div>

        <section className="registered-section">
          <div className="section-heading">
            <span>REGISTERED EVENTS</span>
            <h2>Your Event Tickets</h2>
          </div>

          <div className="ticket-list">
            <p className="ticket-message">
              {error}
            </p>
          </div>
        </section>
      </div>
    );
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================
  return (
    <div className="tickets-page">

      {/* ================= HEADER ================= */}
      <div className="tickets-header">

        <div>
          <span className="tickets-label">
            YOUR EVENT PASSES
          </span>

          <h1>My Tickets</h1>

          <p>
            Your registered event passes are ready.
            Open a ticket to view your entry details.
          </p>
        </div>

        <div className="ticket-total">

          <div className="ticket-total-icon">
            <Ticket size={19} />
          </div>

          <div>
            <span>TOTAL TICKETS</span>

            <strong>
              {String(tickets.length).padStart(2, "0")}
            </strong>
          </div>

        </div>

      </div>

      {/* ================= TICKET LIST ================= */}
      <section className="registered-section">

        <div className="section-heading">
          <div>
            <span>REGISTERED EVENTS</span>
            <h2>Your Event Tickets</h2>
          </div>
        </div>

        <div className="ticket-list">

          {tickets.length === 0 ? (

            <p className="ticket-message">
              You don't have any tickets yet.
            </p>

          ) : (

            tickets.map((ticket) => (

              <article
                className="ticket-list-card"
                key={ticket.id}
              >

                {/* ================= IMAGE ================= */}
                <div className="list-image">

                  {ticket.event_image ? (

                    <img
                      src={ticket.event_image}
                      alt={
                        ticket.event_title || "Event"
                      }
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const placeholder =
                          e.currentTarget
                            .nextElementSibling;

                        if (placeholder) {
                          placeholder.style.display =
                            "flex";
                        }
                      }}
                    />

                  ) : null}

                  <div
                    className="list-image-placeholder"
                    style={{
                      display: ticket.event_image
                        ? "none"
                        : "flex",
                    }}
                  >
                    <Ticket size={40} />
                  </div>

                  <span>EVENT</span>

                </div>

                {/* ================= CONTENT ================= */}
                <div className="list-content">

                  <h3>
                    {ticket.event_title || "Event"}
                  </h3>

                  <div className="category-badge">
                    <Ticket size={12} />

                    {ticket.event_category ||
                      "College Event"}
                  </div>

                  <div className="list-details">

                    <span>
                      <CalendarDays size={15} />
                      {formatDate(
                        ticket.event_date
                      )}
                    </span>

                    <span>
                      <Clock3 size={15} />
                      {formatTime(
                        ticket.event_time
                      )}
                    </span>

                    <span>
                      <MapPin size={15} />
                      {ticket.event_venue ||
                        "Venue not available"}
                    </span>

                  </div>

                </div>

                {/* ================= ACTION ================= */}
                <div className="list-action">

                  <span className="confirmed">

                    <CheckCircle2 size={14} />

                    {getStatusText(
                      ticket.status
                    )}

                  </span>

                  <button
                    onClick={() =>
                      setSelectedTicket(ticket)
                    }
                  >
                    <Ticket size={15} />
                    View Ticket
                  </button>

                </div>

              </article>

            ))

          )}

        </div>

      </section>

      {/* ==================================================
          TICKET MODAL
      ================================================== */}
      {selectedTicket && (

        <div className="ticket-modal">

          <div
            className="ticket-backdrop"
            onClick={() =>
              setSelectedTicket(null)
            }
          />

          <div className="ticket-modal-container">

            <button
              className="ticket-close"
              onClick={() =>
                setSelectedTicket(null)
              }
              aria-label="Close ticket"
            >
              <X size={18} />
            </button>

            <div className="event-ticket">

              {/* ================= TOP ================= */}
              <div className="ticket-top">

                <div className="ticket-logo">

                  <div className="logo-symbol">
                    ✦
                  </div>

                  <div>
                    <strong>EventHub</strong>

                    <small>
                      COLLEGE EVENTS
                    </small>
                  </div>

                </div>

                <div className="admit">

                  <span>STUDENT</span>

                  <strong>
                    ADMIT ONE
                  </strong>

                </div>

              </div>

              {/* ================= COVER ================= */}
              <div className="ticket-cover">

                {selectedTicket.event_image ? (

                  <img
                    src={
                      selectedTicket.event_image
                    }
                    alt={
                      selectedTicket.event_title ||
                      "Event"
                    }
                  />

                ) : (

                  <div className="ticket-cover-placeholder">
                    <Ticket size={55} />
                  </div>

                )}

                <div className="cover-overlay">

                  <span>EVENT</span>

                  <h2>
                    {selectedTicket.event_title ||
                      "Event"}
                  </h2>

                  <p>
                    Discover • Connect • Participate
                  </p>

                </div>

              </div>

              {/* ================= BODY ================= */}
              <div className="ticket-body">

                <div className="ticket-event-heading">

                  <span>EVENT PASS</span>

                  <h3>
                    {selectedTicket.event_title ||
                      "Event"}
                  </h3>

                </div>

                {/* DATE + TIME */}
                <div className="ticket-detail-row">

                  <div className="ticket-detail">

                    <div className="detail-icon">
                      <CalendarDays size={16} />
                    </div>

                    <div>
                      <span>DATE</span>

                      <strong>
                        {formatShortDate(
                          selectedTicket.event_date
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="ticket-detail">

                    <div className="detail-icon">
                      <Clock3 size={16} />
                    </div>

                    <div>
                      <span>TIME</span>

                      <strong>
                        {formatTime(
                          selectedTicket.event_time
                        )}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* CATEGORY */}
                <div className="ticket-venue">

                  <div className="detail-icon">
                    <Ticket size={16} />
                  </div>

                  <div>
                    <span>CATEGORY</span>

                    <strong>
                      {selectedTicket.event_category ||
                        "College Event"}
                    </strong>
                  </div>

                </div>

                {/* VENUE */}
                <div className="ticket-venue">

                  <div className="detail-icon">
                    <MapPin size={16} />
                  </div>

                  <div>
                    <span>VENUE</span>

                    <strong>
                      {selectedTicket.event_venue ||
                        "Venue not available"}
                    </strong>
                  </div>

                </div>

                {/* DIVIDER */}
                <div className="ticket-divider">
                  <span />
                  <span />
                </div>

                {/* QR + TICKET NUMBER */}
                <div className="ticket-verification">

                  <div className="qr-area">

                    <div className="qr-code">
                      <QrCode
                        size={88}
                        strokeWidth={1.4}
                      />
                    </div>

                    <span>
                      SCAN AT ENTRY
                    </span>

                  </div>

                  <div className="registration">

                    <span>
                      TICKET NUMBER
                    </span>

                    <strong>
                      {selectedTicket.ticket_number ||
                        "Not available"}
                    </strong>

                    <div className="verified">

                      <CheckCircle2 size={13} />

                      {getStatusText(
                        selectedTicket.status
                      ).toUpperCase()}

                    </div>

                  </div>

                </div>

                {/* STUDENT */}
                <div className="student-ticket-info">

                  <div className="student-ticket-avatar">
                    <UserRound size={17} />
                  </div>

                  <div className="student-ticket-name">

                    <span>
                      REGISTERED STUDENT
                    </span>

                    <strong>
                      {studentName}
                    </strong>

                  </div>

                  <div className="student-status">

                    <CheckCircle2 size={13} />

                    {getStatusText(
                      selectedTicket.status
                    )}

                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div className="ticket-footer">

                <span>EventHub</span>

                <p>
                  Present this pass at the entrance
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyTickets;