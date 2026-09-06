import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  School, 
  PartyPopper 
} from 'lucide-react';

import heroBgImage from '../../assets/a-group-of-people-sitting-in-front-of-laptops-free-photo (1).jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All dates');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const trendingTags = ['Hackathon', 'Music Fest', 'Basketball', 'Art Show'];

  return (
    <div className="relative min-h-screen text-[#F1F5F9] font-sans overflow-hidden flex flex-col justify-between">
      
      {/* BACKGROUND IMAGE - NO ZOOM */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={heroBgImage} 
          alt="Campus audience background" 
          className="w-full h-full object-cover object-center scale-100"
        />
        {/* Subtle, ultra-light gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* OVERLAY NAVIGATION HEADER */}
      <header className="relative z-20 w-full px-8 lg:px-20 py-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#2563EB] text-[#FFFFFF] shadow-md shadow-[#2563EB]/30">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#FFFFFF] drop-shadow-md">
            Campus<span className="text-[#38BDF8]">Sphere</span>
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#FFFFFF] drop-shadow">
          <Link to="/" className="text-[#FFFFFF] font-semibold border-b-2 border-[#38BDF8] pb-0.5">Home</Link>
          <Link to="/events" className="hover:text-[#38BDF8] transition-colors">Events</Link>
          <Link to="/categories" className="hover:text-[#38BDF8] transition-colors">Categories</Link>
          <Link to="/about" className="hover:text-[#38BDF8] transition-colors">About</Link>
          <Link to="/contact" className="hover:text-[#38BDF8] transition-colors">Contact</Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-6">
          <Link 
            to="/login/student" 
            className="text-sm font-medium text-[#FFFFFF] hover:text-[#38BDF8] transition-colors drop-shadow"
          >
            Sign In
          </Link>
          <Link 
            to="/register/student" 
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-semibold text-sm transition-all duration-200 shadow-lg shadow-[#2563EB]/25 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO CONTENT */}
      <main className="relative z-10 w-full px-8 lg:px-20 my-auto py-4 text-left">
        <div className="max-w-2xl space-y-5">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A]/70 border border-[#FFFFFF]/20 backdrop-blur-md text-xs font-medium text-[#E0F2FE]">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Spring 2026 semester events are now live</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.15] drop-shadow-lg">
            Discover, organize & join <span className="text-[#38BDF8]">campus events</span> that matter
          </h1>

          {/* Subtitle */}
          <p className="max-w-lg text-sm sm:text-base text-[#F1F5F9] font-normal leading-relaxed drop-shadow-md">
            Your one-stop platform for every college event — from hackathons to music festivals. Browse, register, and never miss a moment.
          </p>

          {/* Translucent Dark Glass Search Box */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-xl rounded-2xl p-1.5 bg-[#0B1120]/80 backdrop-blur-xl border border-[#FFFFFF]/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-3 px-4 py-2 w-full flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <input 
                type="text" 
                placeholder="Search events, clubs, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[#FFFFFF] placeholder-[#94A3B8] focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 border-t sm:border-t-0 sm:border-l border-[#FFFFFF]/15 w-full sm:w-auto text-xs text-[#CBD5E1]">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              <select 
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
                className="bg-transparent text-[#CBD5E1] focus:outline-none cursor-pointer text-xs"
              >
                <option value="All dates" className="bg-[#0F172A] text-[#FFFFFF]">All dates</option>
                <option value="Today" className="bg-[#0F172A] text-[#FFFFFF]">Today</option>
                <option value="This Week" className="bg-[#0F172A] text-[#FFFFFF]">This Week</option>
                <option value="This Month" className="bg-[#0F172A] text-[#FFFFFF]">This Month</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Trending Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-[#FFFFFF] drop-shadow mr-2">
              Trending:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/events?category=${encodeURIComponent(tag)}`)}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#0F172A]/70 text-[#E0F2FE] border border-[#FFFFFF]/20 hover:border-[#38BDF8] hover:text-[#FFFFFF] transition-all backdrop-blur-md"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </main>

      {/* BOTTOM LEFT STATS */}
      <footer className="relative z-10 w-full px-8 lg:px-20 pb-8 border-t border-[#FFFFFF]/15 pt-6">
        <div className="flex items-center gap-12">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0F172A]/70 border border-[#FFFFFF]/20 backdrop-blur-md text-[#38BDF8]">
              <PartyPopper className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-[#FFFFFF] leading-none drop-shadow">1,250+</p>
              <p className="text-xs text-[#CBD5E1] mt-1 drop-shadow">Events hosted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0F172A]/70 border border-[#FFFFFF]/20 backdrop-blur-md text-[#38BDF8]">
              <School className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-[#FFFFFF] leading-none drop-shadow">32</p>
              <p className="text-xs text-[#CBD5E1] mt-1 drop-shadow">Partner colleges</p>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;