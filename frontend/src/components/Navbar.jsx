import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#FFFFFF]/10 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[#FFFFFF]">
        <div className="p-2 rounded-lg bg-[#0EA5E9] text-[#FFFFFF]">
          <Calendar className="w-5 h-5" />
        </div>
        <span>CampusSphere</span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`transition-colors hover:text-[#0EA5E9] ${
                isActive ? 'text-[#0EA5E9] font-semibold' : 'text-[#FFFFFF]'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Auth Actions */}
      <div className="flex items-center gap-4">
        <Link
          to="/login/student"
          className="text-sm font-medium text-[#FFFFFF] hover:text-[#0EA5E9] transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register/student"
          className="px-4 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#06B6D4] text-[#FFFFFF] font-semibold text-sm transition-all shadow-md active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;