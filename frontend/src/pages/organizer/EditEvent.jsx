import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Notification from "../../components/Notification";
import "./EditEvent.css";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================================================
     NOTIFICATION
  ========================================================= */

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });

  const showNotification = (
    message,
    type = "success"
  ) => {
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

  /* =========================================================
     FETCH EVENT
  ========================================================= */

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:8000/api/events/${id}/`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Fetch event error:",
            data
          );

          showNotification(
            data.message ||
              JSON.stringify(data) ||
              "Failed to fetch event.",
            "error"
          );

          return;
        }

        /* =====================================================
           REGISTRATION FEE
        ===================================================== */

        let registrationFee =
          data.registrationFee ??
          data.registration_fee ??
          "";

        let customFee = "";

        const numericFee =
          Number(registrationFee);

        if (
          registrationFee === null ||
          registrationFee === undefined ||
          registrationFee === ""
        ) {
          registrationFee = "";
        } else if (numericFee === 0) {
          registrationFee = "Free";
        } else if (
          numericFee === 20 ||
          numericFee === 50 ||
          numericFee === 100
        ) {
          registrationFee =
            String(numericFee);
        } else {
          registrationFee = "Custom";
          customFee = String(numericFee);
        }

        /* =====================================================
           EXISTING IMAGE
        ===================================================== */

        const existingImage =
          data.image || "";

        let previewImage = "";

        if (existingImage) {
          if (
            existingImage.startsWith(
              "http://"
            ) ||
            existingImage.startsWith(
              "https://"
            ) ||
            existingImage.startsWith(
              "data:"
            )
          ) {
            previewImage =
              existingImage;
          } else {
            previewImage =
              `http://localhost:8000${existingImage}`;
          }
        }

        /* =====================================================
           FORMAT EVENT DATA
        ===================================================== */

        const formattedEvent = {
          ...data,

          title: data.title || "",

          category:
            data.category || "",

          date: data.date
            ? String(data.date).slice(
                0,
                10
              )
            : "",

          time: data.time
            ? String(data.time).slice(
                0,
                5
              )
            : "",

          venue: data.venue || "",

          capacity:
            data.capacity !== null &&
            data.capacity !== undefined
              ? data.capacity
              : "",

          organizerName:
            data.organizerName ||
            data.organizer_name ||
            "",

          organizerMobile:
            data.organizerMobile ||
            data.organizer_mobile ||
            "",

          registrationFee,

          customFee,

          registrationDeadline:
            data.registrationDeadline ||
            data.registration_deadline ||
            "",

          description:
            data.description || "",

          image: existingImage,
        };

        setEvent(formattedEvent);

        setImagePreview(
          previewImage
        );

        /*
          Existing image is NOT a File.
          Only newly selected images go into imageFile.
        */

        setImageFile(null);
      } catch (error) {
        console.error(
          "Fetch event error:",
          error
        );

        showNotification(
          "Unable to connect to the backend. Make sure the backend server is running.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setEvent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     HANDLE IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (e) => {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    /* =======================================================
       CHECK IMAGE TYPE
    ======================================================= */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      showNotification(
        "Please select a JPG, PNG or WEBP image.",
        "error"
      );

      e.target.value = "";

      return;
    }

    /* =======================================================
       CHECK IMAGE SIZE
    ======================================================= */

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      showNotification(
        "Image size must be less than 5 MB.",
        "error"
      );

      e.target.value = "";

      return;
    }

    /* =======================================================
       SAVE ACTUAL FILE
    ======================================================= */

    setImageFile(file);

    /* =======================================================
       CREATE IMAGE PREVIEW
    ======================================================= */

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(
      previewUrl
    );
  };

  /* =========================================================
     UPDATE EVENT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event) {
      return;
    }

    /* =======================================================
       REQUIRED FIELD VALIDATION
    ======================================================= */

    if (
      !event.title ||
      !event.date ||
      !event.venue ||
      !event.organizerName ||
      !event.capacity ||
      !event.registrationFee
    ) {
      showNotification(
        "Please fill in all required fields.",
        "error"
      );

      return;
    }

    /* =======================================================
       CAPACITY VALIDATION
    ======================================================= */

    const capacityNumber =
      Number(event.capacity);

    if (
      !Number.isInteger(
        capacityNumber
      ) ||
      capacityNumber <= 0
    ) {
      showNotification(
        "Please enter a valid maximum participant capacity.",
        "error"
      );

      return;
    }

    /* =======================================================
       CUSTOM FEE VALIDATION
    ======================================================= */

    if (
      event.registrationFee ===
        "Custom" &&
      (!event.customFee ||
        Number(event.customFee) <=
          0)
    ) {
      showNotification(
        "Please enter a valid custom registration fee.",
        "error"
      );

      return;
    }

    /* =======================================================
       DEADLINE VALIDATION
    ======================================================= */

    if (
      event.registrationDeadline &&
      event.registrationDeadline >
        event.date
    ) {
      showNotification(
        "Registration deadline cannot be after the event date.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      /* =====================================================
         REGISTRATION FEE
      ===================================================== */

      let finalRegistrationFee =
        0;

      if (
        event.registrationFee ===
        "Free"
      ) {
        finalRegistrationFee = 0;
      } else if (
        event.registrationFee ===
        "Custom"
      ) {
        finalRegistrationFee =
          Number(event.customFee);
      } else {
        finalRegistrationFee =
          Number(
            event.registrationFee
          );
      }

      /* =====================================================
         CREATE FORMDATA
      ===================================================== */

      const formData =
        new FormData();

      /* =====================================================
         BASIC EVENT INFORMATION
      ===================================================== */

      formData.append(
        "title",
        event.title.trim()
      );

      formData.append(
        "category",
        event.category || ""
      );

      formData.append(
        "date",
        event.date
      );

      formData.append(
        "time",
        event.time || ""
      );

      formData.append(
        "venue",
        event.venue.trim()
      );

      formData.append(
        "capacity",
        String(capacityNumber)
      );

      formData.append(
        "registrationFee",
        String(
          finalRegistrationFee
        )
      );

      formData.append(
        "description",
        event.description || ""
      );

      /* =====================================================
         ORGANIZER NAME
      ===================================================== */

      formData.append(
        "organizerName",
        event.organizerName.trim()
      );

      /* =====================================================
         ORGANIZER MOBILE
      ===================================================== */

      if (
        event.organizerMobile
      ) {
        formData.append(
          "organizerMobile",
          event.organizerMobile
        );
      }

      /* =====================================================
         REGISTRATION DEADLINE
      ===================================================== */

      if (
        event.registrationDeadline
      ) {
        formData.append(
          "registrationDeadline",
          event.registrationDeadline
        );
      }

      /* =====================================================
         IMAGE
      ===================================================== */

      /*
        Only append image when the user
        selected a NEW image.

        If no new image is selected,
        backend keeps the existing image.
      */

      if (imageFile) {
        formData.append(
          "image",
          imageFile
        );
      }

      /* =====================================================
         DEBUG
      ===================================================== */

      console.log(
        "===================================="
      );

      console.log(
        "Updating Event:",
        id
      );

      console.log(
        "HTTP Method:",
        "PUT"
      );

      console.log(
        "Image:",
        imageFile
          ? imageFile.name
          : "Existing image kept"
      );

      console.log(
        "Registration Fee:",
        finalRegistrationFee
      );

      console.log(
        "===================================="
      );

      /* =====================================================
         SEND PUT REQUEST
      ===================================================== */

      const response =
        await fetch(
          `http://localhost:8000/api/events/${id}/`,
          {
            method: "PUT",
            body: formData,
          }
        );

      /* =====================================================
         READ RESPONSE
      ===================================================== */

      let data = {};

      try {
        data =
          await response.json();
      } catch (error) {
        console.error(
          "Could not read backend response:",
          error
        );
      }

      console.log(
        "Update Status:",
        response.status
      );

      console.log(
        "Update Response:",
        data
      );

      /* =====================================================
         BACKEND ERROR
      ===================================================== */

      if (!response.ok) {
        console.error(
          "Backend rejected update:",
          data
        );

        let errorMessage =
          "Failed to update event.";

        if (data.message) {
          errorMessage =
            data.message;
        } else if (data.detail) {
          errorMessage =
            data.detail;
        } else if (
          typeof data ===
          "string"
        ) {
          errorMessage = data;
        } else if (
          data &&
          typeof data ===
            "object" &&
          Object.keys(data)
            .length > 0
        ) {
          errorMessage =
            Object.entries(data)
              .map(
                ([
                  field,
                  errors,
                ]) => {
                  if (
                    Array.isArray(
                      errors
                    )
                  ) {
                    return `${field}: ${errors.join(
                      ", "
                    )}`;
                  }

                  return `${field}: ${errors}`;
                }
              )
              .join("\n");
        }

        showNotification(
          `Failed to update event.\n\n${errorMessage}`,
          "error"
        );

        return;
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      console.log(
        "Event updated successfully:",
        data
      );

      showNotification(
        "Event updated successfully!",
        "success"
      );

      /*
        Give the website notification
        time to appear before navigating.
      */

      setTimeout(() => {
        navigate(
          "/organizer/events"
        );
      }, 1200);
    } catch (error) {
      console.error(
        "Update event error:",
        error
      );

      showNotification(
        "Unable to connect to the backend. Make sure the backend server is running.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <div className="organizer-page">

        <Notification
          message={
            notification.message
          }
          type={
            notification.type
          }
          onClose={
            closeNotification
          }
        />

        <div className="empty-state">

          <h2>
            Loading Event...
          </h2>

          <p>
            Please wait while the
            event details are loaded.
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     EVENT NOT FOUND
  ========================================================= */

  if (!event) {
    return (
      <div className="organizer-page">

        <Notification
          message={
            notification.message
          }
          type={
            notification.type
          }
          onClose={
            closeNotification
          }
        />

        <div className="empty-state">

          <h2>
            Event Not Found
          </h2>

          <p>
            The event you are
            looking for does not exist.
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              navigate(
                "/organizer/events"
              )
            }
          >
            Back to My Events
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="organizer-page">

      {/* =====================================================
          WEBSITE NOTIFICATION
      ===================================================== */}

      <Notification
        message={
          notification.message
        }
        type={
          notification.type
        }
        onClose={
          closeNotification
        }
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="organizer-header">

        <div>

          <h1>
            EDIT EVENT
          </h1>

          <p className="page-subtitle">
            Update your event information.
          </p>

        </div>

      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form
        className="event-form"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            EVENT IMAGE
        =================================================== */}

        <div className="form-section">

          <h2>
            Event Image
          </h2>

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
              onChange={
                handleImageChange
              }
              hidden
            />

          </label>

        </div>

        {/* ===================================================
            EVENT INFORMATION
        =================================================== */}

        <div className="form-section">

          <h2>
            Event Information
          </h2>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="form-group">

            <label>
              Event Title{" "}
              <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={
                event.title || ""
              }
              onChange={
                handleChange
              }
              placeholder="Enter event title"
              required
            />

          </div>

          {/* =================================================
              CATEGORY + CAPACITY
          ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={
                  event.category || ""
                }
                onChange={
                  handleChange
                }
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
                Maximum Participants{" "}
                <span>*</span>
              </label>

              <input
                type="number"
                name="capacity"
                value={
                  event.capacity || ""
                }
                onChange={
                  handleChange
                }
                placeholder="100"
                min="1"
                required
              />

            </div>

          </div>

          {/* =================================================
              DATE + TIME
          ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Event Date{" "}
                <span>*</span>
              </label>

              <input
                type="date"
                name="date"
                value={
                  event.date || ""
                }
                onChange={
                  handleChange
                }
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
                value={
                  event.time || ""
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          {/* =================================================
              VENUE + ORGANIZER
          ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Venue{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="venue"
                value={
                  event.venue || ""
                }
                onChange={
                  handleChange
                }
                placeholder="Example: Seminar Hall"
                required
              />

            </div>

            <div className="form-group">

              <label>
                Organizer Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="organizerName"
                value={
                  event.organizerName ||
                  ""
                }
                onChange={
                  handleChange
                }
                placeholder="Enter organizer name"
                required
              />

            </div>

          </div>

          {/* =================================================
              ORGANIZER MOBILE
          ================================================= */}

          {event.organizerMobile !==
            undefined && (
            <div className="form-group">

              <label>
                Organizer Mobile
              </label>

              <input
                type="tel"
                name="organizerMobile"
                value={
                  event.organizerMobile ||
                  ""
                }
                onChange={
                  handleChange
                }
                placeholder="Enter mobile number"
              />

            </div>
          )}

          {/* =================================================
              REGISTRATION FEE
          ================================================= */}

          <div className="form-group">

            <label>
              Registration Fee{" "}
              <span>*</span>
            </label>

            <select
              name="registrationFee"
              value={
                event.registrationFee ||
                ""
              }
              onChange={
                handleChange
              }
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

            {/* CUSTOM FEE */}

            {event.registrationFee ===
              "Custom" && (

              <input
                type="number"
                name="customFee"
                value={
                  event.customFee || ""
                }
                onChange={
                  handleChange
                }
                placeholder="Enter custom amount (₹)"
                min="1"
                required
                style={{
                  marginTop: "12px",
                }}
              />

            )}

          </div>

          {/* =================================================
              REGISTRATION DEADLINE
          ================================================= */}

          <div className="form-group">

            <label>
              Registration Deadline
            </label>

            <input
              type="date"
              name="registrationDeadline"
              value={
                event.registrationDeadline ||
                ""
              }
              onChange={
                handleChange
              }
              max={
                event.date ||
                undefined
              }
            />

            <small className="form-help">
              Last date for students
              to register for this event.
            </small>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                event.description || ""
              }
              onChange={
                handleChange
              }
              placeholder="Describe your event..."
              rows="5"
            />

          </div>

        </div>

        {/* =====================================================
            FORM ACTIONS
        ===================================================== */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(
                "/organizer/events"
              )
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
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditEvent;