import React from 'react';
import { Search, X, Flame, Clock, TrendingUp, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Stories', emoji: '✨' },
  { id: 'Love', name: 'Love', emoji: '❤️' },
  { id: 'Friendship', name: 'Friendship', emoji: '🫂' },
  { id: 'Heartbreak', name: 'Heartbreak', emoji: '💔' },
  { id: 'Trips', name: 'Trips', emoji: '✈️' },
  { id: 'Funny', name: 'Funny', emoji: '😂' },
  { id: 'Struggles', name: 'Struggles', emoji: '😔' },
  { id: 'Growth', name: 'Growth', emoji: '🌱' },
  { id: 'Memories', name: 'Memories', emoji: '🎓' },
];

export default function FeedFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalCount,
}) {
  const hasActiveFilters = search.trim() !== '' || selectedCategory !== 'all';

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Sort Options Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories by title, college, hostel, or memories..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-xs sm:text-sm transition outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Tabs (Latest / Popular / Trending) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto justify-center">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              sortBy === 'latest'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Latest</span>
          </button>

          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              sortBy === 'popular'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Popular</span>
          </button>

          <button
            onClick={() => setSortBy('trending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              sortBy === 'trending'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span>Trending</span>
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'glass-pill text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* Reset filters chip if active */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold border border-rose-500/30 flex items-center gap-1 transition"
          >
            <X className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-300">{totalCount || 0}</strong> college stories
          {selectedCategory !== 'all' ? ` in '${selectedCategory}'` : ''}
          {search ? ` matching "${search}"` : ''}
        </span>
        <span className="capitalize">Order: {sortBy}</span>
      </div>
    </div>
  );
}
