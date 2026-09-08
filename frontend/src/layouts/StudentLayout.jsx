import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Bookmark,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import "./StudentLayout.css";
const StudentLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Events",
      path: "/events",
      icon: CalendarDays,
    },
    {
      name: "My Registrations",
      path: "/student/registrations",
      icon: Ticket,
    },
    {
      name: "My Tickets",
      path: "/student/tickets",
      icon: Ticket,
    },
    {
      name: "Saved Events",
      path: "/student/saved",
      icon: Bookmark,
    },
  ];

  return (
    <div className="student-layout">

      {/* ================= TOP NAVBAR ================= */}
      <header className="student-navbar">

        {/* Logo */}
        <Link to="/student/dashboard" className="student-brand">

          <div className="student-brand-symbol">
            ✦
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


        {/* Desktop Navigation */}
        <nav className="student-nav">

          {navItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `student-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </NavLink>
            );

          })}

        </nav>


        {/* Right Side */}
        <div className="student-nav-right">

          <Link
            to="/student/profile"
            className="student-profile"
          >
            <div className="student-avatar">
              <UserRound size={17} />
            </div>

            <div className="student-profile-text">
              <strong>Student</strong>
              <small>My Profile</small>
            </div>
          </Link>


          <button
            className="student-logout"
            title="Logout"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <LogOut size={17} />
          </button>


          {/* Mobile menu button */}
          <button
            className="student-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

        </div>

      </header>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (

        <div className="student-mobile-menu">

          {navItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `student-mobile-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={17} />
                {item.name}
              </NavLink>
            );

          })}


          <NavLink
            to="/student/profile"
            onClick={() => setMenuOpen(false)}
            className="student-mobile-link"
          >
            <UserRound size={17} />
            Profile
          </NavLink>


          <button
            className="student-mobile-logout"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      )}


      {/* ================= PAGE CONTENT ================= */}

      <main className="student-main">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentLayout;