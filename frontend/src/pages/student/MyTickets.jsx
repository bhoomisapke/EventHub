import React from 'react';
import { QrCode, Calendar, MapPin, User, Ticket } from 'lucide-react';
import { mockEvents } from '../../data/events';

export default function MyTickets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Digital Passes</h1>
        <p className="text-xs text-gray-400 mt-1">Present your QR code ticket at event check-in points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEvents.slice(0, 2).map((event) => (
          <div key={event.id} className="glass-panel rounded-2xl overflow-hidden border border-purple-500/30 flex flex-col sm:flex-row">
            {/* Event Info */}
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-purple-600/20 text-purple-400 rounded-lg">
                  <Ticket size={16} />
                </span>
                <span className="text-xs font-semibold text-purple-300">CONFIRMED PASS</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{event.title}</h3>
                <p className="text-xs text-gray-400">{event.organizer}</p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-purple-400" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-blue-400" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-cyan-400" />
                  <span>Pass Holder: Alex Johnson</span>
                </div>
              </div>
            </div>

            {/* QR Stub */}
            <div className="p-6 bg-purple-950/30 border-t sm:border-t-0 sm:border-l border-white/10 flex flex-col items-center justify-center gap-2 min-w-[160px]">
              <div className="p-3 bg-white rounded-xl text-black">
                <QrCode size={80} />
              </div>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">REG-2026-8941</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}