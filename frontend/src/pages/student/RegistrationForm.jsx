import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import "./RegistrationForm.css";

const API_URL = "http://127.0.0.1:8000";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ============================================================
     GET TOKEN
  ============================================================ */

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  /* ============================================================
     FETCH EVENT + STUDENT
  ============================================================ */

  useEffect(() => {
    const loadRegistrationData = async () => {
      const token = getToken();

      if (!token) {
        setError("Please login before registering for an event.");
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Event information is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [eventResponse, studentResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/events/${id}/`),

            fetch(`${API_URL}/api/auth/me/`, {
              method: "GET",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
            }),
          ]);

        /* --------------------------------------------------------
           EVENT RESPONSE
        -------------------------------------------------------- */

        const eventData = await eventResponse.json();

        if (!eventResponse.ok) {
          throw new Error(
            eventData?.detail ||
            eventData?.message ||
            "Unable to load event."
          );
        }

        /* --------------------------------------------------------
           STUDENT RESPONSE
        -------------------------------------------------------- */

        const studentData = await studentResponse.json();

        if (!studentResponse.ok) {
          throw new Error(
            studentData?.detail ||
            studentData?.message ||
            "Unable to load student information."
          );
        }

        setEvent(eventData);
        setStudent(studentData);

      } catch (err) {
        console.error("Registration page error:", err);
        setError(
          err.message ||
          "Unable to load registration information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRegistrationData();
  }, [id]);

  /* ============================================================
     FORMAT DATE
  ============================================================ */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  /* ============================================================
     FORMAT TIME
  ============================================================ */

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "Not specified";
    }

    const [hours, minutes] = timeValue.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ============================================================
     SUBMIT REGISTRATION
  ============================================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setError("Please login before registering for an event.");
      return;
    }

    if (!event?.id) {
      setError("Event information is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/registrations/`,
        {
          method: "POST",

          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },

          /*
             The backend gets the student automatically
             from the authentication token.

             Only the event ID needs to be sent.
          */

          body: JSON.stringify({
            event: event.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message = "Registration failed.";

        if (data?.detail) {
          message =
            typeof data.detail === "string"
              ? data.detail
              : "Unable to complete registration.";
        } else if (data?.event?.[0]) {
          message = data.event[0];
        }

        throw new Error(message);
      }

      console.log("Registration successful:", data);

      setSuccess(true);

      setTimeout(() => {
        navigate("/student/registrations");
      }, 1200);

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message ||
        "Unable to register for this event."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="registration-form-page">
        <div className="registration-success-card">
          <h2>Loading Registration...</h2>

          <p>
            Please wait while we load the event
            and your information.
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error && !event) {
    return (
      <div className="registration-form-page">
        <div className="registration-error-card">

          <h2>
            Unable to Open Registration
          </h2>

          <p>{error}</p>

          <button
            onClick={() => navigate("/events")}
          >
            Browse Events
          </button>

        </div>
      </div>
    );
  }

  /* ============================================================
     SUCCESS
  ============================================================ */

  if (success) {
    return (
      <div className="registration-form-page">

        <div className="registration-success-card">

          <CheckCircle2 size={52} />

          <h2>
            Registration Successful!
          </h2>

          <p>
            You have successfully registered for{" "}
            <strong>{event?.title}</strong>.
          </p>

          <span>
            Your ticket has been generated.
          </span>

          <span>
            Redirecting to My Registrations...
          </span>

        </div>

      </div>
    );
  }

  /* ============================================================
     REGISTRATION PAGE
  ============================================================ */

  return (
    <div className="registration-form-page">

      {/* ========================================================
          BACK BUTTON
      ======================================================== */}

      <button
        className="registration-back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />

        Back to Event
      </button>


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="registration-form-header">

        <span>
          EVENT REGISTRATION
        </span>

        <h1>
          Register for Event
        </h1>

        <p>
          Confirm your details and register for this
          college event.
        </p>

      </div>


      {/* ========================================================
          EVENT SUMMARY
      ======================================================== */}

      <div className="registration-event-card">

        <div className="registration-event-image">

          {event?.image ? (
            <img
              src={event.image}
              alt={event?.title || "Event"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className="registration-event-image-placeholder"
            style={{
              display: event?.image ? "none" : "flex",
            }}
          >
            <CalendarDays size={30} />
          </div>

        </div>

        <div className="registration-event-info">

          <span>
            SELECTED EVENT
          </span>

          <h2>
            {event?.title}
          </h2>

          <div className="registration-event-meta">

            {event?.date && (
              <div>
                <CalendarDays size={15} />

                {formatDate(event.date)}
              </div>
            )}

            {event?.time && (
              <div>
                <Clock size={15} />

                {formatTime(event.time)}
              </div>
            )}

            {event?.venue && (
              <div>
                <MapPin size={15} />

                {event.venue}
              </div>
            )}

          </div>

        </div>

      </div>


      {/* ========================================================
          FORM
      ======================================================== */}

      <form
        className="registration-form-card"
        onSubmit={handleSubmit}
      >

        {/* FORM TITLE */}

        <div className="registration-form-title">

          <UserRound size={20} />

          <div>

            <span>
              STUDENT DETAILS
            </span>

            <h2>
              Confirm Your Information
            </h2>

          </div>

        </div>


        {/* ======================================================
            NAME
        ====================================================== */}

        <div className="registration-input-group">

          <label>
            Full Name
          </label>

          <input
            type="text"
            value={student?.name || ""}
            placeholder="Your full name"
            readOnly
          />

        </div>


        {/* ======================================================
            EMAIL
        ====================================================== */}

        <div className="registration-input-group">

          <label>
            Email Address
          </label>

          <input
            type="email"
            value={student?.email || ""}
            placeholder="Your email address"
            readOnly
          />

        </div>


        {/* ======================================================
            PHONE
        ====================================================== */}

        <div className="registration-input-group">

          <label>
            Phone Number
          </label>

          <input
            type="text"
            value={student?.phone || ""}
            placeholder="Phone number not added"
            readOnly
          />

        </div>


        {/* ======================================================
            EXTRA STUDENT INFORMATION
        ====================================================== */}

        <div className="registration-student-info">

          {student?.student_id && (
            <div>
              <span>Student ID</span>
              <strong>{student.student_id}</strong>
            </div>
          )}

          {student?.department && (
            <div>
              <span>Department</span>
              <strong>{student.department}</strong>
            </div>
          )}

          {student?.year && (
            <div>
              <span>Year</span>
              <strong>{student.year}</strong>
            </div>
          )}

        </div>


        {/* ======================================================
            INFORMATION MESSAGE
        ====================================================== */}

        <div className="registration-confirmation-note">

          Your registered account information will be used
          for this event registration.

        </div>


        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="registration-error">
            {error}
          </div>
        )}


        {/* ======================================================
            SUBMIT
        ====================================================== */}

        <button
          type="submit"
          className="registration-submit-btn"
          disabled={submitting}
        >

          {submitting
            ? "Registering..."
            : "Confirm Registration"}

        </button>

      </form>

    </div>
  );
};

export default RegistrationForm;