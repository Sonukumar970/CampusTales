import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Heart,
  Users,
  Plane,
  Laugh,
  HeartCrack,
  Frown,
  Sprout,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Compass,
  PenTool,
  Loader2,
  Shield,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import FeedFilters from '../components/FeedFilters';

const CATEGORIES = [
  { id: 'Love', name: 'Love', emoji: '❤️', icon: Heart, count: 48, gradient: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400' },
  { id: 'Friendship', name: 'Friendship', emoji: '🫂', icon: Users, count: 86, gradient: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400' },
  { id: 'Trips', name: 'Trips', emoji: '✈️', icon: Plane, count: 32, gradient: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-400' },
  { id: 'Funny', name: 'Funny', emoji: '😂', icon: Laugh, count: 64, gradient: 'from-yellow-500/20 to-lime-500/20 border-yellow-500/30 text-yellow-400' },
  { id: 'Heartbreak', name: 'Heartbreak', emoji: '💔', icon: HeartCrack, count: 29, gradient: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400' },
  { id: 'Struggles', name: 'Struggles', emoji: '😔', icon: Frown, count: 41, gradient: 'from-slate-500/20 to-zinc-500/20 border-slate-500/30 text-slate-300' },
  { id: 'Growth', name: 'Growth', emoji: '🌱', icon: Sprout, count: 53, gradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400' },
  { id: 'Memories', name: 'Memories', emoji: '🎓', icon: BookOpen, count: 112, gradient: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Feed states
  const [stories, setStories] = useState([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch stories with debounced search and filters
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoadingStories(true);
      setPage(1);

      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (search.trim()) params.append('search', search.trim());
        params.append('sort', sortBy);
        params.append('page', '1');
        params.append('limit', '6');

        const res = await api.get(`/stories?${params.toString()}`);
        if (res.data.success) {
          setStories(res.data.stories || []);
          setTotalCount(res.data.total || 0);
          setHasMore(res.data.page < res.data.pages);
        }
      } catch (err) {
        console.error('Home feed fetch error:', err);
      } finally {
        setIsLoadingStories(false);
      }
    };

    const debounceTimer = setTimeout(fetchStories, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, selectedCategory, sortBy]);

  // Load More stories handler
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (search.trim()) params.append('search', search.trim());
      params.append('sort', sortBy);
      params.append('page', nextPage.toString());
      params.append('limit', '6');

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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-16">
      
      {/* ── HERO SECTION ── */}
      <section className="text-center pt-8 pb-4 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>College ends. Stories stay.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Share the moments that{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            shaped your college life.
          </span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          CampusTales is a centralized storytelling platform for students & alumni. 
          Publish personal memories, hostel confessions, late-night triumphs, or anonymous stories with full privacy.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/create-story');
              } else {
                toast('Please sign up or log in to share stories!', { icon: '🔐' });
                navigate('/register');
              }
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition active:scale-95"
          >
            <PenTool className="h-4 w-4" />
            <span>Share Your Story</span>
          </button>

          <Link
            to="/explore"
            className="px-6 py-3.5 rounded-xl glass-pill hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center gap-2 transition"
          >
            <Compass className="h-4 w-4" />
            <span>Explore All Stories</span>
          </Link>
        </div>
      </section>

      {/* ── PLATFORM HIGHLIGHTS STRIP ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
            🎭
          </div>
          <h3 className="text-sm font-bold text-white">Anonymous Freedom</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Share sensitive confessions, crush stories, or exam chaos with total identity protection.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
            🏢
          </div>
          <h3 className="text-sm font-bold text-white">Campus Circles</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Join micro-communities for your hostel block, coding club, literary society, or canteen gang.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
            🎓
          </div>
          <h3 className="text-sm font-bold text-white">4-Year Journey</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Preserve your college roadmap from Sem 1 orientation to Sem 8 convocation chronologically.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
            🏆
          </div>
          <h3 className="text-sm font-bold text-white">Storyteller Badges</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Earn achievements like Campus Legend, Hostel Chronicler, and Milestone Pioneer as you write.
          </p>
        </div>
      </section>

      {/* ── LIVE HOME FEED SECTION ── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Campus Stories Feed
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Recent memories, hostel laughter, trips, and heartfelt stories from students.
            </p>
          </div>

          <Link
            to="/explore"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>Explore All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filters & Search Component */}
        <FeedFilters
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={totalCount}
        />

        {/* Stories Grid */}
        {isLoadingStories ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading stories from campus...</p>
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
                      <span>Loading more stories...</span>
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
          <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-800">
            <div className="h-12 w-12 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">No stories match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for something else, or be the first to publish a story in this category!
            </p>
            <Link
              to="/create-story"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition"
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Share Story</span>
            </Link>
          </div>
        )}
      </section>

      {/* ── CATEGORIES OVERVIEW GRID ── */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Explore by Category</h2>
            <p className="text-slate-400 text-sm">Every college experience has a place here.</p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View all categories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  window.scrollTo({ top: 750, behavior: 'smooth' });
                }}
                className={`p-4 rounded-xl border bg-gradient-to-br ${cat.gradient} cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition" />
                </div>
                <div className="font-bold text-white text-base">{cat.name}</div>
                <div className="text-xs opacity-75">{cat.count} memories</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-6 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-48 bg-indigo-600/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-48 bg-purple-600/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <GraduationCap className="h-4 w-4" />
            <span>Preserve Your College Journey</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Every college story deserves to stay alive.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Four years fly by in the blink of an eye. The laughter in hostel corridors, the 3 AM Maggi noodles, the proxy roll calls, and the convocation hugs—don't let them fade away.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              if (isAuthenticated) {
                navigate('/create-story');
              } else {
                navigate('/register');
              }
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95"
          >
            <PenTool className="h-4 w-4" />
            <span>Start Writing Today</span>
          </button>

          <Link
            to="/circles"
            className="px-6 py-3 rounded-xl glass-pill hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
          >
            <Users className="h-4 w-4 text-purple-400" />
            <span>Explore Campus Circles</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
