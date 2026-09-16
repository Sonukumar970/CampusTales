import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  Heart,
  Users,
  Plane,
  Laugh,
  HeartCrack,
  Frown,
  Sprout,
  BookOpen,
  Loader2,
  RefreshCw,
  Search,
  X,
  Building2,
  Smile,
  Calendar,
  Filter,
  Clock,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const DISCOVERY_CATEGORIES = [
  { id: 'Love', name: 'Love Stories', emoji: '❤️', icon: Heart, gradient: 'from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400' },
  { id: 'Friendship', name: 'Friendship Tales', emoji: '🫂', icon: Users, gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400' },
  { id: 'Trips', name: 'Travel Memories', emoji: '✈️', icon: Plane, gradient: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-400' },
  { id: 'Funny', name: 'Funny Moments', emoji: '😂', icon: Laugh, gradient: 'from-yellow-500/20 to-lime-500/10 border-yellow-500/30 text-yellow-400' },
  { id: 'Heartbreak', name: 'Heartbreak & Goodbyes', emoji: '💔', icon: HeartCrack, gradient: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400' },
  { id: 'Growth', name: 'Life Lessons & Growth', emoji: '🌱', icon: Sprout, gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400' },
  { id: 'Memories', name: 'Campus Nostalgia', emoji: '🎓', icon: BookOpen, gradient: 'from-indigo-500/20 to-blue-500/10 border-indigo-500/30 text-indigo-400' },
  { id: 'Struggles', name: 'Struggles & Grit', emoji: '😔', icon: Frown, gradient: 'from-slate-500/20 to-zinc-500/10 border-slate-500/30 text-slate-300' },
];

const MOODS = [
  'All',
  '😊 Nostalgic',
  '😂 Hilarious',
  '❤️ In Love',
  '🥳 Excited',
  '🥺 Emotional',
  '🌱 Inspired',
];

const BATCHES = ['All', '2023', '2024', '2025', '2026'];

export default function Explore() {
  const [stories, setStories] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [sortBy, setSortBy] = useState('trending');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch popular colleges for filter strip on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await api.get('/stories/colleges');
        if (res.data.success) {
          setColleges(res.data.colleges || []);
        }
      } catch (err) {
        console.error('Failed to load popular colleges:', err);
      }
    };
    fetchColleges();
  }, []);

  // Fetch stories with compound filters
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      setPage(1);

      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (selectedMood !== 'All') params.append('mood', selectedMood);
        if (selectedCollege !== 'all') params.append('college', selectedCollege);
        if (selectedBatch !== 'All') params.append('batch', selectedBatch);
        if (search.trim()) params.append('search', search.trim());
        params.append('sort', sortBy);
        params.append('page', '1');
        params.append('limit', '9');

        const res = await api.get(`/stories?${params.toString()}`);
        if (res.data.success) {
          setStories(res.data.stories || []);
          setTotalCount(res.data.total || 0);
          setHasMore(res.data.page < res.data.pages);
        }
      } catch (err) {
        console.error('Explore fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchStories, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, selectedCategory, selectedMood, selectedCollege, selectedBatch, sortBy]);

  // Load more pagination handler
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedMood !== 'All') params.append('mood', selectedMood);
      if (selectedCollege !== 'all') params.append('college', selectedCollege);
      if (selectedBatch !== 'All') params.append('batch', selectedBatch);
      if (search.trim()) params.append('search', search.trim());
      params.append('sort', sortBy);
      params.append('page', nextPage.toString());
      params.append('limit', '9');

      const res = await api.get(`/stories?${params.toString()}`);
      if (res.data.success) {
        setStories((prev) => [...prev, ...(res.data.stories || [])]);
        setPage(nextPage);
        setHasMore(res.data.page < res.data.pages);
      }
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedMood('All');
    setSelectedCollege('all');
    setSelectedBatch('All');
    setSortBy('trending');
  };

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedMood !== 'All' ? 1 : 0) +
    (selectedCollege !== 'all' ? 1 : 0) +
    (selectedBatch !== 'All' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* ── HEADER ── */}
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Compass className="h-3.5 w-3.5" />
          <span>Campus Tales Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Explore Stories Across Every Campus
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Search by university, hostel, category, or nostalgic mood. Real memories written by real students.
        </p>
      </div>

      {/* ── CATEGORY TILES DISCOVERY STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DISCOVERY_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(isSelected ? 'all' : cat.id);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 bg-gradient-to-br ${
                isSelected
                  ? `ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/15 ${cat.gradient}`
                  : 'glass-card hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{cat.emoji}</span>
                <Icon className="h-4 w-4 opacity-70" />
              </div>
              <div className="font-bold text-sm text-white">{cat.name}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Filter category</div>
            </div>
          );
        })}
      </div>

      {/* ── ADVANCED EXPLORER FILTER BAR ── */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
        
        {/* Row 1: Search & Sorting */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, hostels, lab, samosa, professor..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-500 text-xs sm:text-sm transition outline-none"
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

          {/* Sort Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto justify-center">
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

            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                sortBy === 'popular'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              <span>Most Loved</span>
            </button>

            <button
              onClick={() => setSortBy('latest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                sortBy === 'latest'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Newest</span>
            </button>
          </div>
        </div>

        {/* Row 2: Campus / College Quick Filter Chips */}
        {colleges.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Filter by Campus</span>
              </span>
              {selectedCollege !== 'all' && (
                <button
                  onClick={() => setSelectedCollege('all')}
                  className="text-indigo-400 hover:text-indigo-300 text-[11px]"
                >
                  Clear Campus
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCollege('all')}
                className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition ${
                  selectedCollege === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'glass-pill text-slate-300 hover:bg-slate-800'
                }`}
              >
                All Campuses
              </button>

              {colleges.map((col) => (
                <button
                  key={col.college}
                  onClick={() => setSelectedCollege(selectedCollege === col.college ? 'all' : col.college)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 transition ${
                    selectedCollege === col.college
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'glass-pill text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{col.college}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                    {col.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 3: Mood & Batch Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          
          {/* Mood chips */}
          <div className="space-y-1.5 flex-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Smile className="h-3.5 w-3.5 text-amber-400" />
              <span>Mood:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(selectedMood === m ? 'All' : m)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    selectedMood === m
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Batch Selector */}
          <div className="space-y-1.5 sm:w-48">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-sky-400" />
              <span>Graduation Batch:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {BATCHES.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBatch(selectedBatch === b ? 'All' : b)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition ${
                    selectedBatch === b
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{totalCount}</strong> stories
            {selectedCollege !== 'all' && (
              <span className="text-indigo-300"> • from {selectedCollege}</span>
            )}
            {selectedCategory !== 'all' && (
              <span className="text-indigo-300"> • {selectedCategory}</span>
            )}
            {selectedMood !== 'All' && (
              <span className="text-amber-300"> • {selectedMood}</span>
            )}
            {selectedBatch !== 'All' && (
              <span className="text-sky-300"> • Batch {selectedBatch}</span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30 flex items-center gap-1 transition"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear Filters ({activeFilterCount})</span>
            </button>
          )}
        </div>

      </div>

      {/* ── STORIES GRID ── */}
      <div>
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Discovering campus memories...</p>
          </div>
        ) : stories.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 inline-flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                      <span>Loading stories...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Load More Stories</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
            <div className="h-14 w-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <Compass className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Stories Match Your Filter Criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                We couldn't find any stories matching your selected combination of campus, category, or mood. Try clearing some filters!
              </p>
            </div>
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
