import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Calendar, Users, LogOut, Cpu } from 'lucide-react';

export default function OrganizerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/student/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Create Event', path: '/organizer/create-event', icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-[#070711] flex text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r border-white/10 p-6 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-purple-600/20 border border-purple-500/40 rounded-xl text-purple-400">
              <Cpu size={20} />
            </div>
            <span className="font-bold text-white">Organizer Hub</span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active ? 'gradient-btn text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}