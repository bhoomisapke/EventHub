import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../App.jsx";

import StudentLayout from "../layouts/StudentLayout.jsx";
import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
import Profile from "../pages/student/Profile.jsx";

// Layouts
import PublicLayout from "../layouts/PublicLayout.jsx";

// Public Pages
import Home from "../pages/public/Home.jsx";
import Categories from "../pages/public/Categories.jsx";
import EventDetails from "../pages/public/EventDetails.jsx";

// Organizer Pages
import OrganizerDashboard from "../pages/organizer/Dashboard.jsx";
import OrganizerEventDetails from "../pages/organizer/OrganizerEventDetails.jsx";
import CreateEvent from "../pages/organizer/CreateEvent.jsx";
import MyEvents from "../pages/organizer/MyEvents.jsx";
import EditEvent from "../pages/organizer/EditEvent.jsx";
import Participants from "../pages/organizer/Participants.jsx";

const AppRoutes = () => {
  return (
    <Routes>

      {/* LANDING PAGE */}
      <Route path="/" element={<App />} />

      {/* PUBLIC PAGES */}
      <Route element={<PublicLayout />}>
        <Route path="/categories" element={<Categories />} />
        <Route path="/event/:id" element={<EventDetails />} />

        {/* Placeholders for upcoming pages */}
        <Route
          path="/events"
          element={<div className="pt-28 p-8 text-white">Events Page</div>}
        />

        <Route
          path="/about"
          element={<div className="pt-28 p-8 text-white">About Page</div>}
        />

        <Route
          path="/contact"
          element={<div className="pt-28 p-8 text-white">Contact Page</div>}
        />
      </Route>

      {/* STUDENT PAGES */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registrations" element={<MyRegistrations />} />
        <Route path="tickets" element={<MyTickets />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ORGANIZER PAGES */}

      {/* Organizer Dashboard */}
      <Route
        path="/organizer/dashboard"
        element={<OrganizerDashboard />}
      />

      {/* Organizer Event Details */}
      <Route
        path="/organizer/events/:id"
        element={<OrganizerEventDetails />}
      />

      {/* Create Event */}
      <Route
        path="/organizer/create-event"
        element={<CreateEvent />}
      />

      {/* My Events */}
      <Route
        path="/organizer/events"
        element={<MyEvents />}
      />

      {/* Edit Event */}
      <Route
        path="/organizer/events/:id/edit"
        element={<EditEvent />}
      />

      {/* Participants */}
      <Route
        path="/organizer/participants"
        element={<Participants />}
      />

      <Route
        path="/organizer/events/:id/participants"
        element={<Participants />}
      />

    </Routes>
  );
};

export default AppRoutes;