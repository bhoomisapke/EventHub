import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";
import "./OrganizerLayout.css";

function OrganizerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="organizer-layout">

      {/* ================= NAVBAR ================= */}

      <nav className="organizer-main-navbar">

        {/* Brand Logo */}

        <Link
          to="/organizer/dashboard"
          className="organizer-main-logo"
        >
          <div className="organizer-logo-icon">
            <Calendar size={20} />
          </div>

          <span>CampusSphere</span>
        </Link>


        {/* Navigation Links */}

        <div className="organizer-main-navigation">

          <Link
            to="/organizer/dashboard"
            className={`organizer-main-nav-link ${
              isActive("/organizer/dashboard") ? "active" : ""
            }`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </Link>


          <Link
            to="/organizer/events"
            className={`organizer-main-nav-link ${
              isActive("/organizer/events") ? "active" : ""
            }`}
          >
            <Calendar size={17} />
            <span>My Events</span>
          </Link>


          <Link
            to="/organizer/participants"
            className={`organizer-main-nav-link ${
              isActive("/organizer/participants") ? "active" : ""
            }`}
          >
            <Users size={17} />
            <span>Participants</span>
          </Link>

        </div>


        {/* Right Side */}

        <div className="organizer-main-right">

          <Link
            to="/organizer/dashboard"
            className="organizer-profile-button"
            title="Organizer Profile"
          >
            Organizer
          </Link>


          <button
            type="button"
            className="organizer-main-logout"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>

        </div>

      </nav>


      {/* ================= PAGE CONTENT ================= */}

      <main className="organizer-layout-content">
        <Outlet />
      </main>

    </div>
  );
}

export default OrganizerLayout;