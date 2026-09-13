import React from "react";
import {
  Users,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import "./Participants.css";

function Participants() {
  const participants = [
    {
      id: 1,
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      event: "Tech Innovation Summit",
      date: "10 Sep 2026",
      status: "Registered",
    },
    {
      id: 2,
      name: "Ananya Shah",
      email: "ananya.shah@example.com",
      event: "Tech Innovation Summit",
      date: "11 Sep 2026",
      status: "Registered",
    },
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul.mehta@example.com",
      event: "Web Development Workshop",
      date: "12 Sep 2026",
      status: "Registered",
    },
    {
      id: 4,
      name: "Priya Desai",
      email: "priya.desai@example.com",
      event: "Coding Competition",
      date: "13 Sep 2026",
      status: "Registered",
    },
    {
      id: 5,
      name: "Rohan Joshi",
      email: "rohan.joshi@example.com",
      event: "Tech Innovation Summit",
      date: "14 Sep 2026",
      status: "Registered",
    },
  ];

  const registeredCount = participants.filter(
    (participant) => participant.status === "Registered"
  ).length;

  const eventCount = new Set(
    participants.map((participant) => participant.event)
  ).size;

  return (
    <div className="participants-page">

      {/* Decorative background */}
      <div className="participants-glow participants-glow-one"></div>
      <div className="participants-glow participants-glow-two"></div>

      <div className="participants-container">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="participants-header">

          <div className="participants-heading">

            <span className="participants-label">
              <Sparkles size={14} />
              ORGANIZER PARTICIPANTS
            </span>

            <h1>
              Participants<span>.</span>
            </h1>

            <p>
              View and manage students registered for your events.
            </p>

          </div>

        </div>


        {/* =========================================
            STATISTICS
        ========================================= */}

        <div className="participants-stats">

          {/* Total Participants */}
          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <Users size={22} />
            </div>

            <div className="participant-stat-content">
              <span>Total Participants</span>
              <strong>{participants.length}</strong>
            </div>

          </div>


          {/* Registered */}
          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <CheckCircle2 size={22} />
            </div>

            <div className="participant-stat-content">
              <span>Registered</span>
              <strong>{registeredCount}</strong>
            </div>

          </div>


          {/* Events */}
          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <CalendarDays size={22} />
            </div>

            <div className="participant-stat-content">
              <span>Events</span>
              <strong>{eventCount}</strong>
            </div>

          </div>

        </div>


        {/* =========================================
            PARTICIPANT LIST
        ========================================= */}

        <div className="participants-card">

          <div className="participants-card-header">

            <div className="participants-card-title">

              <div className="participants-card-icon">
                <UserRound size={20} />
              </div>

              <div>
                <span className="participants-section-label">
                  REGISTRATION DETAILS
                </span>

                <h2>
                  Participant List
                </h2>

                <p>
                  {participants.length} students registered across your events.
                </p>
              </div>

            </div>

          </div>


          {/* =========================================
              TABLE
          ========================================= */}

          <div className="participants-table-wrapper">

            <table className="participants-table">

              <thead>

                <tr>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Event</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {participants.map((participant) => (

                  <tr key={participant.id}>

                    {/* Participant */}
                    <td>

                      <div className="participant-name">

                        <div className="participant-avatar">
                          {participant.name.charAt(0)}
                        </div>

                        <div className="participant-person">

                          <strong>
                            {participant.name}
                          </strong>

                          <span>
                            Student
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* Email */}
                    <td>
                      <span className="participant-email">
                        {participant.email}
                      </span>
                    </td>


                    {/* Event */}
                    <td>

                      <div className="participant-event">

                        <CalendarDays size={15} />

                        <span>
                          {participant.event}
                        </span>

                      </div>

                    </td>


                    {/* Date */}
                    <td>
                      <span className="participant-date">
                        {participant.date}
                      </span>
                    </td>


                    {/* Status */}
                    <td>

                      <span className="participant-status">
                        <span className="status-dot"></span>
                        {participant.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Participants;