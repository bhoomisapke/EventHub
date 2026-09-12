import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../App.jsx";
import Auth from "../pages/auth/Auth.jsx";

// Layouts
import StudentLayout from "../layouts/StudentLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import OrganizerLayout from "../layouts/OrganizerLayout.jsx";

// Student Pages
import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
import Profile from "../pages/student/Profile.jsx";

// Public Pages
import Categories from "../pages/public/Categories.jsx";
import EventDetails from "../pages/public/EventDetails.jsx";
import Events from "../pages/public/Events.jsx";

// Organizer Pages
import OrganizerDashboard from "../pages/organizer/Dashboard.jsx";
import OrganizerEventDetails from "../pages/organizer/OrganizerEventDetails.jsx";
import CreateEvent from "../pages/organizer/CreateEvent.jsx";
import MyEvents from "../pages/organizer/MyEvents.jsx";
import EditEvent from "../pages/organizer/EditEvent.jsx";
import Participants from "../pages/organizer/Participants.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          LANDING PAGE
          ===================================================== */}
      <Route path="/" element={<App />} />

      {/* =====================================================
          AUTHENTICATION
          ===================================================== */}
      <Route path="/auth" element={<Auth />} />

      <Route
  path="/reset-password/:uid/:token"
  element={<ResetPassword />}
/>

      {/* =====================================================
          PUBLIC PAGES
          ===================================================== */}
      <Route element={<PublicLayout />}>

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        {/* Events Page */}
      <Route
  path="/events"
  element={<Events />}

/>

        {/* About Page */}
        <Route
          path="/about"
          element={
            <div className="pt-28 p-8 text-white">
              About Page
            </div>
          }
        />

        {/* Contact Page */}
        <Route
          path="/contact"
          element={
            <div className="pt-28 p-8 text-white">
              Contact Page
            </div>
          }
        />

      </Route>

      {/* =====================================================
          STUDENT PAGES
          ===================================================== */}
      <Route
        path="/student"
        element={<StudentLayout />}
      >

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="registrations"
          element={<MyRegistrations />}
        />

        <Route
          path="tickets"
          element={<MyTickets />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

      </Route>

      {/* =====================================================
          ORGANIZER PAGES
          ===================================================== */}

      <Route
        path="/organizer"
        element={<OrganizerLayout />}
      >

        {/* Organizer Dashboard */}
        <Route
          path="dashboard"
          element={<OrganizerDashboard />}
        />

        {/* Organizer Event Details */}
        <Route
          path="events/:id"
          element={<OrganizerEventDetails />}
        />

        {/* Create Event */}
        <Route
          path="create-event"
          element={<CreateEvent />}
        />

        {/* My Events */}
        <Route
          path="events"
          element={<MyEvents />}
        />

        {/* Edit Event */}
        <Route
          path="events/:id/edit"
          element={<EditEvent />}
        />

        {/* Participants */}
        <Route
          path="participants"
          element={<Participants />}
        />

        {/* Event Participants */}
        <Route
          path="events/:id/participants"
          element={<Participants />}
        />

      </Route>

      {/* =====================================================
          ADMIN DASHBOARD
          ===================================================== */}
      <Route
        path="/admin/dashboard"
        element={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h1>Admin Dashboard</h1>
          </div>
        }
      />

      {/* =====================================================
          404 - PAGE NOT FOUND
          ===================================================== */}
      <Route
        path="*"
        element={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h1>404</h1>
            <p>Page not found.</p>
          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;