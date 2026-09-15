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

// =====================================================
// STUDENT PAGES
// =====================================================
import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
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
import Feedback from "../pages/organizer/Feedback";

// =====================================================
// AUTH
// =====================================================
import ResetPassword from "../pages/auth/ResetPassword.jsx";


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

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="events/:id/register"
          element={<RegistrationForm />}
        />

        <Route
          path="tickets"
          element={<MyTickets />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="register"
          element={<RegistrationForm />}
        />

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
            ================================================= */}

        <Route
          path="dashboard"
          element={<OrganizerDashboard />}
        />


        {/* =================================================
            ORGANIZER EVENT DETAILS
            ================================================= */}

        <Route
          path="events/:id"
          element={<OrganizerEventDetails />}
        />


        {/* =================================================
            CREATE EVENT
            ================================================= */}

        <Route
          path="create-event"
          element={<CreateEvent />}
        />


        {/* =================================================
            MY EVENTS
            ================================================= */}

        <Route
          path="events"
          element={<MyEvents />}
        />


        {/* =================================================
            EDIT EVENT
            ================================================= */}

        <Route
          path="events/:id/edit"
          element={<EditEvent />}
        />


        {/* =================================================
            ALL EVENT PARTICIPANTS
            =================================================

            URL:

            /organizer/participants

            This keeps your PREVIOUS functionality.

            It should show participants from ALL events
            created by the logged-in organizer.

            ================================================= */}

        <Route
          path="participants"
          element={<Participants />}
        />


        {/* =================================================
            EVENT-SPECIFIC PARTICIPANTS
            =================================================

            URL examples:

            /organizer/events/1/participants
            /organizer/events/2/participants
            /organizer/events/3/participants

            This is used by the Participants button
            inside My Events.

            It should show ONLY participants belonging
            to the selected event.

            ================================================= */}

        <Route
          path="events/:id/participants"
          element={<Participants />}
        />

        <Route
          path="feedback"
          element={<Feedback />}
        />
        {/* =================================================
            ORGANIZER PROFILE
            ================================================= */}

        <Route
          path="profile"
          element={<OrganizerProfile />}
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
          404 PAGE
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

            <p>
              Page not found.
            </p>

          </div>
        }
      />

    </Routes>
  );
};

export default AppRoutes;