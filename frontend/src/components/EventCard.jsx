import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Bookmark, Users, ArrowUpRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Fallback defaults if props are missing
  const {
    id = '1',
    title = 'Campus Hackathon 2026',
    category = 'Hackathon',
    date = 'Oct 24, 2026',
    time = '10:00 AM',
    location = 'Tech Auditorium',
    attendees = 142,
    image = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  } = event || {};

  return (
    <div className="group relative rounded-2xl bg-[#0F172A]/80 backdrop-blur-xl border border-[#FFFFFF]/10 hover:border-[#0EA5E9]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-[#0EA5E9]/10 flex flex-col overflow-hidden">
      
      {/* Event Image & Badges Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-[#090D16]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F172A]/90 text-[#E0F2FE] border border-[#FFFFFF]/15 backdrop-blur-md">
          {category}
        </span>

        {/* Bookmark / Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
            isSaved 
              ? 'bg-[#0EA5E9] text-[#FFFFFF] border-[#0EA5E9]' 
              : 'bg-[#0F172A]/70 text-[#F1F5F9] border-[#FFFFFF]/20 hover:text-[#0EA5E9]'
          }`}
          aria-label="Save event"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Title */}
          <Link to={`/event/${id}`} className="block group-hover:text-[#0EA5E9] transition-colors">
            <h3 className="text-lg font-bold text-[#FFFFFF] line-clamp-1 flex items-center justify-between">
              <span>{title}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0EA5E9] shrink-0 ml-1" />
            </h3>
          </Link>

          {/* Details */}
          <div className="space-y-1.5 text-xs text-[#F1F5F9]/80 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>{date} • {time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#FFFFFF]/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#E0F2FE]">
            <Users className="w-3.5 h-3.5 text-[#0EA5E9]" />
            <span>{attendees} registered</span>
          </div>

          <Link
            to={`/event/${id}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#0EA5E9]/10 hover:bg-[#0EA5E9] text-[#0EA5E9] hover:text-[#FFFFFF] font-semibold transition-all border border-[#0EA5E9]/30"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;