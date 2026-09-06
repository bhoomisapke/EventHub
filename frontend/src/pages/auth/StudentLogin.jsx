import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login set token and role
    localStorage.setItem('token', 'mock_jwt_token');
    localStorage.setItem('role', 'student');
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Left Side: Branding Visual */}
        <div className="p-8 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-[#070711] flex flex-col justify-between border-r border-white/10">
          <div className="flex items-center gap-2 text-purple-400">
            <ShieldCheck size={28} />
            <span className="font-bold text-lg text-white">EventHub Portal</span>
          </div>

          <div className="my-12 space-y-3">
            <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Log in to access your registered hackathons, digital tickets, saved events, and feedback forms.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            © 2026 EventHub. Campus Event Management.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-6">Student Sign In</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full gradient-btn py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 mt-2"
            >
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-xs text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/student/register" className="text-purple-400 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}