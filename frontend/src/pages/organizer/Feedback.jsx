import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
  CalendarDays,
  UserRound,
  Mail,
  Clock3,
  RefreshCw,
} from "lucide-react";

import "./Feedback.css";

const API_URL = "http://127.0.0.1:8000/api/feedback/organizer/";

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const fetchFeedback = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("Organizer authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail ||
            data.message ||
            "Failed to load feedback."
        );
      }

      const data = await response.json();

      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Feedback fetch error:", err);
      setError(err.message || "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStudentName = (feedback) => {
    if (feedback.student_name) {
      return feedback.student_name;
    }

    if (feedback.studentName) {
      return feedback.studentName;
    }

    if (feedback.student_email) {
      return feedback.student_email;
    }

    if (feedback.studentEmail) {
      return feedback.studentEmail;
    }

    return `Student #${feedback.student || "Unknown"}`;
  };

  const getStudentEmail = (feedback) => {
    return (
      feedback.student_email ||
      feedback.studentEmail ||
      "Email not available"
    );
  };

  const getEventTitle = (feedback) => {
    return (
      feedback.event_title ||
      feedback.eventTitle ||
      `Event #${feedback.event || "Unknown"}`
    );
  };

  const getFeedbackText = (feedback) => {
    return (
      feedback.feedback_text ||
      feedback.feedbackText ||
      "No written feedback provided."
    );
  };

  const getLikedThings = (feedback) => {
    if (Array.isArray(feedback.liked_things)) {
      return feedback.liked_things;
    }

    if (Array.isArray(feedback.likedThings)) {
      return feedback.likedThings;
    }

    return [];
  };

  const renderStars = (rating) => {
    const value = Number(rating) || 0;

    return (
      <div className="feedback-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={17}
            strokeWidth={2}
            fill={star <= value ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="feedback-page">

      <div className="feedback-glow feedback-glow-one" />
      <div className="feedback-glow feedback-glow-two" />

      <div className="feedback-container">

        {/* TOP SECTION */}
        <div className="feedback-top">

          <div className="feedback-heading">

            <div className="feedback-label">
              <MessageSquare size={14} />
              ORGANIZER FEEDBACK
            </div>

            <h1>
              Student <span>Feedback</span>
            </h1>

            <p>
              View feedback submitted by students for your events.
            </p>

          </div>

          <button
            type="button"
            className="feedback-refresh-button"
            onClick={fetchFeedback}
            disabled={loading}
          >
            <RefreshCw
              size={15}
              className={loading ? "feedback-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* SUMMARY */}
        <div className="feedback-summary">

          <div className="feedback-summary-icon">
            <MessageSquare size={19} />
          </div>

          <div>
            <strong>{feedbacks.length}</strong>
            <span>
              {feedbacks.length === 1
                ? "Feedback received"
                : "Feedback received"}
            </span>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="feedback-state">

            <div className="feedback-loading-icon">
              <RefreshCw size={28} className="feedback-spin" />
            </div>

            <h2>Loading feedback</h2>

            <p>
              Fetching the latest student feedback...
            </p>

          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="feedback-state feedback-error-state">

            <div className="feedback-error-icon">
              <MessageSquare size={28} />
            </div>

            <h2>Unable to load feedback</h2>

            <p>{error}</p>

            <button
              type="button"
              className="feedback-retry-button"
              onClick={fetchFeedback}
            >
              <RefreshCw size={15} />
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && feedbacks.length === 0 && (
          <div className="feedback-state">

            <div className="feedback-empty-icon">
              <MessageSquare size={30} />
            </div>

            <span className="feedback-empty-label">
              NO FEEDBACK YET
            </span>

            <h2>No student feedback yet</h2>

            <p>
              Feedback submitted for your events will appear here.
            </p>

          </div>
        )}

        {/* FEEDBACK LIST */}
        {!loading && !error && feedbacks.length > 0 && (
          <div className="feedback-list">

            {feedbacks.map((feedback) => {

              const likedThings = getLikedThings(feedback);

              return (
                <article
                  className="feedback-card"
                  key={feedback.id}
                >

                  {/* CARD TOP */}
                  <div className="feedback-card-top">

                    <div className="feedback-student">

                      <div className="feedback-student-avatar">
                        <UserRound size={19} />
                      </div>

                      <div className="feedback-student-details">

                        <h2>
                          {getStudentName(feedback)}
                        </h2>

                        <div className="feedback-email">
                          <Mail size={12} />
                          {getStudentEmail(feedback)}
                        </div>

                      </div>

                    </div>

                    <div className="feedback-rating">
                      {renderStars(feedback.rating)}

                      <strong>
                        {feedback.rating}/5
                      </strong>
                    </div>

                  </div>

                  {/* EVENT */}
                  <div className="feedback-event">

                    <div className="feedback-event-icon">
                      <CalendarDays size={16} />
                    </div>

                    <div>
                      <small>EVENT</small>
                      <strong>
                        {getEventTitle(feedback)}
                      </strong>
                    </div>

                  </div>

                  {/* MESSAGE */}
                  <div className="feedback-message">

                    <span>STUDENT MESSAGE</span>

                    <p>
                      {getFeedbackText(feedback)}
                    </p>

                  </div>

                  {/* LIKED THINGS */}
                  {likedThings.length > 0 && (
                    <div className="feedback-liked-section">

                      <span>WHAT THEY LIKED</span>

                      <div className="feedback-tags">

                        {likedThings.map((item, index) => (
                          <span
                            className="feedback-tag"
                            key={`${item}-${index}`}
                          >
                            {item}
                          </span>
                        ))}

                      </div>

                    </div>
                  )}

                  {/* DATE */}
                  <div className="feedback-card-footer">

                    <div className="feedback-date">
                      <Clock3 size={13} />
                      Submitted {formatDate(feedback.created_at)}
                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

    </section>
  );
}

export default Feedback;