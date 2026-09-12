import React, { useEffect, useState } from "react";
import {
  UserRound,
  GraduationCap,
  Building2,
  CalendarDays,
  Pencil,
  Ticket,
  ClipboardList,
  ShieldCheck,
  X,
  Save,
} from "lucide-react";

import "./Profile.css";

const API_URL = "http://127.0.0.1:8000";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    student_id: "",
    department: "",
    year: "",
  });

  const [editForm, setEditForm] = useState(profile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= GET PROFILE =================

  useEffect(() => {
    fetchProfile();
  }, []);

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  };

  const fetchProfile = async () => {
    const token = getToken();

    if (!token) {
      setError("Please login to view your profile.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        setError("Your session has expired. Please login again.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load profile.");
      }

      const data = await response.json();

      setProfile(data);
      setEditForm(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SAVE PROFILE =================

  const handleSave = async () => {
    const token = getToken();

    if (!token) {
      setError("Please login again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name,
            phone: editForm.phone,
            student_id: editForm.student_id,
            department: editForm.department,
            year: editForm.year,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to update profile."
        );
      }

      // Backend returns:
      // {
      //   message: "...",
      //   user: {...}
      // }

      const updatedUser = data.user;

      setProfile(updatedUser);
      setEditForm(updatedUser);
      setIsEditing(false);

      // Keep stored user information updated too
      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;

      storage.setItem("user", JSON.stringify(updatedUser));

    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
    setError("");
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-heading">
          <div>
            <span className="profile-label">
              STUDENT ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-heading">

        <div>
          <span className="profile-label">
            STUDENT ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and EventHub account.
          </p>
        </div>

        <button
          className="edit-profile-btn"
          onClick={handleEdit}
        >
          <Pencil size={15} />
          Edit Profile
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#FEE2E2",
            color: "#991B1B",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}


      {/* PROFILE HERO */}

      <div className="profile-hero">

        <div className="profile-avatar">
          <UserRound size={42} />
        </div>

        <div className="profile-main-info">

          <span>EVENTHUB STUDENT</span>

          <h2>
            {profile.name || "Student"}
          </h2>

          <p>
            {profile.email || "Email not available"}
          </p>

        </div>

        <div className="profile-status">
          <ShieldCheck size={15} />
          Active Student
        </div>

      </div>


      {/* CONTENT GRID */}

      <div className="profile-grid">

        {/* PERSONAL INFORMATION */}

        <div className="profile-card">

          <div className="card-heading">

            <div className="card-icon">
              <UserRound size={18} />
            </div>

            <div>
              <span>ACCOUNT DETAILS</span>
              <h3>Personal Information</h3>
            </div>

          </div>


          <div className="info-grid">

            <div className="info-item">
              <span>FULL NAME</span>
              <strong>
                {profile.name || "Not Added"}
              </strong>
            </div>

            <div className="info-item">
              <span>EMAIL ADDRESS</span>
              <strong>
                {profile.email || "Not Added"}
              </strong>
            </div>

            <div className="info-item">
              <span>PHONE NUMBER</span>
              <strong>
                {profile.phone || "Not Added"}
              </strong>
            </div>

            <div className="info-item">
              <span>STUDENT ID</span>
              <strong>
                {profile.student_id || "Not Added"}
              </strong>
            </div>

          </div>

        </div>


        {/* EDUCATION */}

        <div className="profile-card">

          <div className="card-heading">

            <div className="card-icon">
              <GraduationCap size={18} />
            </div>

            <div>
              <span>ACADEMIC DETAILS</span>
              <h3>Education</h3>
            </div>

          </div>


          <div className="education-info">

            <div className="education-row">

              <Building2 size={17} />

              <div>
                <span>DEPARTMENT</span>

                <strong>
                  {profile.department || "Not Added"}
                </strong>
              </div>

            </div>


            <div className="education-row">

              <GraduationCap size={17} />

              <div>
                <span>STUDENT ID</span>

                <strong>
                  {profile.student_id || "Not Added"}
                </strong>
              </div>

            </div>


            <div className="education-row">

              <CalendarDays size={17} />

              <div>
                <span>YEAR</span>

                <strong>
                  {profile.year || "Not Added"}
                </strong>
              </div>

            </div>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="profile-card profile-stat-card">

          <div className="card-heading">

            <div className="card-icon">
              <Ticket size={18} />
            </div>

            <div>
              <span>EVENT ACTIVITY</span>
              <h3>My Activity</h3>
            </div>

          </div>


          <div className="profile-stats">

            <div className="profile-stat">
              <strong>24</strong>
              <span>Upcoming Events</span>
            </div>

            <div className="profile-stat">
              <strong>03</strong>
              <span>Registrations</span>
            </div>

            <div className="profile-stat">
              <strong>03</strong>
              <span>Tickets</span>
            </div>

          </div>

        </div>


        {/* QUICK ACCESS */}

        <div className="profile-card">

          <div className="card-heading">

            <div className="card-icon">
              <ClipboardList size={18} />
            </div>

            <div>
              <span>QUICK ACCESS</span>
              <h3>EventHub Activity</h3>
            </div>

          </div>


          <div className="quick-links">

            <a href="/student/registrations">
              <ClipboardList size={17} />

              <div>
                <strong>My Registrations</strong>
                <span>
                  View your registered events
                </span>
              </div>
            </a>


            <a href="/student/tickets">
              <Ticket size={17} />

              <div>
                <strong>My Tickets</strong>
                <span>
                  View your event passes
                </span>
              </div>
            </a>

          </div>

        </div>

      </div>


      {/* EDIT PROFILE MODAL */}

      {isEditing && (

        <div className="edit-profile-overlay">

          <div className="edit-profile-modal">

            <div className="edit-modal-header">

              <div>
                <span>ACCOUNT SETTINGS</span>

                <h2>Edit Profile</h2>

                <p>
                  Update your personal information.
                </p>
              </div>

              <button
                className="close-edit-btn"
                onClick={handleCancel}
              >
                <X size={20} />
              </button>

            </div>


            <div className="edit-profile-form">

              {/* FULL NAME */}

              <div className="edit-form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name || ""}
                  onChange={handleChange}
                />

              </div>


              {/* EMAIL */}

              <div className="edit-form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  disabled
                />

              </div>


              {/* PHONE */}

              <div className="edit-form-group">

                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={editForm.phone || ""}
                  onChange={handleChange}
                />

              </div>


              {/* STUDENT ID */}

              <div className="edit-form-group">

                <label>Student ID</label>

                <input
                  type="text"
                  name="student_id"
                  value={editForm.student_id || ""}
                  onChange={handleChange}
                />

              </div>


              {/* DEPARTMENT */}

              <div className="edit-form-group">

                <label>Department</label>

                <input
                  type="text"
                  name="department"
                  value={editForm.department || ""}
                  onChange={handleChange}
                />

              </div>


              {/* YEAR */}

              <div className="edit-form-group">

                <label>Year</label>

                <input
                  type="text"
                  name="year"
                  value={editForm.year || ""}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="edit-modal-actions">

              <button
                className="edit-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="edit-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Changes"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;