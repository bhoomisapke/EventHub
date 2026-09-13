import React, { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CalendarDays,
  Pencil,
  Save,
  X,
} from "lucide-react";

import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "EventHub",
    role: "Organizer",
  });

  const [editProfile, setEditProfile] = useState(profile);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        const loadedProfile = {
          name:
            user.name ||
            user.full_name ||
            user.username ||
            "",
          email: user.email || "",
          phone:
            user.phone ||
            user.mobile ||
            user.contact ||
            "",
          organization:
            user.organization ||
            user.college ||
            "EventHub",
          role: user.role || "organizer",
        };

        setProfile(loadedProfile);
        setEditProfile(loadedProfile);
      } catch (error) {
        console.error(
          "Unable to load organizer profile:",
          error
        );
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      ...editProfile,
    };

    setProfile(updatedProfile);

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        const updatedUser = {
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          organization:
            updatedProfile.organization,
          role: updatedProfile.role,
        };

        if (localStorage.getItem("user")) {
          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        }

        if (sessionStorage.getItem("user")) {
          sessionStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );
        }
      } catch (error) {
        console.error(
          "Unable to save organizer profile:",
          error
        );
      }
    }

    setIsEditing(false);
  };

  const displayName =
    profile.name || "Event Organizer";

  const firstLetter =
    displayName.charAt(0).toUpperCase() || "O";

  return (
    <main className="organizer-profile-page">

      {/* ================================================
          PROFILE HEADER
      ================================================= */}

      <section className="profile-hero">

        <div className="profile-hero-glow glow-one"></div>
        <div className="profile-hero-glow glow-two"></div>

        <div className="profile-hero-content">

          <div>
            <span className="profile-label">
              ORGANIZER PROFILE
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your organizer information
              and EventHub account details.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              className="profile-edit-button"
              onClick={handleEdit}
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="profile-action-buttons">

              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
              >
                <Save size={17} />
                Save Changes
              </button>

            </div>
          )}

        </div>
      </section>

      {/* ================================================
          PROFILE CONTENT
      ================================================= */}

      <section className="profile-content">

        {/* ==============================================
            PROFILE CARD
        ============================================== */}

        <div className="profile-main-card">

          <div className="profile-card-top">

            <div className="profile-avatar">
              {firstLetter}
            </div>

            <div className="profile-identity">

              <span className="profile-role">
                ORGANIZER
              </span>

              <h2>
                {displayName}
              </h2>

              <p>
                {profile.email ||
                  "Organizer account"}
              </p>

            </div>

            <div className="verified-badge">
              <ShieldCheck size={17} />
              Verified
            </div>

          </div>

          <div className="profile-divider"></div>

          {/* ==========================================
              PERSONAL INFORMATION
          ========================================== */}

          <div className="profile-section-heading">

            <div>
              <span>
                ACCOUNT INFORMATION
              </span>

              <h3>
                Personal Details
              </h3>
            </div>

          </div>

          <div className="profile-fields">

            {/* Name */}

            <div className="profile-field">

              <label>
                Full Name
              </label>

              {isEditing ? (
                <div className="profile-input-wrapper">
                  <UserRound size={18} />

                  <input
                    type="text"
                    name="name"
                    value={editProfile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
              ) : (
                <div className="profile-value">
                  <UserRound size={18} />

                  <span>
                    {profile.name ||
                      "Not provided"}
                  </span>
                </div>
              )}

            </div>

            {/* Email */}

            <div className="profile-field">

              <label>
                Email Address
              </label>

              {isEditing ? (
                <div className="profile-input-wrapper">
                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    value={editProfile.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                </div>
              ) : (
                <div className="profile-value">
                  <Mail size={18} />

                  <span>
                    {profile.email ||
                      "Not provided"}
                  </span>
                </div>
              )}

            </div>

            {/* Phone */}

            <div className="profile-field">

              <label>
                Phone Number
              </label>

              {isEditing ? (
                <div className="profile-input-wrapper">
                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phone"
                    value={editProfile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              ) : (
                <div className="profile-value">
                  <Phone size={18} />

                  <span>
                    {profile.phone ||
                      "Not provided"}
                  </span>
                </div>
              )}

            </div>

            {/* Organization */}

            <div className="profile-field">

              <label>
                Organization / College
              </label>

              {isEditing ? (
                <div className="profile-input-wrapper">
                  <Building2 size={18} />

                  <input
                    type="text"
                    name="organization"
                    value={
                      editProfile.organization
                    }
                    onChange={handleChange}
                    placeholder="Enter organization"
                  />
                </div>
              ) : (
                <div className="profile-value">
                  <Building2 size={18} />

                  <span>
                    {profile.organization ||
                      "Not provided"}
                  </span>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ==============================================
            SIDE INFORMATION
        ============================================== */}

        <aside className="profile-side-column">

          {/* Account Status */}

          <div className="profile-info-card">

            <div className="info-card-icon">
              <ShieldCheck size={21} />
            </div>

            <span className="info-card-label">
              ACCOUNT STATUS
            </span>

            <h3>
              Active Organizer
            </h3>

            <p>
              Your organizer account is ready
              to create and manage events.
            </p>

            <div className="status-line">
              <span></span>
              Account active
            </div>

          </div>

          {/* Organizer Role */}

          <div className="profile-info-card role-card">

            <div className="info-card-icon">
              <CalendarDays size={21} />
            </div>

            <span className="info-card-label">
              EVENTHUB ROLE
            </span>

            <h3>
              Event Organizer
            </h3>

            <p>
              Create events, manage participants
              and track your event activities.
            </p>

          </div>

        </aside>

      </section>

    </main>
  );
};

export default Profile;