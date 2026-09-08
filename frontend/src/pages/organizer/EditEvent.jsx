import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH EVENT
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/events/${id}/`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to fetch event.");
          return;
        }

        const fetchedEvent = data;

        let registrationFee =
          fetchedEvent.registrationFee ||
          fetchedEvent.registration_fee ||
          "";

        let customFee = "";

        // If database contains a custom numeric amount
        if (
          registrationFee !== "Free" &&
          registrationFee !== "20" &&
          registrationFee !== "50" &&
          registrationFee !== "100"
        ) {
          customFee = registrationFee;
          registrationFee = "Custom";
        }

        const formattedEvent = {
          ...fetchedEvent,

          organizerName:
            fetchedEvent.organizerName ||
            fetchedEvent.organizer_name ||
            "",

          registrationFee,
          customFee,

          registrationDeadline:
            fetchedEvent.registrationDeadline ||
            fetchedEvent.registration_deadline ||
            "",

          date: fetchedEvent.date
            ? String(fetchedEvent.date).slice(0, 10)
            : "",

          time: fetchedEvent.time
            ? String(fetchedEvent.time).slice(0, 5)
            : "",

          category: fetchedEvent.category || "",
          capacity: fetchedEvent.capacity || "",
          venue: fetchedEvent.venue || "",
          description: fetchedEvent.description || "",
          image: fetchedEvent.image || "",
        };

        setEvent(formattedEvent);
        setImagePreview(formattedEvent.image);
      } catch (error) {
        console.error("Fetch event error:", error);

        alert(
          "Unable to connect to the backend. Make sure the backend server is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEvent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // HANDLE IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);

      setEvent((previous) => ({
        ...previous,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // UPDATE EVENT
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
      setSaving(true);

      const finalRegistrationFee =
        event.registrationFee === "Custom"
          ? event.customFee
          : event.registrationFee;

      const response = await fetch(
        `http://localhost:8000/api/events/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: event.title,
            category: event.category || "",
            date: event.date,
            time: event.time || "",
            venue: event.venue,
            organizerName: event.organizerName,
            capacity: Number(event.capacity),
            registrationFee: finalRegistrationFee,
            registrationDeadline:
              event.registrationDeadline || "",
            description: event.description || "",
            image: event.image || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update event.");
        return;
      }

      alert("Event updated successfully!");

      navigate("/organizer/events");
    } catch (error) {
      console.error("Update event error:", error);

      alert(
        "Unable to connect to the backend. Make sure the backend server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="organizer-page">
        <div className="empty-state">
          <h2>Loading Event...</h2>
          <p>Please wait while the event details are loaded.</p>
        </div>
      </div>
    );
  }

  // EVENT NOT FOUND
  if (!event) {
    return (
      <div className="organizer-page">
        <div className="empty-state">
          <h2>Event Not Found</h2>

          <p>
            The event you are looking for does not exist.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/organizer/events")}
          >
            Back to My Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="organizer-page">

      {/* PAGE HEADER */}
      <div className="organizer-header">
        <div>
          <h1>EDIT EVENT</h1>

          <p className="page-subtitle">
            Update your event information.
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
                  alt="Event"
                  className="event-image-preview"
                />

                <div className="change-image">
                  Change Image
                </div>

              </div>
            ) : (
              <div className="upload-placeholder">

                <span className="upload-icon">
                  📷
                </span>

                <strong>
                  Upload Event Image
                </strong>

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
              value={event.title || ""}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />

          </div>

          {/* CATEGORY + CAPACITY */}
          <div className="form-row">

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={event.category || ""}
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
                value={event.capacity || ""}
                onChange={handleChange}
                placeholder="100"
                min="1"
                required
              />

            </div>

          </div>

          {/* DATE + TIME */}
          <div className="form-row">

            <div className="form-group">

              <label>
                Event Date <span>*</span>
              </label>

              <input
                type="date"
                name="date"
                value={event.date || ""}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>
                Event Time
              </label>

              <input
                type="time"
                name="time"
                value={event.time || ""}
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
                value={event.venue || ""}
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
                value={event.organizerName || ""}
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
              value={event.registrationFee || ""}
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
                value={event.customFee || ""}
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
              value={event.registrationDeadline || ""}
              onChange={handleChange}
              max={event.date || undefined}
            />

            <small className="form-help">
              Last date for students to register for this event.
            </small>

          </div>

          {/* DESCRIPTION */}
          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={event.description || ""}
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
              navigate("/organizer/events")
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditEvent;