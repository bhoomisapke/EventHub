import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#070B14] text-[#F1F5F9]">
      {/* Outlet renders Home.jsx directly from top edge (0px top offset) */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;