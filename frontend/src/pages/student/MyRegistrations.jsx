import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import "./MyRegistrations.css";

const API_URL = "http://127.0.0.1:8000";

/* =========================================================
   IMAGE HELPERS
   ========================================================= */

const getEventId = (registration) => {
  if (!registration) return null;

  if (typeof registration.event === "number") {
    return registration.event;
  }

  if (typeof registration.event === "string") {
    return Number(registration.event) || null;
  }

  if (
    registration.event &&
    typeof registration.event === "object"
  ) {
    return registration.event.id || null;
  }

  return (
    registration.event_id ||
    registration.eventId ||
    null
  );
};

const getEventImageUrl = (registration) => {
  if (!registration) return "";

  const rawImage =
    registration.event_image ||
    registration.event_image_url ||
    registration.image_url ||
    registration.image ||
    registration.event?.image_url ||
    registration.event?.image ||
    registration.eventData?.image_url ||
    registration.eventData?.image ||
    "";

  if (!rawImage) return "";

  let imageUrl = rawImage;

  if (typeof imageUrl === "object") {
    imageUrl =
      imageUrl.url ||
      imageUrl.image ||
      imageUrl.image_url ||
      "";
  }

  if (!imageUrl || typeof imageUrl !== "string") {
    return "";
  }

  imageUrl = imageUrl.trim();

  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  return `${API_URL}/${imageUrl}`;
};


