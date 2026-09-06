import React from 'react';
import { Calendar, Ticket, Bookmark, CheckCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockEvents } from '../../data/events';
import EventCard from '../../components/EventCard';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-purple-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Student! 👋</h1>
          <p className="text-xs text-gray-400 mt-1">Here is an overview of your campus event participation.</p>
        </div>
        <Link to="/events" className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1">
          Explore Events <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Events', value: '2', icon: Calendar, color: 'text-purple-400' },
          { label: 'Digital Tickets', value: '2', icon: Ticket, color: 'text-blue-400' },
          { label: 'Saved Events', value: '4', icon: Bookmark, color: 'text-cyan-400' },
          { label: 'Completed Events', value: '5', icon: CheckCircle, color: 'text-emerald-400' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Registrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Your Upcoming Registrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockEvents.slice(0, 2).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}