import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserRound,
  LogOut,
} from "lucide-react";
import "./OrganizerLayout.css";

function OrganizerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  return (
    <div className="organizer-layout">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <header className="navbar">

        {/* BRAND LOGO */}

        <Link
          to="/organizer/dashboard"
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


        {/* NAVIGATION */}

        <nav className="nav-menu">

          <Link
            to="/organizer/dashboard"
            className={
              location.pathname === "/organizer/dashboard"
                ? "organizer-active"
                : ""
            }
          >
            Dashboard
          </Link>

          <Link
            to="/organizer/events"
            className={
              location.pathname === "/organizer/events"
                ? "organizer-active"
                : ""
            }
          >
            My Events
          </Link>

          <Link
            to="/organizer/participants"
            className={
              location.pathname === "/organizer/participants"
                ? "organizer-active"
                : ""
            }
          >
            Participants
          </Link>

        </nav>


        {/* RIGHT SIDE BUTTONS */}

        <div className="nav-buttons">

          {/* PROFILE */}

          <Link
            to="/organizer/dashboard"
            className="login-button organizer-profile-button"
            aria-label="Profile"
            title="Profile"
          >
            <UserRound size={19} strokeWidth={2} />
          </Link>


          {/* LOGOUT */}

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="register-button organizer-logout-button"
          >
            <LogOut size={19} strokeWidth={2} />
          </button>

        </div>

      </header>


      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <main className="organizer-layout-content">
        <Outlet />
      </main>

    </div>
  );
}

export default OrganizerLayout;