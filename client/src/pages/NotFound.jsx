import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, BookOpen, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        
        {/* Big 404 Illustration with Emoji */}
        <div className="relative inline-block">
          <div className="text-8xl sm:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500 select-none">
            404
          </div>
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
            🎒
          </div>
        </div>

        {/* Heading & Witty Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Looks like you bunked into an empty classroom!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you're searching for might have graduated, moved hostels, or never existed on the syllabus.
          </p>
        </div>

        {/* Quick Links Card */}
        <div className="p-4 rounded-2xl glass-card border border-slate-800 text-left space-y-2.5 max-w-sm mx-auto">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            Popular Spots on Campus:
          </div>
          <div className="space-y-1 text-xs">
            <Link
              to="/"
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <Home className="h-3.5 w-3.5 text-indigo-400" />
                <span>Home Feed</span>
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
            </Link>

            <Link
              to="/explore"
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-purple-400" />
                <span>Explore Stories</span>
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
            </Link>

            <Link
              to="/circles"
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white transition"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm">🏢</span>
                <span>Campus Circles</span>
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Home className="h-4 w-4" />
            <span>Back to Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
