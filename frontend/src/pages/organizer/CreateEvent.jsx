import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    capacity: "",
    registrationFee: "",
    customFee: "",
    registrationDeadline: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Make sure the selected file is actually an image
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Store the actual File object
    setEvent((previous) => ({
      ...previous,
      image: file,
    }));

    // Create preview for the form
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !event.title ||
      !event.date ||
      !event.venue ||
      !event.organizerName ||
      !event.capacity ||
      !event.registrationFee
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (
      event.registrationFee === "Custom" &&
      (!event.customFee || Number(event.customFee) <= 0)
    ) {
      alert("Please enter a valid custom registration fee.");
      return;
    }

    if (
      event.registrationDeadline &&
      event.registrationDeadline > event.date
    ) {
      alert("Registration deadline cannot be after the event date.");
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * IMPORTANT:
       * Use FormData because we are uploading an actual image file.
       */
      const formData = new FormData();

      formData.append("title", event.title);
      formData.append("category", event.category);
      formData.append("date", event.date);
      formData.append("time", event.time);
      formData.append("venue", event.venue);
      formData.append("organizerName", event.organizerName);
      formData.append("capacity", event.capacity);

      const fee =
        event.registrationFee === "Free"
          ? "0"
          : event.registrationFee === "Custom"
            ? event.customFee
            : event.registrationFee;

      formData.append("registrationFee", fee);

      if (event.registrationDeadline) {
        formData.append(
          "registrationDeadline",
          event.registrationDeadline
        );
      }

      formData.append("description", event.description);

      // Only append image when the organizer selected one
      if (event.image) {
        formData.append("image", event.image);
      }

      const response = await fetch(
        "http://localhost:8000/api/events/",
        {
          method: "POST",

          /*
           * DO NOT set Content-Type manually here.
           * The browser automatically adds:
           * multipart/form-data; boundary=...
           */
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Create event response:", data);

        alert(
          data?.detail ||
            data?.message ||
            "Failed to create event."
        );

        return;
      }

      console.log("Created event:", data);

      alert("Event created successfully!");

      navigate("/organizer/events");
    } catch (error) {
      console.error("Create event error:", error);

      alert(
        "Unable to connect to the backend. Make sure the backend server is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="organizer-page create-event-page">
      <div className="organizer-header">
        <div>
          <h1 style={{ color: "#101a4a" }}>CREATE EVENT</h1>

          <p className="page-subtitle">
            Create a new event and share it with students.
          </p>
        </div>
      </div>

      <form
        className="event-form"
        onSubmit={handleSubmit}
      >
        {/* EVENT IMAGE */}
        <div className="form-section">
          <h2>Event Image</h2>

          <label className="image-upload">
            {imagePreview ? (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="event-image-preview"
                />

                <div className="change-image">
                  Change Image
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>

                <strong>Upload Event Image</strong>

                <small>
                  JPG, PNG or WEBP
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
        </div>

        {/* EVENT INFORMATION */}
        <div className="form-section">
          <h2>Event Information</h2>

          {/* EVENT TITLE */}
          <div className="form-group">
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
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>

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

            <div className="form-group">
              <label>
                Maximum Participants <span>*</span>
              </label>

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
          </div>

          {/* EVENT DATE + TIME */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Event Date <span>*</span>
              </label>

              <input
                type="date"
                name="date"
                value={event.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Event Time</label>

              <input
                type="time"
                name="time"
                value={event.time}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* VENUE + ORGANIZER */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Venue <span>*</span>
              </label>

              <input
                type="text"
                name="venue"
                value={event.venue}
                onChange={handleChange}
                placeholder="Example: Seminar Hall"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Organizer Name <span>*</span>
              </label>

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

          {/* REGISTRATION FEE */}
          <div className="form-group">
            <label>
              Registration Fee <span>*</span>
            </label>

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

            {event.registrationFee === "Custom" && (
              <input
                type="number"
                name="customFee"
                value={event.customFee}
                onChange={handleChange}
                placeholder="Enter custom amount (₹)"
                min="1"
                required
                style={{ marginTop: "12px" }}
              />
            )}
          </div>

          {/* REGISTRATION DEADLINE */}
          <div className="form-group">
            <label>
              Registration Deadline
            </label>

            <input
              type="date"
              name="registrationDeadline"
              value={event.registrationDeadline}
              onChange={handleChange}
              max={event.date || undefined}
            />

            <small className="form-help">
              Last date for students to register for this event.
            </small>
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              rows="5"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/organizer/dashboard")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;