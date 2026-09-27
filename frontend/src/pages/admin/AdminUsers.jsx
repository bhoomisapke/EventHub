import React, { useEffect, useState } from "react";
import {
  Search,
  UserRound,
  ShieldCheck,
  MoreVertical,
  UserX,
  UserCheck,
  X,
} from "lucide-react";

import "./AdminUsers.css";

function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Website notification
  const [notification, setNotification] = useState(null);

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState(null);

  // User action loading
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // WEBSITE NOTIFICATION
  // ==========================================

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

  // ==========================================
  // GET REAL USERS FROM DATABASE
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/users/"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load users (${response.status})`
        );
      }

      const data = await response.json();

      console.log("Real users from database:", data);

      setUsers(data.users || []);
      setError("");
    } catch (err) {
      console.error("Users API error:", err);

      setError("Unable to load users from database.");

      showNotification(
        "error",
        "Unable to Load Users",
        "Users could not be loaded from the database."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OPEN CONFIRMATION MODAL
  // ==========================================

  const openUserActionModal = (user) => {
    const isActive = user.status === "Active";

    setConfirmModal({
      user,
      action: isActive ? "deactivate" : "activate",
    });
  };

  // ==========================================
  // CLOSE CONFIRMATION MODAL
  // ==========================================

  const closeConfirmModal = () => {
    if (actionLoading !== null) return;

    setConfirmModal(null);
  };

  // ==========================================
  // ACTIVATE / DEACTIVATE USER
  // ==========================================

  const handleUserAction = async () => {
    if (!confirmModal) return;

    const { user, action } = confirmModal;

    try {
      setActionLoading(user.id);

      // Backend uses ONE status endpoint
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${user.id}/status/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: action === "activate",
          }),
        }
      );

      // Safely handle JSON / HTML response
      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          `Server returned ${response.status} instead of JSON. ${text.slice(
            0,
            150
          )}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Failed to ${action} user`
        );
      }

      // Update user status immediately in UI
      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status:
                  action === "activate"
                    ? "Active"
                    : "Inactive",
              }
            : currentUser
        )
      );

      // Close confirmation modal
      setConfirmModal(null);

      // Success notification
      if (action === "deactivate") {
        showNotification(
          "success",
          "User Deactivated",
          `${user.name || "User"} has been deactivated successfully.`
        );
      } else {
        showNotification(
          "success",
          "User Activated",
          `${user.name || "User"} has been activated successfully.`
        );
      }
    } catch (err) {
      console.error(
        `Error trying to ${action} user:`,
        err
      );

      showNotification(
        "error",
        "Action Failed",
        err.message ||
          `Unable to ${action} user.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      (user.name || "")
        .toLowerCase()
        .includes(value) ||
      (user.email || "")
        .toLowerCase()
        .includes(value) ||
      (user.role || "")
        .toLowerCase()
        .includes(value)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-users-page">
        <div className="admin-dashboard-loading">
          Loading users...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-users-page">
        <div className="admin-dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="admin-users-page">

      {/* ==========================================
          WEBSITE TOAST NOTIFICATION
      ========================================== */}

      {notification && (
        <div
          className={`admin-user-notification ${
            notification.type === "success"
              ? "user-notification-success"
              : "user-notification-error"
          }`}
        >
          <div className="user-notification-icon">
            {notification.type === "success"
              ? "✓"
              : "!"}
          </div>

          <div className="user-notification-content">
            <strong>
              {notification.title}
            </strong>

            <span>
              {notification.message}
            </span>
          </div>

          <button
            type="button"
            className="user-notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* ==========================================
          CONFIRMATION MODAL
      ========================================== */}

      {confirmModal && (
        <div className="admin-user-modal-overlay">

          <div className="admin-user-confirm-modal">

            <button
              type="button"
              className="admin-user-modal-close"
              onClick={closeConfirmModal}
              disabled={actionLoading !== null}
            >
              <X size={20} />
            </button>

            <div
              className={`admin-user-modal-icon ${
                confirmModal.action === "deactivate"
                  ? "modal-icon-danger"
                  : "modal-icon-success"
              }`}
            >
              {confirmModal.action === "deactivate" ? (
                <UserX size={25} />
              ) : (
                <UserCheck size={25} />
              )}
            </div>

            <h2>
              {confirmModal.action === "deactivate"
                ? "Deactivate User?"
                : "Activate User?"}
            </h2>

            <p>
              {confirmModal.action === "deactivate"
                ? `Are you sure you want to deactivate ${
                    confirmModal.user.name ||
                    "this user"
                  }? They will not be able to log in until their account is activated again.`
                : `Are you sure you want to activate ${
                    confirmModal.user.name ||
                    "this user"
                  }? They will be able to log in again.`}
            </p>

            <div className="admin-user-modal-actions">

              <button
                type="button"
                className="admin-user-modal-cancel"
                onClick={closeConfirmModal}
                disabled={actionLoading !== null}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  confirmModal.action === "deactivate"
                    ? "admin-user-modal-danger"
                    : "admin-user-modal-success"
                }
                onClick={handleUserAction}
                disabled={actionLoading !== null}
              >
                {actionLoading === confirmModal.user.id
                  ? "Processing..."
                  : confirmModal.action === "deactivate"
                  ? "Deactivate"
                  : "Activate"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="admin-users-header">

        <div>

          <span className="admin-page-label">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            View and manage students and organizers
            registered on EventHub.
          </p>

        </div>

        <div className="admin-user-count">

          <UserRound size={18} />

          <span>
            {users.length} Users
          </span>

        </div>

      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <div className="admin-users-toolbar">

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* ==========================================
          USERS TABLE
      ========================================== */}

      <div className="admin-users-table-card">

        <div className="admin-table-wrapper">

          <table className="admin-users-table">

            <thead>

              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Account</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user) => {

                  const isOrganizer =
                    user.role === "organizer";

                  const isActive =
                    user.status === "Active";

                  return (
                    <tr key={user.id}>

                      {/* USER */}

                      <td>

                        <div className="admin-user-info">

                          <div className="admin-user-avatar">

                            {(user.name || "U")
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {user.name ||
                                "Unnamed User"}
                            </strong>

                            <span>
                              {user.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td>

                        <span
                          className={`admin-role-badge ${
                            isOrganizer
                              ? "organizer-role"
                              : "student-role"
                          }`}
                        >

                          {isOrganizer ? (
                            <ShieldCheck size={14} />
                          ) : (
                            <UserRound size={14} />
                          )}

                          {isOrganizer
                            ? "Organizer"
                            : "Student"}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status-badge ${
                            isActive
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >

                          <span className="status-dot"></span>

                          {user.status}

                        </span>

                      </td>

                      {/* ACCOUNT */}

                      <td>

                        <span className="admin-account-text">
                          Registered
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="admin-user-actions">

                          <button
                            type="button"
                            title={
                              isActive
                                ? "Deactivate user"
                                : "Activate user"
                            }
                            className={
                              isActive
                                ? "admin-action-danger"
                                : "admin-action-success"
                            }
                            onClick={() =>
                              openUserActionModal(user)
                            }
                            disabled={
                              actionLoading === user.id
                            }
                          >

                            {isActive ? (
                              <UserX size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}

                          </button>

                          <button
                            type="button"
                            className="admin-action-more"
                            title="More options"
                          >
                            <MoreVertical size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="admin-no-users"
                  >
                    {search
                      ? "No users found for your search."
                      : "No users found in the database."}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;