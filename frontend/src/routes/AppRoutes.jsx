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
import OrganizerEventDetails from "../pages/organizer/OrganizerEventDetails.jsx";
import CreateEvent from "../pages/organizer/CreateEvent.jsx";
import MyEvents from "../pages/organizer/MyEvents.jsx";
import EditEvent from "../pages/organizer/EditEvent.jsx";
import Participants from "../pages/organizer/Participants.jsx";
import OrganizerProfile from "../pages/organizer/Profile.jsx";
import Feedback from "../pages/organizer/Feedback.jsx";

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
import AdminCategories from "../pages/admin/Categories.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";

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

      {/* LOGIN PAGE */}
      <Route
        path="/login"
        element={<Auth />}
      />

      {/* REGISTER PAGE */}
      <Route
        path="/register"
        element={<Auth />}
      />

      {/* OLD AUTH URL - KEPT FOR COMPATIBILITY */}
      <Route
        path="/auth"
        element={<Auth />}
      />

      {/* PASSWORD RESET */}
      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />

      {/* =====================================================
          PUBLIC PAGES
          ===================================================== */}

      <Route element={<PublicLayout />}>

        {/* Public Categories */}
        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* Event Details */}
        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        {/* All Events */}
        <Route
          path="/events"
          element={<Events />}
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <div className="pt-28 p-8 text-white">
              About Page
            </div>
          }
        />

        {/* Contact */}
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

        {/* All Participants */}
        <Route
          path="participants"
          element={<Participants />}
        />

        {/* Event-specific Participants */}
        <Route
          path="events/:id/participants"
          element={<Participants />}
        />

        {/* Organizer Feedback */}
        <Route
          path="feedback"
          element={<Feedback />}
        />

        {/* Organizer Profile */}
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

        {/* Admin Dashboard */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        {/* Admin Users */}
        <Route
          path="users"
          element={<AdminUsers />}
        />

        {/* Admin Events */}
        <Route
          path="events"
          element={<AdminEvents />}
        />

        {/* Admin Registrations */}
        <Route
          path="registrations"
          element={<AdminRegistrations />}
        />

        {/* Admin Categories */}
        <Route
          path="categories"
          element={<AdminCategories />}
        />

      </Route>

      {/* =====================================================
          ADMIN LOGIN
          ===================================================== */}

      <Route
        path="/admin-login"
        element={<AdminLogin />}
      />

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