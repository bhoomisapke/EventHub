import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../App.jsx";
import Auth from "../pages/auth/Auth.jsx";

// =====================================================
// LAYOUTS
// =====================================================

import StudentLayout from "../layouts/StudentLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import OrganizerLayout from "../layouts/OrganizerLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";

// =====================================================
// STUDENT PAGES
// =====================================================

import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
import MyCertificates from "../pages/student/MyCertificates.jsx";
import Profile from "../pages/student/Profile.jsx";
import RegistrationForm from "../pages/student/RegistrationForm.jsx";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Categories from "../pages/public/Categories.jsx";
import EventDetails from "../pages/public/EventDetails.jsx";
import Events from "../pages/public/Events.jsx";

// =====================================================
// ORGANIZER PAGES
// =====================================================

import OrganizerDashboard from "../pages/organizer/Dashboard.jsx";
import OrganizerEventDetails from "../pages/organizer/organizerEventDetails.jsx";
import CreateEvent from "../pages/organizer/CreateEvent.jsx";
import MyEvents from "../pages/organizer/MyEvents.jsx";
import EditEvent from "../pages/organizer/EditEvent.jsx";
import Participants from "../pages/organizer/Participants.jsx";
import OrganizerProfile from "../pages/organizer/Profile.jsx";
import Feedback from "../pages/organizer/Feedback.jsx";
import CertificateCustomization from "../pages/organizer/CertificateCustomization.jsx";

// =====================================================
// AUTH
// =====================================================

import ResetPassword from "../pages/auth/ResetPassword.jsx";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminEvents from "../pages/admin/AdminEvents.jsx";
import AdminRegistrations from "../pages/admin/AdminRegistrations.jsx";

// =====================================================
// 404 PAGE
// =====================================================

const NotFound = () => {
  return (
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

      <p>
        Page not found.
      </p>
    </div>
  );
};

// =====================================================
// APP ROUTES
// =====================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC EVENT REGISTRATION
          ===================================================== */}

      <Route
        path="/events/:id/register"
        element={<RegistrationForm />}
      />

      {/* =====================================================
          LANDING PAGE
          ===================================================== */}

      <Route
        path="/"
        element={<App />}
      />

      {/* =====================================================
          AUTHENTICATION
          ===================================================== */}

      <Route
        path="/auth"
        element={<Auth />}
      />

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

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/about"
          element={
            <div className="pt-28 p-8 text-white">
              About Page
            </div>
          }
        />

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

        {/* Student Dashboard */}

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        {/* Event Registration */}

        <Route
          path="events/:id/register"
          element={<RegistrationForm />}
        />

        {/* Certificates */}

        <Route
          path="certificates"
          element={<MyCertificates />}
        />

        {/* Tickets */}

        <Route
          path="tickets"
          element={<MyTickets />}
        />

        {/* Profile */}

        <Route
          path="profile"
          element={<Profile />}
        />

        {/* Registration Form */}

        <Route
          path="register"
          element={<RegistrationForm />}
        />

        {/* My Registrations */}

        <Route
          path="registrations"
          element={<MyRegistrations />}
        />

      </Route>

      {/* =====================================================
          ORGANIZER PAGES
          ===================================================== */}

      <Route
        path="/organizer"
        element={<OrganizerLayout />}
      >

        {/* =================================================
            ORGANIZER DASHBOARD
            URL: /organizer/dashboard
            ================================================= */}

        <Route
          path="dashboard"
          element={<OrganizerDashboard />}
        />

        {/* =================================================
            ORGANIZER EVENT DETAILS
            URL: /organizer/events/:id
            ================================================= */}

        <Route
          path="events/:id"
          element={<OrganizerEventDetails />}
        />

        {/* =================================================
            CERTIFICATE CUSTOMIZATION
            URL: /organizer/events/:id/certificate-template
            ================================================= */}

        <Route
          path="events/:id/certificate-template"
          element={<CertificateCustomization />}
        />

        {/* =================================================
            CREATE EVENT
            URL: /organizer/create-event
            ================================================= */}

        <Route
          path="create-event"
          element={<CreateEvent />}
        />

        {/* =================================================
            MY EVENTS
            URL: /organizer/events
            ================================================= */}

        <Route
          path="events"
          element={<MyEvents />}
        />

        {/* =================================================
            EDIT EVENT
            URL: /organizer/events/:id/edit
            ================================================= */}

        <Route
          path="events/:id/edit"
          element={<EditEvent />}
        />

        {/* =================================================
            ALL EVENT PARTICIPANTS
            URL: /organizer/participants
            ================================================= */}

        <Route
          path="participants"
          element={<Participants />}
        />

        {/* =================================================
            EVENT-SPECIFIC PARTICIPANTS
            URL: /organizer/events/:id/participants
            ================================================= */}

        <Route
          path="events/:id/participants"
          element={<Participants />}
        />

        {/* =================================================
            ORGANIZER FEEDBACK
            URL: /organizer/feedback
            ================================================= */}

        <Route
          path="feedback"
          element={<Feedback />}
        />

        {/* =================================================
            ORGANIZER PROFILE
            URL: /organizer/profile
            ================================================= */}

        <Route
          path="profile"
          element={<OrganizerProfile />}
        />

      </Route>

      {/* =====================================================
          ADMIN PANEL
          ===================================================== */}

      <Route
        path="/admin"
        element={<AdminLayout />}
      >

        {/* =================================================
            ADMIN DASHBOARD
            URL: /admin/dashboard
            ================================================= */}

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* =================================================
            ADMIN USERS
            URL: /admin/users
            ================================================= */}

        <Route
          path="users"
          element={<AdminUsers />}
        />

        {/* =================================================
            ADMIN EVENTS
            URL: /admin/events
            ================================================= */}

        <Route
          path="events"
          element={<AdminEvents />}
        />

        {/* =================================================
            ADMIN REGISTRATIONS
            URL: /admin/registrations
            ================================================= */}

        <Route
          path="registrations"
          element={<AdminRegistrations />}
        />

      </Route>

      {/* =====================================================
          404 PAGE
          ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;