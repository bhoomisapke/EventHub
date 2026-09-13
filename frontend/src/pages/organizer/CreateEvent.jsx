import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  UserRound,
  Phone,
  IndianRupee,
  ImagePlus,
  FileText,
  Sparkles,
  UserPlus,
  UsersRound,
} from "lucide-react";
import Notification from "../../components/Notification.jsx";
import "./CreateEvent.css";

function CreateEvent() {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    organizerName: "",
    organizerMobile: "",
    capacity: "",
    registrationFee: "",
    customFee: "",
    registrationDeadline: "",
    description: "",

    // Participation details
    participationType: "individual",
    minTeamSize: "1",
    maxTeamSize: "1",

    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({
      message,
      type,
    });
  };

  const closeNotification = () => {
    setNotification({
      message: "",
      type: "success",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  =========================================
  PARTICIPATION TYPE CHANGE
  =========================================
  */

  const handleParticipationTypeChange = (e) => {
    const value = e.target.value;

    setEvent((previous) => ({
      ...previous,
      participationType: value,

      // Individual event = exactly 1 participant
      ...(value === "individual"
        ? {
            minTeamSize: "1",
            maxTeamSize: "1",
          }
        : {
            // Default group values
            minTeamSize: "2",
            maxTeamSize: "4",
          }),
    }));
  };

  /*
  =========================================
  IMAGE UPLOAD
  =========================================
  */

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification(
        "Please select a valid image file.",
        "error"
      );

      e.target.value = "";
      return;
    }

    setEvent((previous) => ({
      ...previous,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  /*
  =========================================
  GET AUTH TOKEN
  =========================================
  */

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("access_token") ||
      ""
    );
  };

  /*
  =========================================
  FORM SUBMIT
  =========================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    =========================================
    REQUIRED FIELD VALIDATION
    =========================================
    */

    if (
      !event.title ||
      !event.date ||
      !event.venue ||
      !event.organizerName ||
      !event.organizerMobile ||
      !event.capacity ||
      !event.registrationFee
    ) {
      showNotification(
        "Please fill in all required fields.",
        "warning"
      );

      return;
    }

    /*
    =========================================
    MOBILE VALIDATION
    =========================================
    */

    if (!/^[0-9]{10}$/.test(event.organizerMobile)) {
      showNotification(
        "Please enter a valid 10-digit mobile number.",
        "warning"
      );

      return;
    }

    /*
    =========================================
    CUSTOM FEE VALIDATION
    =========================================
    */

    if (
      event.registrationFee === "Custom" &&
      (!event.customFee ||
        Number(event.customFee) <= 0)
    ) {
      showNotification(
        "Please enter a valid custom registration fee.",
        "warning"
      );

      return;
    }

    /*
    =========================================
    REGISTRATION DEADLINE VALIDATION
    =========================================
    */

    if (
      event.registrationDeadline &&
      event.registrationDeadline > event.date
    ) {
      showNotification(
        "Registration deadline cannot be after the event date.",
        "warning"
      );

      return;
    }

    /*
    =========================================
    PARTICIPATION VALIDATION
    =========================================
    */

    const minTeamSize = Number(event.minTeamSize);
    const maxTeamSize = Number(event.maxTeamSize);
    const capacity = Number(event.capacity);

    if (event.participationType === "individual") {
      if (capacity < 1) {
        showNotification(
          "Maximum participants must be at least 1.",
          "warning"
        );

        return;
      }
    }

    if (event.participationType === "group") {
      if (minTeamSize < 2) {
        showNotification(
          "Group events must have at least 2 members per team.",
          "warning"
        );

        return;
      }

      if (maxTeamSize < minTeamSize) {
        showNotification(
          "Maximum team size cannot be smaller than minimum team size.",
          "warning"
        );

        return;
      }

      if (maxTeamSize > capacity) {
        showNotification(
          "Maximum team size cannot be greater than total participants.",
          "warning"
        );

        return;
      }
    }

    /*
    =========================================
    CHECK LOGIN TOKEN
    =========================================
    */

    const token = getAuthToken();

    if (!token) {
      showNotification(
        "You are not logged in. Please login again.",
        "error"
      );

      return;
    }

    /*
    =========================================
    SEND DATA TO BACKEND
    =========================================
    */

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("title", event.title);
      formData.append("category", event.category);
      formData.append("date", event.date);
      formData.append("time", event.time);
      formData.append("venue", event.venue);

      formData.append(
        "organizerName",
        event.organizerName
      );

      formData.append(
        "organizerMobile",
        event.organizerMobile
      );

      formData.append(
        "capacity",
        event.capacity
      );

      /*
      =========================================
      REGISTRATION FEE
      =========================================
      */

      const fee =
        event.registrationFee === "Free"
          ? "0"
          : event.registrationFee === "Custom"
            ? event.customFee
            : event.registrationFee;

      formData.append(
        "registrationFee",
        fee
      );

      /*
      =========================================
      REGISTRATION DEADLINE
      =========================================
      */

      if (event.registrationDeadline) {
        formData.append(
          "registrationDeadline",
          event.registrationDeadline
        );
      }

      /*
      =========================================
      DESCRIPTION
      =========================================
      */

      formData.append(
        "description",
        event.description
      );

      /*
      =========================================
      PARTICIPATION DETAILS
      =========================================
      */

      formData.append(
        "participationType",
        event.participationType
      );

      formData.append(
        "minTeamSize",
        event.participationType === "group"
          ? event.minTeamSize
          : "1"
      );

      formData.append(
        "maxTeamSize",
        event.participationType === "group"
          ? event.maxTeamSize
          : "1"
      );

      /*
      =========================================
      IMAGE
      =========================================
      */

      if (event.image) {
        formData.append(
          "image",
          event.image
        );
      }

      /*
      =========================================
      POST REQUEST
      =========================================
      */

      const response = await fetch(
        "http://localhost:8000/api/events/",
        {
          method: "POST",

          // IMPORTANT:
          // Django REST Framework TokenAuthentication
          headers: {
            Authorization: `Token ${token}`,
          },

          // Do NOT manually set Content-Type.
          // Browser handles multipart/form-data boundary.
          body: formData,
        }
      );

      /*
      =========================================
      RESPONSE
      =========================================
      */

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      /*
      =========================================
      HANDLE ERROR
      =========================================
      */

      if (!response.ok) {
        console.error(
          "Create event response:",
          data
        );

        let errorMessage =
          "Failed to create event.";

        if (data?.detail) {
          errorMessage = data.detail;
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (
          typeof data === "object" &&
          data !== null
        ) {
          const firstError =
            Object.values(data)[0];

          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (
            typeof firstError === "string"
          ) {
            errorMessage = firstError;
          }
        }

        showNotification(
          errorMessage,
          "error"
        );

        return;
      }

      /*
      =========================================
      SUCCESS
      =========================================
      */

      console.log(
        "Created event:",
        data
      );

      showNotification(
        "Event created successfully!",
        "success"
      );

      /*
      =========================================
      REDIRECT AFTER SUCCESS
      =========================================
      */

      setTimeout(() => {
        navigate("/organizer/events");
      }, 1500);

    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      showNotification(
        "Unable to connect to the backend. Make sure the backend server is running.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event-page">

      {/* =========================================
          NOTIFICATION
      ========================================= */}

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />

      {/* =========================================
          DECORATIVE BACKGROUND
      ========================================= */}

      <div className="create-event-glow create-glow-one"></div>
      <div className="create-event-glow create-glow-two"></div>

      <div className="create-event-container">

        {/* =========================================
            PAGE HEADER
        ========================================= */}

        <div className="create-event-header">

          <div className="create-event-heading">

            <span className="create-event-label">
              <Sparkles size={14} />
              ORGANIZER EVENTS
            </span>

            <h1>
              Create <span>Event.</span>
            </h1>

            <p>
              Create an exciting event and share it
              with your students.
            </p>

          </div>

        </div>

        {/* =========================================
            FORM
        ========================================= */}

        <form
          className="create-event-form"
          onSubmit={handleSubmit}
        >

          {/* =========================================
              EVENT IMAGE
          ========================================= */}

          <section className="create-form-section">

            <div className="section-heading">

              <div className="section-icon">
                <ImagePlus size={19} />
              </div>

              <div>
                <span>01</span>

                <h2>
                  Event Image
                </h2>

                <p>
                  Add an attractive image for your event.
                </p>
              </div>

            </div>

            <label className="create-image-upload">

              {imagePreview ? (

                <div className="create-image-preview-container">

                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="create-event-image-preview"
                  />

                  <div className="change-image-overlay">

                    <ImagePlus size={20} />

                    <span>
                      Change Image
                    </span>

                  </div>

                </div>

              ) : (

                <div className="create-upload-placeholder">

                  <div className="upload-image-icon">
                    <ImagePlus size={28} />
                  </div>

                  <strong>
                    Upload Event Image
                  </strong>

                  <span>
                    JPG, PNG or WEBP
                  </span>

                  <small>
                    Recommended for the best appearance
                  </small>

                </div>

              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                hidden
              />

            </label>

          </section>

          {/* =========================================
              EVENT INFORMATION
          ========================================= */}

          <section className="create-form-section">

            <div className="section-heading">

              <div className="section-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <span>02</span>

                <h2>
                  Event Information
                </h2>

                <p>
                  Tell students everything they need to know.
                </p>
              </div>

            </div>

            {/* EVENT TITLE */}

            <div className="create-form-group">

              <label>
                Event Title <span>*</span>
              </label>

              <input
                type="text"
                name="title"
                value={event.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />

            </div>

            {/* CATEGORY + CAPACITY */}

            <div className="create-form-row">

              <div className="create-form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={event.category}
                  onChange={handleChange}
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="Cultural">
                    Cultural
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Workshop">
                    Workshop
                  </option>

                  <option value="Competition">
                    Competition
                  </option>

                  <option value="Seminar">
                    Seminar
                  </option>

                </select>

              </div>

              <div className="create-form-group">

                <label>
                  Maximum Participants <span>*</span>
                </label>

                <div className="input-with-icon">

                  <Users size={17} />

                  <input
                    type="number"
                    name="capacity"
                    value={event.capacity}
                    onChange={handleChange}
                    placeholder="100"
                    min="1"
                    required
                  />

                </div>

                <small className="create-form-help">
                  Total number of students allowed for this event.
                </small>

              </div>

            </div>

            {/* PARTICIPATION TYPE */}

            <div className="create-form-group">

              <label>
                Participation Type <span>*</span>
              </label>

              <div className="input-with-icon">

                {event.participationType === "group" ? (
                  <UsersRound size={17} />
                ) : (
                  <UserPlus size={17} />
                )}

                <select
                  name="participationType"
                  value={event.participationType}
                  onChange={handleParticipationTypeChange}
                  required
                >

                  <option value="individual">
                    Individual
                  </option>

                  <option value="group">
                    Group
                  </option>

                </select>

              </div>

              <small className="create-form-help">

                {event.participationType === "individual"
                  ? "Students register individually."
                  : "Students register as a team with multiple members."}

              </small>

            </div>

            {/* GROUP TEAM SIZE */}

            {event.participationType === "group" && (

              <div className="create-form-row">

                <div className="create-form-group">

                  <label>
                    Minimum Team Size <span>*</span>
                  </label>

                  <div className="input-with-icon">

                    <Users size={17} />

                    <input
                      type="number"
                      name="minTeamSize"
                      value={event.minTeamSize}
                      onChange={handleChange}
                      min="2"
                      max={event.maxTeamSize || undefined}
                      required
                    />

                  </div>

                  <small className="create-form-help">
                    Minimum students required in one team.
                  </small>

                </div>

                <div className="create-form-group">

                  <label>
                    Maximum Team Size <span>*</span>
                  </label>

                  <div className="input-with-icon">

                    <Users size={17} />

                    <input
                      type="number"
                      name="maxTeamSize"
                      value={event.maxTeamSize}
                      onChange={handleChange}
                      min={event.minTeamSize || "2"}
                      required
                    />

                  </div>

                  <small className="create-form-help">
                    Maximum students allowed in one team.
                  </small>

                </div>

              </div>

            )}

            {/* DATE + TIME */}

            <div className="create-form-row">

              <div className="create-form-group">

                <label>
                  Event Date <span>*</span>
                </label>

                <div className="input-with-icon">

                  <CalendarDays size={17} />

                  <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              <div className="create-form-group">

                <label>
                  Event Time
                </label>

                <div className="input-with-icon">

                  <Clock3 size={17} />

                  <input
                    type="time"
                    name="time"
                    value={event.time}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

            {/* VENUE + ORGANIZER */}

            <div className="create-form-row">

              <div className="create-form-group">

                <label>
                  Venue <span>*</span>
                </label>

                <div className="input-with-icon">

                  <MapPin size={17} />

                  <input
                    type="text"
                    name="venue"
                    value={event.venue}
                    onChange={handleChange}
                    placeholder="Example: Seminar Hall"
                    required
                  />

                </div>

              </div>

              <div className="create-form-group">

                <label>
                  Organizer Name <span>*</span>
                </label>

                <div className="input-with-icon">

                  <UserRound size={17} />

                  <input
                    type="text"
                    name="organizerName"
                    value={event.organizerName}
                    onChange={handleChange}
                    placeholder="Enter organizer name"
                    required
                  />

                </div>

              </div>

            </div>

            {/* ORGANIZER MOBILE */}

            <div className="create-form-group">

              <label>
                Organizer Mobile Number <span>*</span>
              </label>

              <div className="mobile-input-wrapper">

                <div className="mobile-country-code">
                  +91
                </div>

                <div className="mobile-input-icon">
                  <Phone size={17} />
                </div>

                <input
                  type="tel"
                  name="organizerMobile"
                  value={event.organizerMobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  required
                />

              </div>

              <small className="create-form-help">
                Students can use this number to contact the organizer.
              </small>

            </div>

            {/* REGISTRATION FEE */}

            <div className="create-form-group">

              <label>
                Registration Fee <span>*</span>
              </label>

              <div className="input-with-icon">

                <IndianRupee size={17} />

                <select
                  name="registrationFee"
                  value={event.registrationFee}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select registration fee
                  </option>

                  <option value="Free">
                    Free
                  </option>

                  <option value="20">
                    ₹20
                  </option>

                  <option value="50">
                    ₹50
                  </option>

                  <option value="100">
                    ₹100
                  </option>

                  <option value="Custom">
                    Custom
                  </option>

                </select>

              </div>

              {event.registrationFee === "Custom" && (

                <input
                  className="custom-fee-input"
                  type="number"
                  name="customFee"
                  value={event.customFee}
                  onChange={handleChange}
                  placeholder="Enter custom amount (₹)"
                  min="1"
                  required
                />

              )}

            </div>

            {/* REGISTRATION DEADLINE */}

            <div className="create-form-group">

              <label>
                Registration Deadline
              </label>

              <div className="input-with-icon">

                <CalendarDays size={17} />

                <input
                  type="date"
                  name="registrationDeadline"
                  value={event.registrationDeadline}
                  onChange={handleChange}
                  max={event.date || undefined}
                />

              </div>

              <small className="create-form-help">
                Last date for students to register for this event.
              </small>

            </div>

            {/* DESCRIPTION */}

            <div className="create-form-group">

              <label>
                Description
              </label>

              <div className="textarea-wrapper">

                <FileText size={17} />

                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows="6"
                />

              </div>

            </div>

          </section>

          {/* =========================================
              ACTIONS
          ========================================= */}

          <div className="create-event-actions">

            <button
              type="button"
              className="create-cancel-btn"
              onClick={() =>
                navigate("/organizer/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : "Save Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateEvent;