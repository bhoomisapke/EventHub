import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Event Details page will send the event information here
  const event = location.state?.event;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/registrations/`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: event.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.event?.[0] ||
          "Registration failed."
        );
      }

      setSuccess(true);

      // After successful registration
      setTimeout(() => {
        navigate("/student/registrations");
      }, 1200);

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Unable to register for this event.");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="registration-form-page">
        <div className="registration-error-card">
          <h2>Event information not found</h2>
          <p>Please go back and select an event again.</p>

          <button onClick={() => navigate("/events")}>
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="registration-form-page">
        <div className="registration-success-card">
          <CheckCircle2 size={52} />

          <h2>Registration Successful!</h2>

          <p>
            You have successfully registered for{" "}
            <strong>{event.title}</strong>.
          </p>

          <span>
            Redirecting to My Registrations...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-form-page">

      {/* BACK BUTTON */}

      <button
        className="registration-back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />
        Back to Event
      </button>


      {/* HEADER */}

      <div className="registration-form-header">
        <span>EVENT REGISTRATION</span>

        <h1>Register for Event</h1>

        <p>
          Confirm your details and register for this
          college event.
        </p>
      </div>


      {/* EVENT SUMMARY */}

      <div className="registration-event-card">

        <div className="registration-event-icon">
          <CalendarDays size={28} />
        </div>

        <div className="registration-event-info">

          <span>SELECTED EVENT</span>

          <h2>{event.title}</h2>

          <div className="registration-event-meta">

            {event.date && (
              <div>
                <CalendarDays size={15} />
                {event.date}
              </div>
            )}

            {event.time && (
              <div>
                <Clock size={15} />
                {event.time}
              </div>
            )}

            {event.venue && (
              <div>
                <MapPin size={15} />
                {event.venue}
              </div>
            )}

          </div>

        </div>

      </div>


      {/* FORM */}

      <form
        className="registration-form-card"
        onSubmit={handleSubmit}
      >

        <div className="registration-form-title">
          <UserRound size={20} />

          <div>
            <span>STUDENT DETAILS</span>
            <h2>Confirm Your Information</h2>
          </div>
        </div>


        {/* NAME */}

        <div className="registration-input-group">

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />

        </div>


        {/* EMAIL */}

        <div className="registration-input-group">

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

        </div>


        {/* PHONE */}

        <div className="registration-input-group">

          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

        </div>


        {error && (
          <div className="registration-error">
            {error}
          </div>
        )}


        {/* SUBMIT */}

        <button
          type="submit"
          className="registration-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Confirm Registration"}
        </button>

      </form>

    </div>
  );
};

export default RegistrationForm;