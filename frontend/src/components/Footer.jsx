import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Globe, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-white/10 bg-[#070711]/90 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
                <Calendar size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Event<span className="text-cyan-400">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your centralized platform for discovering, organizing, and participating in campus technical events, hackathons, and workshops.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-blue-400 transition-colors">Explore Events</Link></li>
              <li><Link to="/events?category=All" className="hover:text-blue-400 transition-colors">Categories</Link></li>
              <li><Link to="/organizer/login" className="hover:text-blue-400 transition-colors">Organizer Portal</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Account Access</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/student/login" className="hover:text-blue-400 transition-colors">Student Login</Link></li>
              <li><Link to="/student/register" className="hover:text-blue-400 transition-colors">Student Register</Link></li>
              <li><Link to="/organizer/login" className="hover:text-blue-400 transition-colors">Host an Event</Link></li>
              <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Support &amp; Community</h4>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <Globe size={14} className="text-blue-400" /> Global Campus Network
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-400" /> support@eventhub.edu
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" /> Verified Student Clubs
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2026 EventHub. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for campus innovation <Heart size={12} className="text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}