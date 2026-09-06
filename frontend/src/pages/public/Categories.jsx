import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Music, 
  Trophy, 
  Palette, 
  BookOpen, 
  Gamepad2, 
  Sparkles, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { categoriesData, eventsData } from '../../data/events';
import EventCard from '../../components/EventCard';

// Map icon strings to Lucide components
const iconMap = {
  Code: Code,
  Music: Music,
  Trophy: Trophy,
  Palette: Palette,
  BookOpen: BookOpen,
  Gamepad2: Gamepad2,
};

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter events based on selected category pill
  const filteredEvents = selectedCategory === 'All'
    ? eventsData
    : eventsData.filter((event) => event.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F1F5F9] pt-28 pb-16 px-6 lg:px-16 space-y-12">
      
      {/* Header Section */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0F172A]/80 border border-[#0EA5E9]/30 text-xs font-semibold text-[#06B6D4]">
          <Layers className="w-3.5 h-3.5" />
          <span>Explore by Interest</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#FFFFFF] tracking-tight">
          Browse <span className="text-[#0EA5E9]">Categories</span>
        </h1>
        <p className="text-[#F1F5F9]/80 text-base leading-relaxed">
          Find student organizations, tech hackathons, athletic tournaments, and cultural fests grouped by category.
        </p>
      </div>

      {/* Category Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoriesData.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'All' : cat.name)}
              className={`group cursor-pointer rounded-2xl p-5 border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#0EA5E9]/15 border-[#0EA5E9] shadow-lg shadow-[#0EA5E9]/20'
                  : 'bg-[#0F172A]/75 border-[#FFFFFF]/10 hover:border-[#0EA5E9]/50 hover:-translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${
                  isSelected ? 'bg-[#0EA5E9] text-[#FFFFFF]' : 'bg-[#0F172A] text-[#06B6D4] group-hover:text-[#0EA5E9]'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0F172A] text-[#E0F2FE] border border-[#FFFFFF]/10">
                  {cat.count}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-[#FFFFFF] text-base group-hover:text-[#0EA5E9] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#F1F5F9]/60 mt-0.5">Explore events</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Status Bar */}
      <div className="flex items-center justify-between border-b border-[#FFFFFF]/10 pb-4 pt-4">
        <h2 className="text-xl font-bold text-[#FFFFFF] flex items-center gap-2">
          <span>{selectedCategory === 'All' ? 'All Category Events' : `${selectedCategory} Events`}</span>
          <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30">
            {filteredEvents.length}
          </span>
        </h2>

        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs font-medium text-[#0EA5E9] hover:text-[#06B6D4] transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Event Cards Listing */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-[#0F172A]/50 border border-[#FFFFFF]/10 space-y-3">
          <p className="text-lg font-medium text-[#FFFFFF]">No events found in this category.</p>
          <p className="text-sm text-[#F1F5F9]/60">Check back later or explore other categories.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;