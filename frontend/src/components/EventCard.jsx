import React from "react";

import {
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";


const formatDate = (date) => {

  if (!date) {
    return "TBA";
  }

  const parsedDate =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
    }
  );
};


const getDay = (date) => {

  if (!date) {
    return "--";
  }

  const parsedDate =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "--";
  }

  return parsedDate
    .getDate()
    .toString()
    .padStart(2, "0");
};


const getMonth = (date) => {

  if (!date) {
    return "---";
  }

  const parsedDate =
    new Date(`${date}T00:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "---";
  }

  return parsedDate
    .toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    )
    .toUpperCase();
};


const formatTime = (time) => {

  if (!time) {
    return "Time TBA";
  }

  const parts =
    time.split(":");

  if (parts.length < 2) {
    return time;
  }

  const hours =
    Number(parts[0]);

  const minutes =
    Number(parts[1]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const date =
    new Date();

  date.setHours(
    hours,
    minutes,
    0,
    0
  );

  return date.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};


const EventCard = ({
  event,
  index = 0,
  isSaved = false,
  onToggleSave,
}) => {

  if (!event) {
    return null;
  }


  const {
    id,
    title,
    category,
    date,
    time,
    venue,
    location,
    image_url,
    image,
    description,
    capacity,
    attendees,
    registered,
  } = event;


  const eventImage =
    image_url ||
    image ||
    null;


  const eventVenue =
    venue ||
    location ||
    "Venue TBA";


  const registeredCount =
    registered ??
    attendees ??
    0;


  const handleSave = (e) => {

    e.preventDefault();

    e.stopPropagation();

    if (onToggleSave) {
      onToggleSave(id);
    }
  };


  return (

    <article className="event-card">

      {/* ==================================================
          EVENT IMAGE
      ================================================== */}

      <div className="event-image">

        {eventImage ? (

          <img
            src={eventImage}
            alt={title}
            loading="lazy"
          />

        ) : (

          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, #17172b, #6c63ff)",
            }}
          />

        )}


        <div className="image-overlay"></div>


        {/* CATEGORY */}

        <span className="event-category">
          {category || "EVENT"}
        </span>


        {/* EVENT NUMBER */}

        <span className="event-number">

          {String(index + 1)
            .padStart(2, "0")}

        </span>


        {/* DATE */}

        <div className="event-date">

          <strong>
            {getDay(date)}
          </strong>

          <span>
            {getMonth(date)}
          </span>

        </div>


        {/* SAVE BUTTON */}

        <button
          type="button"
          className={
            isSaved
              ? "event-save-btn saved"
              : "event-save-btn"
          }
          onClick={handleSave}
          aria-label={
            isSaved
              ? "Remove saved event"
              : "Save event"
          }
        >

          {isSaved ? (
            <BookmarkCheck size={18} />
          ) : (
            <Bookmark size={18} />
          )}

        </button>

      </div>


      {/* ==================================================
          EVENT INFO
      ================================================== */}

      <div className="event-info">

        <h3>
          {title}
        </h3>


        {description && (

          <p className="event-description">
            {description}
          </p>

        )}


        <div className="event-details">

          <span>
            ◷ {formatTime(time)}
          </span>

          <span>
            ⌖ {eventVenue}
          </span>

        </div>


        <div className="event-extra">

          <span>
            {registeredCount} registered
          </span>

          {capacity > 0 && (

            <span>
              {capacity} seats
            </span>

          )}

        </div>


        <Link
          to={`/event/${id}`}
          className="event-register"
        >

          View Event

          <span>
            ↗
          </span>

        </Link>

      </div>

    </article>

  );
};


export default EventCard;