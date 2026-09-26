import React, { useEffect, useState } from "react";
import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  UserRound,
  LogOut,
} from "lucide-react";

import "./StudentLayout.css";

const API_URL = "http://127.0.0.1:8000";

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    name: "Student",
    email: "",
  });

  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) return;

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

      if (!response.ok) return;

      const data = await response.json();

      setUser(data);

      const storage = localStorage.getItem("token")
        ? localStorage
        : sessionStorage;

      storage.setItem("user", JSON.stringify(data));

    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  // ==================================================
  // REFRESH PROFILE
  // ==================================================

  useEffect(() => {
    const updateProfile = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) return;

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          setUser(data);

          const storage = localStorage.getItem("token")
            ? localStorage
            : sessionStorage;

          storage.setItem(
            "user",
            JSON.stringify(data)
          );
        }
      } catch (error) {
        console.error(
          "Failed to refresh profile:",
          error
        );
      }
    };

    window.addEventListener(
      "profileUpdated",
      updateProfile
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        updateProfile
      );
    };
  }, []);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    try {
      if (token) {
        await fetch(
          `${API_URL}/api/auth/logout/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      navigate("/");
    }
  };

  // ==================================================
  // ACTIVE LINK
  // ==================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="student-layout">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="navbar">

        {/* BRAND LOGO */}

        <Link
          to="/student/dashboard"
          className="brand"
        >
          <div className="brand-symbol">
            <span>✦</span>
          </div>

          <div>
            <strong>
              Event<span>Hub</span>
            </strong>

            <small>
              COLLEGE EVENTS
            </small>
          </div>
        </Link>


        {/* ==================================================
            NAVIGATION
            Same structure as OrganizerLayout
            ================================================== */}

        <nav className="nav-menu">

          {/* DASHBOARD */}

          <Link
            to="/student/dashboard"
            className={
              isActive("/student/dashboard")
                ? "student-active"
                : ""
            }
          >
            Dashboard
          </Link>


          {/* EVENTS */}

          <Link
            to="/events"
            className={
              isActive("/events")
                ? "student-active"
                : ""
            }
          >
            Events
          </Link>


          {/* MY REGISTRATIONS */}

          <Link
            to="/student/registrations"
            className={
              isActive("/student/registrations")
                ? "student-active"
                : ""
            }
          >
            My Registrations
          </Link>


          {/* MY TICKETS */}

          <Link
            to="/student/tickets"
            className={
              isActive("/student/tickets")
                ? "student-active"
                : ""
            }
          >
            My Tickets
          </Link>


          {/* MY CERTIFICATES */}

          <Link
            to="/student/certificates"
            className={
              isActive("/student/certificates")
                ? "student-active"
                : ""
            }
          >
            My Certificates
          </Link>


          {/* HOME */}

          <Link
            to="/"
            className="student-home-button"
          >
            Home
          </Link>

        </nav>


        {/* ==================================================
            RIGHT SIDE BUTTONS
            ================================================== */}

        <div className="nav-buttons">

          {/* PROFILE */}

          <Link
            to="/student/profile"
            className="login-button student-profile-button"
            aria-label="Profile"
            title={
              user.name
                ? `${user.name}'s Profile`
                : "Profile"
            }
          >
            <UserRound
              size={19}
              strokeWidth={2}
            />
          </Link>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="register-button student-logout-button"
          >
            <LogOut
              size={19}
              strokeWidth={2}
            />
          </button>

        </div>

      </header>


      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <main className="student-layout-content">
        <Outlet />
      </main>

    </div>
  );
}

export default StudentLayout;