import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../App.jsx";
// import EventDetails from "../pages/public/EventDetails.jsx";

import StudentLayout from "../layouts/StudentLayout.jsx";
import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
import Profile from "../pages/student/Profile.jsx";
// Layout
import PublicLayout from '../layouts/PublicLayout';
import OrganizerEventDetails from "../pages/organizer/OrganizerEventDetails";
// Public Pages
import Home from '../pages/public/Home';
import Categories from '../pages/public/Categories';
import EventDetails from '../pages/public/EventDetails';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/Dashboard';
import CreateEvent from '../pages/organizer/CreateEvent';
import MyEvents from '../pages/organizer/MyEvents';
import EditEvent from '../pages/organizer/EditEvent';
import Participants from '../pages/organizer/Participants';

const AppRoutes = () => {
  return (
    <Routes>

      {/* LANDING PAGE */}
      <Route path="/" element={<App />} />

      {/* EVENT DETAILS */}
      <Route path="/event/:id" element={<EventDetails />} />

      {/* STUDENT */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registrations" element={<MyRegistrations />} />
        <Route path="tickets" element={<MyTickets />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* =========================
          PUBLIC PAGES
      ========================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
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
          path="/organizer/events/:id"
          element={<OrganizerEventDetails />}
       />
        
        <Route
          path="/contact"
          element={<div className="pt-28 p-8 text-white">Contact Page</div>}
        />
      </Route>


      {/* =========================
          ORGANIZER PAGES
      ========================== */}

      {/* Organizer Dashboard */}
      <Route
        path="/organizer/dashboard"
        element={<OrganizerDashboard />}
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
      <Route path="/organizer/participants" element={<Participants />} />
      {/* Edit Event */}
      <Route
        path="/organizer/events/:id/edit"
        element={<EditEvent />}
      />

      {/* Participants */}
      <Route
        path="/organizer/events/:id/participants"
        element={<Participants />}
      />

    </Routes>
  );
};

export default AppRoutes;