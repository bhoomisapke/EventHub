import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, Sparkles } from 'lucide-react';
import EventCard from '../../components/EventCard';
import {eventsData } from '../../data/events';

const CATEGORIES = [
  'All', 'Hackathon', 'Coding', 'AI & ML', 'Web Development', 
  'Cyber Security', 'Robotics', 'IoT', 'Workshop', 'Tech Fest'
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [savedIds, setSavedIds] = useState([]);

  // Sync component state with URL query parameters (from Hero Search / Quick Filters)
  useEffect(() => {
    const querySearch = searchParams.get('search') || '';
    const queryCategory = searchParams.get('category') || 'All';
    
    setSearchTerm(querySearch);
    
    // Match partial category names from quick filters (e.g., "Music" or "Sports")
    const matchedCategory = CATEGORIES.find(
      cat => cat.toLowerCase() === queryCategory.toLowerCase()
    ) || 'All';
    
    setSelectedCategory(matchedCategory);
  }, [searchParams]);

  const toggleSave = (id) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredEvents = eventsData.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  return (
    // Added pt-24 top padding so header content sits cleanly below fixed/sticky Navbar
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Explore Technical Events</h1>
        <p className="text-sm text-gray-400">Discover upcoming campus competitions, workshops, and flagship tech fests.</p>
      </div>

      {/* Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search hackathons, workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* View Toggle & Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-xs text-gray-400">
              Showing <strong className="text-white">{filteredEvents.length}</strong> events
            </span>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'glass-card text-gray-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Display Grid / List */}
      {filteredEvents.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              isSaved={savedIds.includes(event.id)} 
              onToggleSave={toggleSave} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
          <div className="p-4 bg-blue-600/20 text-blue-400 rounded-full w-fit mx-auto">
            <Sparkles size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">No Events Found</h3>
          <p className="text-xs text-gray-400">Try adjusting your search terms or filter selections to find matching technical events.</p>
          <button 
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/30"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}