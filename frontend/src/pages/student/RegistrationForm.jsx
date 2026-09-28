
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    student_id: "",
    department: "",
    year: "",
  });

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
     SAFE STRING
     Prevents .trim() errors when a value is undefined/null
  ============================================================ */

  const safeTrim = (value) => {
    return String(value ?? "").trim();
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

        let eventData;

        try {
          eventData = await eventResponse.json();
        } catch {
          throw new Error("Invalid response received while loading event.");
        }

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

        let studentData;

        try {
          studentData = await studentResponse.json();
        } catch {
          throw new Error(
            "Invalid response received while loading student information."
          );
        }

        if (!studentResponse.ok) {
          throw new Error(
            studentData?.detail ||
              studentData?.message ||
              "Unable to load student information."
          );
        }

        setEvent(eventData);
        setStudent(studentData);

        /* --------------------------------------------------------
           PREFILL FORM

           Different backend field names are supported where
           possible, so undefined values will not break the form.
        -------------------------------------------------------- */

        setFormData({
          name: String(
            studentData?.name ??
              studentData?.full_name ??
              ""
          ),

          email: String(
            studentData?.email ?? ""
          ),

          phone: String(
            studentData?.phone ??
              studentData?.phone_number ??
              ""
          ),

          student_id: String(
            studentData?.student_id ??
              studentData?.student_number ??
              ""
          ),

          department: String(
            studentData?.department ?? ""
          ),

          year: String(
            studentData?.year ?? ""
          ),
        });
      } catch (err) {
        console.error("Registration page error:", err);

        setError(
          err?.message ||
            "Unable to load registration information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRegistrationData();
  }, [id]);

  /* ============================================================
     HANDLE INPUT CHANGE
  ============================================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value ?? "",
    }));
  };

  /* ============================================================
     FORMAT DATE
  ============================================================ */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
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

    const timeString = String(timeValue);

    const [hours, minutes] = timeString.split(":");

    const date = new Date();

    date.setHours(
      Number(hours) || 0,
      Number(minutes) || 0,
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
const registrationCount = Number(event?.registration_count ?? 0);
const eventCapacity = Number(event?.capacity ?? 0);
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

    /* ----------------------------------------------------------
       CLEAN FORM DATA SAFELY

       safeTrim() guarantees that .trim() is never called on
       undefined or null.
    ---------------------------------------------------------- */

    const registrationData = {
      event: event.id,

      name: safeTrim(formData.name),
      email: safeTrim(formData.email),
      phone: safeTrim(formData.phone),

      /* IMPORTANT:
         Your form uses student_id, so submission also uses
         student_id instead of student_number.
      */
      student_id: safeTrim(formData.student_id),

      department: safeTrim(formData.department),
      year: safeTrim(formData.year),
    };

    /* ----------------------------------------------------------
       BASIC FRONTEND VALIDATION
    ---------------------------------------------------------- */

    if (!registrationData.name) {
      setError("Please enter your full name.");
      return;
    }

    if (!registrationData.email) {
      setError("Please enter your email address.");
      return;
    }

    if (!registrationData.phone) {
      setError("Please enter your phone number.");
      return;
    }

    if (!registrationData.student_id) {
      setError("Please enter your student ID.");
      return;
    }

    if (!registrationData.department) {
      setError("Please enter your department.");
      return;
    }

    if (!registrationData.year) {
      setError("Please enter your year.");
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

          body: JSON.stringify(registrationData),
        }
      );

      /* --------------------------------------------------------
         RESPONSE
      -------------------------------------------------------- */

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /* --------------------------------------------------------
         BACKEND ERROR
      -------------------------------------------------------- */
      
      console.log("Registration API status:", response.status);
      console.log("Registration API response:", data);
      if (!response.ok) {
        
        let message = "Registration failed.";

        if (data?.detail) {
          message =
            typeof data.detail === "string"
              ? data.detail
              : "Unable to complete registration.";
        } else if (data?.event?.[0]) {
          message = data.event[0];
        } else if (data?.name?.[0]) {
          message = data.name[0];
        } else if (data?.email?.[0]) {
          message = data.email[0];
        } else if (data?.phone?.[0]) {
          message = data.phone[0];
        } else if (data?.student_id?.[0]) {
          message = data.student_id[0];
        } else if (data?.student_number?.[0]) {
          message = data.student_number[0];
        } else if (data?.department?.[0]) {
          message = data.department[0];
        } else if (data?.year?.[0]) {
          message = data.year[0];
        }

        throw new Error(message);
      }

      /* --------------------------------------------------------
         SUCCESS
      -------------------------------------------------------- */

      console.log("Registration successful:", data);

      setSuccess(true);

      setTimeout(() => {
        navigate("/student/registrations");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.message ||
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
        type="button"
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
          Enter your details and register for this
          college event.
        </p>
      </div>

      {/* ========================================================
          SELECTED EVENT
      ======================================================== */}

      <div className="registration-event-card">

        <div className="registration-event-image">
          {event?.image ? (
            <img
              src={event.image}
              alt={event?.title || "Event"}
              onError={(e) => {
                e.currentTarget.style.display = "none";

                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display =
                    "flex";
                }
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
            {event?.title || "Event"}
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
         <div className="registration-count-info">
  <span>REGISTRATION STATUS</span>

  <strong>
    {registrationCount} / {eventCapacity || "∞"} registered
  </strong>

  <div className="registration-count-bar">
    <div
      className="registration-count-fill"
      style={{
        width:
          eventCapacity > 0
            ? `${Math.min(
                (registrationCount / eventCapacity) * 100,
                100
              )}%`
            : "0%",
      }}
    />
  </div>

  <small>
    {eventCapacity > 0
      ? `${Math.max(eventCapacity - registrationCount, 0)} seats remaining`
      : "Registration available"}
  </small>
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
              Enter Your Information
            </h2>
          </div>
        </div>

        {/* ======================================================
            FULL NAME
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-name">
            Full Name
          </label>

          <input
            id="registration-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        {/* ======================================================
            EMAIL
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-email">
            Email Address
          </label>

          <input
            id="registration-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
          />
        </div>

        {/* ======================================================
            PHONE
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-phone">
            Phone Number
          </label>

          <input
            id="registration-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        {/* ======================================================
            STUDENT ID
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-student-id">
            Student ID
          </label>

          <input
            id="registration-student-id"
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            placeholder="Enter your student ID"
          />
        </div>

        {/* ======================================================
            DEPARTMENT
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-department">
            Department
          </label>

          <input
            id="registration-department"
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
          />
        </div>

        {/* ======================================================
            YEAR
        ====================================================== */}

        <div className="registration-input-group">
          <label htmlFor="registration-year">
            Year
          </label>

          <input
            id="registration-year"
            type="text"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Enter your year"
          />
        </div>

        {/* ======================================================
            INFORMATION MESSAGE
        ====================================================== */}

        <div className="registration-confirmation-note">
          Your information is prefilled from your profile.
          You can edit the details before confirming your
          registration.
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
