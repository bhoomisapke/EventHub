import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
import Home from '../pages/public/Home';
import Categories from '../pages/public/Categories';
import EventDetails from '../pages/public/EventDetails';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages wrapped with shared Navbar & Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/event/:id" element={<EventDetails />} />
        
        {/* Placeholders for upcoming pages */}
        <Route path="/events" element={<div className="pt-28 p-8 text-white">Events Page</div>} />
        <Route path="/about" element={<div className="pt-28 p-8 text-white">About Page</div>} />
        <Route path="/contact" element={<div className="pt-28 p-8 text-white">Contact Page</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;