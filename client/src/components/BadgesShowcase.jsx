import React, { useState } from 'react';
import { Award, CheckCircle2, Lock, Sparkles, ChevronRight, Info } from 'lucide-react';

export default function BadgesShowcase({ badges = [], totalUnlocked = 0, totalBadges = 0 }) {
  const [selectedBadge, setSelectedBadge] = useState(null);

  if (!badges || badges.length === 0) {
    return null;
  }

  const unlockRatio = Math.round((totalUnlocked / (totalBadges || badges.length)) * 100);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 relative overflow-hidden">
      {/* Decorative subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-500/10">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Campus Storyteller Badges</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                {totalUnlocked}/{totalBadges || badges.length} Unlocked
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Achievements earned by sharing stories, marking milestones, and engaging campus peers
            </p>
          </div>
        </div>

        {/* Overall Progress Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="w-24 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${unlockRatio}%` }}
            />
          </div>
          <span className="text-xs font-bold text-amber-400">{unlockRatio}%</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {badges.map((badge) => {
          const isUnlocked = badge.unlocked;
          const isSelected = selectedBadge?.id === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(isSelected ? null : badge)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between relative group ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-amber-500/30 hover:border-amber-400/60 shadow-md shadow-amber-500/5 hover:-translate-y-0.5'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 opacity-60 hover:opacity-80'
              } ${isSelected ? 'ring-2 ring-amber-400' : ''}`}
            >
              {/* Unlock Indicator Icon */}
              <div className="absolute top-1.5 right-1.5">
                {isUnlocked ? (
                  <CheckCircle2 className="h-3 w-3 text-amber-400" />
                ) : (
                  <Lock className="h-3 w-3 text-slate-500" />
                )}
              </div>

              {/* Emoji Icon */}
              <div
                className={`text-2xl sm:text-3xl my-1 transition-transform group-hover:scale-110 ${
                  isUnlocked ? 'filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]' : 'grayscale opacity-50'
                }`}
              >
                {badge.icon}
              </div>

              {/* Badge Title */}
              <div className="space-y-0.5 w-full">
                <div
                  className={`text-xs font-bold truncate ${
                    isUnlocked ? 'text-white' : 'text-slate-400'
                  }`}
                  title={badge.title}
                >
                  {badge.title}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {badge.category}
                </div>
              </div>

              {/* Mini progress bar if locked */}
              {!isUnlocked && badge.progress && (
                <div className="w-full mt-2">
                  <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${badge.progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    {badge.progress.current}/{badge.progress.target}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Badge Details Box */}
      {selectedBadge && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedBadge.icon}</span>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>{selectedBadge.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    selectedBadge.unlocked
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {selectedBadge.unlocked ? 'Unlocked 🌟' : 'Locked 🔒'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">{selectedBadge.description}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedBadge(null)}
            className="text-slate-400 hover:text-white px-2 py-1 rounded-lg glass-pill text-[11px]"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
