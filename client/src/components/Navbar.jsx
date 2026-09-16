import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  LogOut,
  User as UserIcon,
  PenTool,
  Compass,
  Users,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              CampusTales
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Campus Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className={`transition hover:text-indigo-400 ${
              isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`flex items-center gap-1.5 transition hover:text-indigo-400 ${
              isActive('/explore') ? 'text-indigo-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </Link>
          <Link
            to="/circles"
            className={`flex items-center gap-1.5 transition hover:text-indigo-400 ${
              isActive('/circles') ? 'text-indigo-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Circles</span>
          </Link>
          <Link
            to={isAuthenticated ? '/create-story' : '/login'}
            className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-400 transition"
          >
            <PenTool className="h-4 w-4" />
            <span>Share Story</span>
          </Link>
        </nav>

        {/* Right Actions: Authenticated User vs Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-slate-800/80 transition group"
              >
                <img
                  src={
                    user?.profileImage ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      user?.name || 'User'
                    )}`
                  }
                  alt={user?.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                />
                <div className="text-left leading-tight">
                  <div className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition">
                    {user?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {user?.college || 'Student'}
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl glass-pill text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white glass-pill hover:bg-slate-800/80 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 transition active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Join Campus</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass-pill text-slate-300 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-indigo-400"
          >
            Explore Stories
          </Link>
          <Link
            to="/circles"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-200 hover:text-indigo-400"
          >
            Campus Circles
          </Link>
          
          <div className="pt-3 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm text-slate-200"
                >
                  <UserIcon className="h-4 w-4 text-indigo-400" />
                  <span>View Profile ({user?.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 text-sm text-rose-400 hover:text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl glass-pill text-sm font-semibold text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-600/30"
                >
                  Join Campus
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