/* =========================================================
   COMPONENT
   ========================================================= */

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);

  const [cancellingId, setCancellingId] = useState(null);

  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    fetchMyRegistrations();
  }, []);


  /* =======================================================
     FETCH REGISTRATIONS
     ======================================================= */

  const fetchMyRegistrations = async () => {

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setError("Please login to view your registrations.");
      setLoading(false);
      return;
    }

    try {

      setLoading(true);
      setError("");

      const registrationResponse = await fetch(
        `${API_URL}/api/registrations/my/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (registrationResponse.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!registrationResponse.ok) {
        throw new Error(
          "Failed to load registrations."
        );
      }

      const registrationData =
        await registrationResponse.json();

      const registrationList =
        Array.isArray(registrationData)
          ? registrationData
          : registrationData.results || [];

      let eventList = [];

      try {

        const eventsResponse = await fetch(
          `${API_URL}/api/events/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (eventsResponse.ok) {

          const eventsData =
            await eventsResponse.json();

          eventList =
            Array.isArray(eventsData)
              ? eventsData
              : eventsData.results || [];
        }

      } catch (eventError) {

        console.error(
          "Could not fetch events for registration images:",
          eventError
        );
      }

      const enrichedRegistrations =
        registrationList.map(
          (registration) => {

            const eventId =
              getEventId(registration);

            const matchingEvent =
              eventList.find(
                (event) =>
                  Number(event.id) ===
                  Number(eventId)
              );

            return {
              ...registration,

              eventData:
                matchingEvent || null,

              event_title:
                registration.event_title ||
                registration.event?.title ||
                matchingEvent?.title ||
                "Event",

              event_date:
                registration.event_date ||
                registration.event?.date ||
                matchingEvent?.date ||
                "",

              event_time:
                registration.event_time ||
                registration.event?.time ||
                matchingEvent?.time ||
                "",

              event_venue:
                registration.event_venue ||
                registration.event?.venue ||
                matchingEvent?.venue ||
                "",

              event_status:
                registration.event_status ||
                registration.event?.status ||
                matchingEvent?.status ||
                "",

              event_image:
                registration.event_image ||
                registration.event_image_url ||
                registration.image_url ||
                registration.image ||
                registration.event?.image_url ||
                registration.event?.image ||
                matchingEvent?.image_url ||
                matchingEvent?.image ||
                "",
            };
          }
        );

      setRegistrations(
        enrichedRegistrations
      );

    } catch (err) {

      console.error(
        "Registration fetch error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load your registrations."
      );

    } finally {

      setLoading(false);
    }
  };


  /* =======================================================
     CHECK WHETHER EVENT IS PAST
     ======================================================= */

  const isPastEvent = (registration) => {

    if (!registration?.event_date) {
      return false;
    }

    const eventDate =
      new Date(
        registration.event_date
      );

    if (
      Number.isNaN(
        eventDate.getTime()
      )
    ) {
      return false;
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    eventDate.setHours(
      0,
      0,
      0,
      0
    );

    return eventDate < today;
  };


  /* =======================================================
     CAN CANCEL
     ======================================================= */

  const canCancelRegistration = (
    registration
  ) => {

    if (!registration) {
      return false;
    }

    if (
      registration.status
        ?.toLowerCase() ===
      "cancelled"
    ) {
      return false;
    }

    if (
      registration.event_status
        ?.toLowerCase() ===
      "cancelled"
    ) {
      return false;
    }

    if (
      isPastEvent(
        registration
      )
    ) {
      return false;
    }

    return true;
  };


  /* =======================================================
     CANCEL MODAL
     ======================================================= */

  const openCancelConfirmation = (
    registration
  ) => {

    if (!registration?.id) {
      return;
    }

    if (
      !canCancelRegistration(
        registration
      )
    ) {
      setCancelError(
        "This registration can no longer be cancelled because the event has already ended."
      );

      return;
    }

    setCancelError("");

    setCancelTarget(
      registration
    );
  };


  const closeCancelConfirmation = () => {

    if (cancellingId) {
      return;
    }

    setCancelTarget(null);

    setCancelError("");
  };


  /* =======================================================
     CANCEL REGISTRATION
     ======================================================= */

  const cancelRegistration = async () => {

    if (!cancelTarget?.id) {
      return;
    }

    const registrationId =
      cancelTarget.id;

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {

      setCancelError(
        "Please login again."
      );

      return;
    }

    try {

      setCancellingId(
        registrationId
      );

      setCancelError("");

      const response =
        await fetch(
          `${API_URL}/api/registrations/${registrationId}/cancel/`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Token ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      let data = {};

      try {

        data =
          await response.json();

      } catch {

        data = {};
      }

      if (
        response.status ===
        401
      ) {

        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (
        response.status ===
        404
      ) {

        throw new Error(
          data?.detail ||
          "Registration was not found."
        );
      }

      if (!response.ok) {

        throw new Error(
          data?.detail ||
          data?.message ||
          "Unable to cancel registration."
        );
      }

      setRegistrations(
        (current) =>
          current.map(
            (registration) =>
              registration.id ===
              registrationId
                ? {
                    ...registration,
                    status:
                      "cancelled",
                  }
                : registration
          )
      );

      setCancelTarget(
        null
      );

      setCancelError("");

    } catch (err) {

      console.error(
        "Cancel registration error:",
        err
      );

      setCancelError(
        err?.message ||
        "Unable to cancel registration. Please try again."
      );

    } finally {

      setCancellingId(
        null
      );
    }
  };


  /* =======================================================
     FORMATTERS
     ======================================================= */

  const formatDate = (
    dateString
  ) => {

    if (!dateString) {
      return "Date not available";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };


  const formatTime = (
    timeString
  ) => {

    if (!timeString) {
      return "Time not available";
    }

    const [
      hours,
      minutes
    ] =
      String(
        timeString
      ).split(":");

    const date =
      new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  const isCancelled = (
    registration
  ) =>
    registration?.status
      ?.toLowerCase() ===
    "cancelled";


  const getStatusClass = (
    status
  ) =>
    status?.toLowerCase() ===
    "cancelled"
      ? "cancelled-badge"
      : "confirmed-badge";


  const getStatusIcon = (
    status
  ) =>
    status?.toLowerCase() ===
    "cancelled" ? (
      <XCircle size={14} />
    ) : (
      <CheckCircle2 size={14} />
    );


  /* =======================================================
     COUNTS
     ======================================================= */

  const confirmedCount =
    registrations.filter(
      (registration) =>
        registration.status
          ?.toLowerCase() ===
        "confirmed"
    ).length;


  const cancelledCount =
    registrations.filter(
      (registration) =>
        isCancelled(
          registration
        )
    ).length;


  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );


  const upcomingCount =
    registrations.filter(
      (registration) => {

        if (
          !registration.event_date ||
          isCancelled(
            registration
          )
        ) {
          return false;
        }

        const eventDate =
          new Date(
            registration.event_date
          );

        if (
          Number.isNaN(
            eventDate.getTime()
          )
        ) {
          return false;
        }

        eventDate.setHours(
          0,
          0,
          0,
          0
        );

        return (
          eventDate >= today
        );
      }
    ).length;


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="registrations-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <section className="registrations-header">

        <div>

          <span className="registration-label">
            YOUR EVENT ACTIVITY
          </span>

          <h1>
            My Registrations
          </h1>

          <p>
            Keep track of the events you joined,
            check their details, and manage your
            registration status.
          </p>

        </div>

        <Link
          to="/events"
          className="browse-registration-btn"
        >
          Browse Events
          <ArrowRight size={16} />
        </Link>

      </section>


      {/* ===================================================
          SUMMARY
      =================================================== */}

      <section className="registration-summary">

        <div className="registration-summary-card">

          <div className="summary-icon purple-summary">
            <Ticket size={21} />
          </div>

          <div>
            <span>
              TOTAL REGISTRATIONS
            </span>

            <strong>
              {registrations.length}
            </strong>

            <small>
              All joined events
            </small>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon green-summary">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              ACTIVE
            </span>

            <strong>
              {confirmedCount}
            </strong>

            <small>
              Confirmed registrations
            </small>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon blue-summary">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>
              UPCOMING
            </span>

            <strong>
              {upcomingCount}
            </strong>

            <small>
              Today & future events
            </small>
          </div>

        </div>


        <div className="registration-summary-card">

          <div className="summary-icon pink-summary">
            <XCircle size={21} />
          </div>

          <div>
            <span>
              CANCELLED
            </span>

            <strong>
              {cancelledCount}
            </strong>

            <small>
              Cancelled registrations
            </small>
          </div>

        </div>

      </section>


      {/* ===================================================
          REGISTRATION LIST
      =================================================== */}

      <section className="registration-list-section">

        <div className="registration-list-heading">

          <div>

            <span>
              YOUR EVENT JOURNEY
            </span>

            <h2>
              Registration Activity
            </h2>

          </div>

          {!loading &&
            !error &&
            registrations.length > 0 && (

              <span className="activity-count">

                {registrations.length}{" "}

                {
                  registrations.length === 1
                    ? "registration"
                    : "registrations"
                }

              </span>

            )}

        </div>


        {/* =================================================
            GENERAL ERROR
        ================================================= */}

        {!loading &&
          error && (

            <div className="registration-message error-message">

              <XCircle size={30} />

              <h3>
                Unable to load registrations
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="retry-button"
                onClick={
                  fetchMyRegistrations
                }
              >
                Try Again
                <ArrowRight size={14} />
              </button>

            </div>

          )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="registration-message loading-message">

            <div className="message-icon loading-icon">

              <Loader2 size={30} />

            </div>

            <h3>
              Loading your registrations...
            </h3>

            <p>
              Please wait while we fetch your
              event activity.
            </p>

          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          registrations.length === 0 && (

            <div className="registration-message empty-message">

              <div className="message-icon">

                <CalendarDays size={30} />

              </div>

              <h3>
                No registrations yet
              </h3>

              <p>
                You haven't registered for any
                events yet. Explore the available
                events and join your next campus
                experience.
              </p>

              <Link
                to="/events"
                className="browse-registration-btn"
              >
                Explore Events
                <ArrowRight size={16} />
              </Link>

            </div>

          )}


        {/* =================================================
            CARDS
        ================================================= */}

        {!loading &&
          !error &&
          registrations.length > 0 && (

            <div className="registration-list">

              {registrations.map(
                (registration) => {

                  const cancelled =
                    isCancelled(
                      registration
                    );

                  const past =
                    isPastEvent(
                      registration
                    );

                  const canCancel =
                    canCancelRegistration(
                      registration
                    );

                  const isCancelling =
                    cancellingId ===
                    registration.id;

                  const imageUrl =
                    getEventImageUrl(
                      registration
                    );

                  return (

                    <article
                      className={`registration-item ${
                        cancelled
                          ? "is-cancelled"
                          : ""
                      }`}
                      key={
                        registration.id
                      }
                    >

                      {/* DATE RAIL */}

                      <div className="registration-date-rail">

                        <span>
                          {cancelled
                            ? "STATUS"
                            : "EVENT DATE"}
                        </span>

                        <strong>
                          {cancelled
                            ? "—"
                            : registration.event_date
                            ? new Date(
                                registration.event_date
                              ).getDate()
                            : "—"}
                        </strong>

                        <small>
                          {cancelled
                            ? "Cancelled"
                            : registration.event_date
                            ? new Date(
                                registration.event_date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                }
                              )
                            : "TBA"}
                        </small>

                      </div>


                      {/* IMAGE */}

                      <div className="registration-image">

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={
                              registration.event_title ||
                              "Event"
                            }
                            loading="lazy"
                            onError={(
                              event
                            ) => {

                              event.currentTarget.style.display =
                                "none";

                              const placeholder =
                                event
                                  .currentTarget
                                  .parentElement
                                  .querySelector(
                                    ".registration-image-placeholder"
                                  );

                              if (
                                placeholder
                              ) {
                                placeholder.style.display =
                                  "flex";
                              }

                            }}
                          />

                        ) : null}


                        <div
                          className="registration-image-placeholder"
                          style={{
                            display:
                              imageUrl
                                ? "none"
                                : "flex",
                          }}
                        >
                          <Ticket
                            size={32}
                          />

                          <span>
                            Event Image
                          </span>

                        </div>


                        <span>
                          {cancelled
                            ? "CANCELLED"
                            : "REGISTERED"}
                        </span>

                      </div>


                      {/* DETAILS */}

                      <div className="registration-event-details">

                        <div className="registration-event-top">

                          <div>

                            <span className="event-mini-label">

                              {cancelled
                                ? "REGISTRATION ENDED"
                                : past
                                ? "EVENT ENDED"
                                : "CAMPUS EVENT"}

                            </span>

                            <h3>
                              {
                                registration.event_title ||
                                "Event"
                              }
                            </h3>

                          </div>

                        </div>


                        <div className="registration-detail-grid">

                          <div className="registration-info-pill">

                            <CalendarDays
                              size={15}
                            />

                            <div>

                              <span>
                                DATE
                              </span>

                              <strong>
                                {formatDate(
                                  registration.event_date
                                )}
                              </strong>

                            </div>

                          </div>


                          <div className="registration-info-pill">

                            <Clock
                              size={15}
                            />

                            <div>

                              <span>
                                TIME
                              </span>

                              <strong>
                                {formatTime(
                                  registration.event_time
                                )}
                              </strong>

                            </div>

                          </div>


                          <div className="registration-info-pill location-pill">

                            <MapPin
                              size={15}
                            />

                            <div>

                              <span>
                                VENUE
                              </span>

                              <strong>
                                {
                                  registration.event_venue ||
                                  "Venue not available"
                                }
                              </strong>

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* STATUS + ACTIONS */}

                      <div className="registration-status-area">

                        <span
                          className={getStatusClass(
                            registration.status
                          )}
                        >

                          {getStatusIcon(
                            registration.status
                          )}

                          {registration.status ||
                            "Confirmed"}

                        </span>


                        {!cancelled && (

                          <div className="registration-actions">

                            <Link
                              to="/student/tickets"
                              className="ticket-button"
                            >
                              View Ticket
                              <ArrowRight
                                size={14}
                              />
                            </Link>


                            {canCancel && (

                              <button
                                type="button"
                                className="cancel-registration-button"
                                onClick={() =>
                                  openCancelConfirmation(
                                    registration
                                  )
                                }
                                disabled={
                                  isCancelling
                                }
                              >

                                {isCancelling ? (
                                  <>
                                    <Loader2
                                      size={14}
                                      className="button-spinner"
                                    />

                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <XCircle
                                      size={14}
                                    />

                                    Cancel Registration
                                  </>
                                )}

                              </button>

                            )}


                            {!canCancel &&
                              past && (

                                <div className="cancelled-note">

                                  <AlertTriangle
                                    size={14}
                                  />

                                  <span>
                                    Cancellation is
                                    unavailable because
                                    this event has ended.
                                  </span>

                                </div>

                              )}

                          </div>

                        )}


                        {cancelled && (

                          <div className="cancelled-note">

                            <XCircle
                              size={14}
                            />

                            <span>
                              This registration is no
                              longer active.
                            </span>

                          </div>

                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

      </section>


      {/* ===================================================
          BOTTOM CTA
      =================================================== */}

      <section className="registration-bottom">

        <div className="registration-bottom-icon">

          <CalendarDays size={23} />

        </div>

        <div>

          <span className="bottom-label">
            KEEP EXPLORING
          </span>

          <h3>
            Find your next campus experience
          </h3>

          <p>
            Discover workshops, competitions,
            seminars, cultural events and more.
          </p>

        </div>

        <Link to="/events">

          Explore Events

          <ArrowRight size={15} />

        </Link>

      </section>


      {/* ===================================================
          CANCEL MODAL
      =================================================== */}

      {cancelTarget && (

        <div
          className="cancel-modal-backdrop"
          onMouseDown={
            closeCancelConfirmation
          }
        >

          <div
            className="cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-registration-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="cancel-modal-icon">

              <AlertTriangle
                size={25}
              />

            </div>


            <span className="cancel-modal-label">
              CANCEL REGISTRATION
            </span>


            <h3 id="cancel-registration-title">
              Cancel your registration?
            </h3>


            <p>

              You are about to cancel your
              registration for{" "}

              <strong>
                {cancelTarget.event_title ||
                  "this event"}
              </strong>

              . This will mark the registration
              as cancelled.

            </p>


            <div className="cancel-modal-event">

              <CalendarDays
                size={15}
              />

              <span>
                {formatDate(
                  cancelTarget.event_date
                )}
              </span>

              <Clock
                size={15}
              />

              <span>
                {formatTime(
                  cancelTarget.event_time
                )}
              </span>

            </div>


            {/* CANCELLATION ERROR */}

            {cancelError && (

              <div
                className="cancel-modal-error"
                role="alert"
              >

                <AlertTriangle
                  size={17}
                />

                <span>
                  {cancelError}
                </span>

              </div>

            )}


            <div className="cancel-modal-actions">

              <button
                type="button"
                className="keep-registration-button"
                onClick={
                  closeCancelConfirmation
                }
                disabled={
                  Boolean(
                    cancellingId
                  )
                }
              >
                Keep Registration
              </button>


              <button
                type="button"
                className="confirm-cancel-button"
                onClick={
                  cancelRegistration
                }
                disabled={
                  Boolean(
                    cancellingId
                  )
                }
              >

                {cancellingId ? (
                  <>
                    <Loader2
                      size={15}
                      className="button-spinner"
                    />

                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle
                      size={15}
                    />

                    Yes, Cancel
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default MyRegistrations;