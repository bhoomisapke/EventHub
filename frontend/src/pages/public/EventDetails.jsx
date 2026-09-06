import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  CheckCircle2, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { eventsData } from '../../data/events';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Find matching event or fallback to first item
  const event = eventsData.find((item) => item.id === id) || eventsData[0];

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F1F5F9] pt-24 pb-16 px-6 lg:px-16 space-y-8">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#E0F2FE] hover:text-[#0EA5E9] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to events
      </button>

      {/* Hero Banner Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-[#FFFFFF]/10 bg-[#0F172A] h-72 sm:h-96">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/50 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0F172A]/90 text-[#E0F2FE] border border-[#FFFFFF]/15 backdrop-blur-md">
            {event.category}
          </span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                isSaved 
                  ? 'bg-[#0EA5E9] text-[#FFFFFF] border-[#0EA5E9]' 
                  : 'bg-[#0F172A]/80 text-[#FFFFFF] border-[#FFFFFF]/20 hover:text-[#0EA5E9]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-full bg-[#0F172A]/80 text-[#FFFFFF] border border-[#FFFFFF]/20 backdrop-blur-md hover:text-[#0EA5E9] transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Bottom Overlay Details */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFFFF] tracking-tight">
            {event.title}
          </h1>
          <p className="text-sm text-[#E0F2FE] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0EA5E9]" />
            Organized by <span className="font-semibold text-[#FFFFFF]">{event.organizer}</span>
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Event Overview & Location */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#FFFFFF]/10 backdrop-blur-xl">
              <Calendar className="w-5 h-5 text-[#0EA5E9] mb-2" />
              <p className="text-xs text-[#F1F5F9]/60">Date</p>
              <p className="text-sm font-semibold text-[#FFFFFF]">{event.date}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#FFFFFF]/10 backdrop-blur-xl">
              <Clock className="w-5 h-5 text-[#06B6D4] mb-2" />
              <p className="text-xs text-[#F1F5F9]/60">Time</p>
              <p className="text-sm font-semibold text-[#FFFFFF]">{event.time}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-[#FFFFFF]/10 backdrop-blur-xl col-span-2 sm:col-span-1">
              <Users className="w-5 h-5 text-[#0EA5E9] mb-2" />
              <p className="text-xs text-[#F1F5F9]/60">Attendees</p>
              <p className="text-sm font-semibold text-[#FFFFFF]">{event.attendees} Registered</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#FFFFFF]/10 backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-[#FFFFFF]">About This Event</h2>
            <p className="text-[#F1F5F9]/80 leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
            <p className="text-[#F1F5F9]/80 leading-relaxed text-sm sm:text-base">
              Expect engaging sessions, hands-on activities, networking opportunities with peers and mentors, and exclusive event perks.
            </p>
          </div>

          {/* Location & Map Section */}
          <div className="p-6 rounded-2xl bg-[#0F172A]/80 border border-[#FFFFFF]/10 backdrop-blur-xl space-y-4">
            <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#06B6D4]" />
              Location & Venue
            </h2>
            <p className="text-sm text-[#E0F2FE] font-medium">{event.location}</p>
            
            {/* Visual Map Placeholder Box */}
            <div className="w-full h-48 rounded-xl bg-[#090D16] border border-[#FFFFFF]/10 flex flex-col items-center justify-center space-y-2 text-center p-4">
              <MapPin className="w-8 h-8 text-[#0EA5E9] animate-bounce" />
              <p className="text-sm font-semibold text-[#FFFFFF]">Interactive Campus Map</p>
              <p className="text-xs text-[#F1F5F9]/50">Venue navigation will render here</p>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A]/90 border border-[#FFFFFF]/15 backdrop-blur-xl shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-[#FFFFFF]/10 pb-4">
              <div>
                <p className="text-xs text-[#F1F5F9]/60">Ticket Price</p>
                <p className="text-2xl font-extrabold text-[#FFFFFF]">{event.price}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30">
                Open Registration
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRegister}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  isRegistered
                    ? 'bg-[#06B6D4] text-[#FFFFFF] shadow-[#06B6D4]/20'
                    : 'bg-[#0EA5E9] hover:bg-[#06B6D4] text-[#FFFFFF] shadow-[#0EA5E9]/25 active:scale-95'
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Registered
                  </>
                ) : (
                  'Register Now'
                )}
              </button>

              <p className="text-xs text-center text-[#F1F5F9]/50">
                Instant confirmation email sent upon registration.
              </p>
            </div>

            <div className="pt-4 border-t border-[#FFFFFF]/10 space-y-3 text-xs text-[#E0F2FE]">
              <div className="flex items-center justify-between">
                <span className="text-[#F1F5F9]/60">Organizer</span>
                <span className="font-semibold text-[#FFFFFF]">{event.organizer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F1F5F9]/60">Category</span>
                <span className="font-semibold text-[#FFFFFF]">{event.category}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetails;