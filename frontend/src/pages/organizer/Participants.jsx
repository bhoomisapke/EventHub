import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

import "./Participants.css";

function Participants() {
  // =====================================================
  // EVENT ID
  // =====================================================
  // If URL is:
  // /organizer/participants
  // id = undefined → ALL participants
  //
  // If URL is:
  // /organizer/events/1/participants
  // id = 1 → ONLY event 1 participants
  // =====================================================

  const { id } = useParams();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH PARTICIPANTS
  // =====================================================

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // =================================================
      // GET LOGIN TOKEN
      // =================================================

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in. Please login again."
        );
        return;
      }

      // =================================================
      // API ENDPOINT
      // =================================================
      //
      // ALL PARTICIPANTS:
      // /api/registrations/organizer/
      //
      // EVENT PARTICIPANTS:
      // /api/registrations/organizer/1/
      // =================================================

      const endpoint = id
        ? `http://localhost:8000/api/registrations/organizer/${id}/`
        : "http://localhost:8000/api/registrations/organizer/";

      console.log("Participants API:", endpoint);

      // =================================================
      // API REQUEST
      // =================================================

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      // =================================================
      // RESPONSE
      // =================================================

      let data = [];

      try {
        data = await response.json();
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            "Failed to load participants."
        );
      }

      // =================================================
      // SAVE PARTICIPANTS
      // =================================================

      setParticipants(
        Array.isArray(data) ? data : []
      );

    } catch (err) {
      console.error(
        "Participants fetch error:",
        err
      );

      setParticipants([]);

      setError(
        err.message ||
          "Unable to load participants."
      );

    } finally {
      setLoading(false);
    }
  }, [id]);

  // =====================================================
  // LOAD PARTICIPANTS
  // =====================================================

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const registeredCount = participants.filter(
    (participant) =>
      participant.status === "confirmed"
  ).length;

  const eventCount = id
    ? participants.length > 0
      ? 1
      : 0
    : new Set(
        participants
          .map(
            (participant) =>
              participant.event
          )
          .filter(Boolean)
      ).size;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // PARTICIPANT NAME
  // =====================================================

  const getParticipantName = (participant) => {
    if (participant.student_name) {
      return participant.student_name;
    }

    if (participant.student_email) {
      return participant.student_email;
    }

    if (participant.student) {
      return `Student #${participant.student}`;
    }

    return "Unknown Student";
  };

  // =====================================================
  // EVENT TITLE
  // =====================================================

  const getEventTitle = (participant) => {
    if (participant.event_title) {
      return participant.event_title;
    }

    if (participant.event) {
      return `Event #${participant.event}`;
    }

    return "Event";
  };

  // =====================================================
  // CURRENT EVENT TITLE
  // =====================================================

  const currentEventTitle =
    participants.length > 0
      ? participants[0].event_title || ""
      : "";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="participants-page">

      {/* =================================================
          BACKGROUND GLOW
          ================================================= */}

      <div className="participants-glow participants-glow-one"></div>

      <div className="participants-glow participants-glow-two"></div>


      {/* =================================================
          MAIN CONTAINER
          ================================================= */}

      <div className="participants-container">


        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <div className="participants-header">

          <div className="participants-heading">

            <span className="participants-label">

              <Sparkles size={14} />

              {id
                ? "EVENT PARTICIPANTS"
                : "ORGANIZER PARTICIPANTS"}

            </span>


            <h1>
              Participants<span>.</span>
            </h1>


            <p>

              {id
                ? currentEventTitle
                  ? `View students registered for ${currentEventTitle}.`
                  : "View students registered for this event."
                : "View students registered across all your events in real time."}

            </p>

          </div>

        </div>


        {/* =================================================
            STATISTICS
            ================================================= */}

        <div className="participants-stats">


          {/* TOTAL PARTICIPANTS */}

          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <Users size={22} />
            </div>

            <div className="participant-stat-content">

              <span>
                Total Participants
              </span>

              <strong>
                {participants.length}
              </strong>

            </div>

          </div>


          {/* REGISTERED */}

          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <CheckCircle2 size={22} />
            </div>

            <div className="participant-stat-content">

              <span>
                Registered
              </span>

              <strong>
                {registeredCount}
              </strong>

            </div>

          </div>


          {/* EVENTS */}

          <div className="participant-stat-card">

            <div className="participant-stat-icon">
              <CalendarDays size={22} />
            </div>

            <div className="participant-stat-content">

              <span>
                {id ? "This Event" : "Events"}
              </span>

              <strong>
                {eventCount}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            PARTICIPANTS CARD
            ================================================= */}

        <div className="participants-card">


          {/* =================================================
              CARD HEADER
              ================================================= */}

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

                  {id
                    ? "Event Participant List"
                    : "Participant List"}

                </h2>


                <p>

                  {loading
                    ? "Loading registrations..."
                    : id
                      ? `${participants.length} students registered for this event.`
                      : `${participants.length} students registered across your events.`}

                </p>

              </div>

            </div>


            {/* =================================================
                REFRESH BUTTON
                ================================================= */}

            <button
              type="button"
              className="participants-refresh-btn"
              onClick={fetchParticipants}
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="participants-spinner"
                  />

                  Loading
                </>
              ) : (
                <>
                  <Users size={16} />

                  Refresh
                </>
              )}

            </button>

          </div>


          {/* =================================================
              ERROR
              ================================================= */}

          {error && (

            <div className="participants-error">

              <AlertCircle size={20} />

              <div>

                <strong>
                  Unable to load participants
                </strong>

                <span>
                  {error}
                </span>

              </div>

            </div>

          )}


          {/* =================================================
              LOADING
              ================================================= */}

          {loading && !error && (

            <div className="participants-loading">

              <Loader2
                size={32}
                className="participants-spinner"
              />

              <p>
                Loading registered students...
              </p>

            </div>

          )}


          {/* =================================================
              EMPTY
              ================================================= */}

          {!loading &&
            !error &&
            participants.length === 0 && (

              <div className="participants-empty">

                <div className="participants-empty-icon">
                  <Users size={30} />
                </div>


                <h3>

                  {id
                    ? "No participants for this event"
                    : "No participants yet"}

                </h3>


                <p>

                  {id
                    ? "Students who register for this event will appear here automatically."
                    : "Students who register for your events will appear here automatically."}

                </p>

              </div>

            )}


          {/* =================================================
              PARTICIPANT TABLE
              ================================================= */}

          {!loading &&
            !error &&
            participants.length > 0 && (

              <div className="participants-table-wrapper">

                <table className="participants-table">


                  {/* =================================================
                      TABLE HEADER
                      ================================================= */}

                  <thead>

                    <tr>

                      <th>
                        Participant
                      </th>

                      <th>
                        Email
                      </th>


                      {/* EVENT COLUMN ONLY FOR ALL PARTICIPANTS */}

                      {!id && (
                        <th>
                          Event
                        </th>
                      )}


                      <th>
                        Registration Date
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  {/* =================================================
                      TABLE BODY
                      ================================================= */}

                  <tbody>

                    {participants.map(
                      (participant) => {

                        const participantName =
                          getParticipantName(
                            participant
                          );


                        const status =
                          participant.status ===
                          "confirmed"
                            ? "Registered"
                            : participant.status ||
                              "Unknown";


                        return (

                          <tr
                            key={
                              participant.id
                            }
                          >


                            {/* =================================
                                PARTICIPANT
                                ================================= */}

                            <td>

                              <div className="participant-name">

                                <div className="participant-avatar">

                                  {participantName
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>


                                <div className="participant-person">

                                  <strong>
                                    {participantName}
                                  </strong>

                                  <span>
                                    Student
                                  </span>

                                </div>

                              </div>

                            </td>


                            {/* =================================
                                EMAIL
                                ================================= */}

                            <td>

                              <div className="participant-email-wrapper">

                                <Mail size={15} />

                                <span className="participant-email">

                                  {participant.student_email ||
                                    "Email unavailable"}

                                </span>

                              </div>

                            </td>


                            {/* =================================
                                EVENT
                                ================================= */}

                            {!id && (

                              <td>

                                <div className="participant-event">

                                  <CalendarDays
                                    size={15}
                                  />

                                  <span>

                                    {getEventTitle(
                                      participant
                                    )}

                                  </span>

                                </div>

                              </td>

                            )}


                            {/* =================================
                                REGISTRATION DATE
                                ================================= */}

                            <td>

                              <span className="participant-date">

                                {formatDate(
                                  participant.registration_date
                                )}

                              </span>

                            </td>


                            {/* =================================
                                STATUS
                                ================================= */}

                            <td>

                              <span
                                className={`participant-status ${
                                  participant.status ===
                                  "cancelled"
                                    ? "participant-status-cancelled"
                                    : ""
                                }`}
                              >

                                <span className="status-dot"></span>

                                {status}

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}

export default Participants;