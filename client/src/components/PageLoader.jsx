import React from 'react';
import { GraduationCap } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
      <div className="relative">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 animate-pulse">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <div className="absolute -inset-1 rounded-3xl bg-indigo-500/20 blur-md -z-10 animate-ping" />
      </div>

      <div className="space-y-1 text-center">
        <div className="text-sm font-bold text-white tracking-wide">CampusTales</div>
        <p className="text-xs text-slate-400">Loading your memories...</p>
      </div>
    </div>
  );
}
