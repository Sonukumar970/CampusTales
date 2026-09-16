import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Users, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            isActive('/') ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* 2. Explore */}
        <Link
          to="/explore"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            isActive('/explore') ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span className="text-[10px]">Explore</span>
        </Link>

        {/* 3. Central Glowing Share Button */}
        <Link
          to={isAuthenticated ? '/create-story' : '/login'}
          className="relative -top-3 p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-95 transition"
          title="Share Story"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
        </Link>

        {/* 4. Circles */}
        <Link
          to="/circles"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            isActive('/circles') || location.pathname.startsWith('/circles/')
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px]">Circles</span>
        </Link>

        {/* 5. Profile */}
        <Link
          to={isAuthenticated ? '/profile' : '/login'}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            isActive('/profile') || isActive('/login')
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isAuthenticated && user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className={`h-5 w-5 rounded-md object-cover ${
                isActive('/profile') ? 'ring-2 ring-indigo-400' : 'opacity-80'
              }`}
            />
          ) : (
            <User className="h-5 w-5" />
          )}
          <span className="text-[10px]">{isAuthenticated ? 'Profile' : 'Log In'}</span>
        </Link>

      </div>
    </div>
  );
}
