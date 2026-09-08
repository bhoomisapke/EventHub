import React, { useState } from "react";
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

const tickets = [
  {
    id: "EVH-2026-00124",
    title: "Tech Innovation Summit 2026",
    category: "Technology",
    date: "15 September 2026",
    shortDate: "15 SEP 2026",
    time: "10:00 AM",
    location: "Main Auditorium",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "EVH-2026-00125",
    title: "Web Development Workshop",
    category: "Workshop",
    date: "20 September 2026",
    shortDate: "20 SEP 2026",
    time: "11:30 AM",
    location: "Computer Lab 2",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "EVH-2026-00126",
    title: "Robotics & AI Expo",
    category: "Robotics",
    date: "25 September 2026",
    shortDate: "25 SEP 2026",
    time: "09:30 AM",
    location: "Innovation Hall",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
  },
];

const MyTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="tickets-page">

      {/* PAGE HEADER */}

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
            <Ticket size={18} />
          </div>

          <div>
            <span>TOTAL TICKETS</span>
            <strong>
              {String(tickets.length).padStart(2, "0")}
            </strong>
          </div>
        </div>

      </div>


      {/* TICKET LIST */}

      <section className="registered-section">

        <div className="section-heading">

          <div>
            <span>REGISTERED EVENTS</span>
            <h2>Your Event Tickets</h2>
          </div>

        </div>


        <div className="ticket-list">

          {tickets.map((ticket) => (

            <article
              className="ticket-list-card"
              key={ticket.id}
            >

              {/* IMAGE */}

              <div className="list-image">

                <img
                  src={ticket.image}
                  alt={ticket.title}
                />

                <span>
                  {ticket.category}
                </span>

              </div>


              {/* DETAILS */}

              <div className="list-content">

                <h3>{ticket.title}</h3>

                <div className="list-details">

                  <span>
                    <CalendarDays size={14} />
                    {ticket.date}
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {ticket.time}
                  </span>

                  <span>
                    <MapPin size={14} />
                    {ticket.location}
                  </span>

                </div>

              </div>


              {/* ACTION */}

              <div className="list-action">

                <span className="confirmed">
                  <CheckCircle2 size={13} />
                  Confirmed
                </span>

                <button
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <Ticket size={15} />
                  View Ticket
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* VERTICAL TICKET */}

      {selectedTicket && (

        <div className="ticket-modal">

          <div
            className="ticket-backdrop"
            onClick={() => setSelectedTicket(null)}
          />


          <div className="ticket-modal-container">

            <button
              className="ticket-close"
              onClick={() => setSelectedTicket(null)}
              aria-label="Close ticket"
            >
              <X size={18} />
            </button>


            <div className="event-ticket">

              {/* ================= TOP ================= */}

              <div className="ticket-top">

                <div className="ticket-logo">
                  <div className="logo-symbol">✦</div>

                  <div>
                    <strong>EventHub</strong>
                    <small>COLLEGE EVENTS</small>
                  </div>
                </div>

                <div className="admit">
                  <span>STUDENT</span>
                  <strong>ADMIT ONE</strong>
                </div>

              </div>


              {/* ================= EVENT IMAGE ================= */}

              <div className="ticket-cover">

                <img
                  src={selectedTicket.image}
                  alt={selectedTicket.title}
                />

                <div className="cover-overlay">

                  <span>
                    {selectedTicket.category}
                  </span>

                  <h2>
                    {selectedTicket.title}
                  </h2>

                  <p>
                    Discover • Connect • Participate
                  </p>

                </div>

              </div>


              {/* ================= TICKET BODY ================= */}

              <div className="ticket-body">

                <div className="ticket-event-heading">

                  <span>EVENT PASS</span>

                  <h3>
                    {selectedTicket.title}
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
                        {selectedTicket.shortDate}
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
                        {selectedTicket.time}
                      </strong>
                    </div>

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
                      {selectedTicket.location}
                    </strong>
                  </div>

                </div>


                {/* DIVIDER */}

                <div className="ticket-divider">
                  <span />
                  <span />
                </div>


                {/* QR + REGISTRATION */}

                <div className="ticket-verification">

                  <div className="qr-area">

                    <div className="qr-code">

                      <QrCode size={88} strokeWidth={1.4} />

                    </div>

                    <span>
                      SCAN AT ENTRY
                    </span>

                  </div>


                  <div className="registration">

                    <span>
                      REGISTRATION ID
                    </span>

                    <strong>
                      {selectedTicket.id}
                    </strong>

                    <div className="verified">
                      <CheckCircle2 size={13} />
                      VERIFIED
                    </div>

                  </div>

                </div>


                {/* ================= STUDENT ================= */}

                <div className="student-ticket-info">

                  <div className="student-ticket-avatar">
                    <UserRound size={17} />
                  </div>

                  <div className="student-ticket-name">

                    <span>REGISTERED STUDENT</span>

                    <strong>
                      Student
                    </strong>

                  </div>

                  <div className="student-status">
                    <CheckCircle2 size={13} />
                    Confirmed
                  </div>

                </div>

              </div>


              {/* ================= FOOTER ================= */}

              <div className="ticket-footer">

                <span>
                  EventHub
                </span>

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