import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../App.jsx";
import EventDetails from "../pages/public/EventDetails.jsx";

import StudentLayout from "../layouts/StudentLayout.jsx";
import Dashboard from "../pages/student/Dashboard.jsx";
import MyRegistrations from "../pages/student/MyRegistrations.jsx";
import MyTickets from "../pages/student/MyTickets.jsx";
import Profile from "../pages/student/Profile.jsx";

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

    </Routes>
  );
};

export default AppRoutes;