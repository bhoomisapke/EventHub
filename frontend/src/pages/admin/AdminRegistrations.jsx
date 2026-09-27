// AdminRegistrations.jsx

import React, { useEffect, useState } from "react";
import "./AdminRegistrations.css";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Website notification
  const [notification, setNotification] = useState(null);

  const showNotification = (type, title, message) => {
    setNotification({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/registrations/"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch registrations"
        );
      }

      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);

      showNotification(
        "error",
        "Error",
        "Unable to load registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/registrations/${id}/cancel/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to cancel registration"
        );
      }

      setRegistrations((previous) =>
        previous.map((registration) =>
          registration.id === id
            ? {
                ...registration,
                status: "cancelled",
              }
            : registration
        )
      );

      showNotification(
        "success",
        "Registration Cancelled",
        `Registration #${id} has been cancelled successfully.`
      );
    } catch (error) {
      console.error("Error cancelling registration:", error);

      showNotification(
        "error",
        "Cancellation Failed",
        error.message || "Unable to cancel registration."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(
    (registration) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        registration.student?.toLowerCase().includes(search) ||
        registration.email?.toLowerCase().includes(search) ||
        registration.event?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        registration.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    }
  );

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="admin-registrations-page">
        <div className="admin-registrations-loading">
          Loading registrations...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-registrations-page">

      {/* WEBSITE TOAST NOTIFICATION */}
      {notification && (
        <div
          className={`admin-website-notification ${
            notification.type === "success"
              ? "notification-success"
              : "notification-error"
          }`}
        >
          <div className="notification-icon">
            {notification.type === "success" ? "✓" : "!"}
          </div>

          <div className="notification-content">
            <strong>{notification.title}</strong>
            <span>{notification.message}</span>
          </div>

          <button
            type="button"
            className="notification-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <span className="admin-page-label">
            ADMIN PANEL
          </span>

          <h1>Registrations</h1>

          <p>
            Manage event registrations and participant activity.
          </p>
        </div>

        <div className="admin-registration-count">
          <strong>{registrations.length}</strong>
          <span>Total Registrations</span>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="admin-registration-toolbar">
        <div className="admin-registration-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search student, email or event..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <select
          className="admin-registration-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* REGISTRATIONS CARD */}
      <div className="admin-registrations-card">
        <div className="admin-registrations-card-header">
          <div>
            <h2>All Registrations</h2>

            <p>
              {filteredRegistrations.length} registration
              {filteredRegistrations.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {filteredRegistrations.length === 0 ? (
          <div className="admin-registrations-empty">
            <div className="empty-icon">📋</div>

            <h3>No registrations found</h3>

            <p>
              There are no registrations matching your search or
              filter.
            </p>
          </div>
        ) : (
          <div className="admin-registrations-table-wrapper">
            <table className="admin-registrations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Event</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRegistrations.map((registration) => (
                  <tr key={registration.id}>
                    <td>
                      <span className="registration-id">
                        #{registration.id}
                      </span>
                    </td>

                    <td>
                      <div className="registration-student">
                        <div className="student-avatar">
                          {registration.student
                            ?.charAt(0)
                            ?.toUpperCase() || "S"}
                        </div>

                        <strong>
                          {registration.student ||
                            "Unknown Student"}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <span className="registration-email">
                        {registration.email || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="registration-event">
                        {registration.event || "Unknown Event"}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        registration.registration_date
                      )}
                    </td>

                    <td>
                      <span
                        className={`registration-status ${
                          registration.status?.toLowerCase() ===
                          "confirmed"
                            ? "status-confirmed"
                            : "status-cancelled"
                        }`}
                      >
                        {registration.status
                          ? registration.status
                              .charAt(0)
                              .toUpperCase() +
                            registration.status.slice(1)
                          : "Unknown"}
                      </span>
                    </td>

                    <td>
                      {registration.status?.toLowerCase() ===
                      "confirmed" ? (
                        <button
                          type="button"
                          className="registration-cancel-btn"
                          onClick={() =>
                            handleCancel(registration.id)
                          }
                          disabled={
                            cancellingId === registration.id
                          }
                        >
                          {cancellingId === registration.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      ) : (
                        <span className="registration-cancelled-text">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRegistrations;