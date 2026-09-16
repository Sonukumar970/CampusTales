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
  Activity,
  CheckCircle2,
  Database,
  Server,
  ArrowRight,
  RefreshCw,
  Compass,
  PenTool,
  Loader2,
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

  // Health status
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealthStatus = async (showToast = false) => {
    setLoadingHealth(true);
    try {
      const response = await api.get('/health');
      setHealthData(response.data);
      setLastChecked(new Date().toLocaleTimeString());
      if (showToast) {
        toast.success('🎉 Express API & Server are running perfectly!', {
          id: 'health-toast',
        });
      }
    } catch (err) {
      console.error('API health check error:', err);
      setHealthData({
        success: false,
        message: 'Could not connect to Express backend.',
      });
      if (showToast) {
        toast.error('❌ Server unreachable on port 5000', { id: 'health-toast' });
      }
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

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

      {/* ── LIVE ARCHITECTURE STATUS CARD ── */}
      <section className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>MERN Architecture & Live Status</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end communication between React client, Express API, and Mongoose stories collection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Last Ping: <strong className="text-slate-200 font-mono">{lastChecked || 'Checking...'}</strong></span>
            <button
              onClick={() => fetchHealthStatus(true)}
              disabled={loadingHealth}
              className="p-1.5 rounded-lg glass-pill hover:bg-slate-800 text-slate-300 transition"
              title="Ping Backend"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingHealth ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          {/* Step 1: React Vite */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Frontend Client</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">React 19 + Vite</div>
            <p className="text-xs text-slate-400">Story Cards, FeedFilters, Category Explorer, and Real-Time Search.</p>
          </div>

          {/* Step 2: Express Server */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Backend API</span>
              <span className={`h-2 w-2 rounded-full ${healthData?.success ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-400" />
              <span>Express + Story CRUD</span>
            </div>
            <p className="text-xs text-slate-400">
              {healthData?.success ? `Port 5000: Stories API with search & sorting` : 'Starting on port 5000'}
            </p>
          </div>

          {/* Step 3: MongoDB */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Layer</span>
              <span className={`h-2 w-2 rounded-full ${healthData?.database?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-400" />
              <span>MongoDB Active</span>
            </div>
            <p className="text-xs text-slate-400">
              {healthData?.database?.connected
                ? `Status: Connected (${totalCount} stories indexed)`
                : 'Connecting to MongoDB'}
            </p>
          </div>
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
            <p className="text-xs text-slate-400">Loading stories from MongoDB...</p>
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

      {/* ── DEVELOPMENT ROADMAP ── */}
      <section className="glass-card rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-1">CampusTales Development Roadmap</h2>
        <p className="text-xs text-slate-400 mb-6">Following the PRD step-by-step development strategy.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Phase 1: Foundation</span>
            </div>
            <div className="text-[11px] text-emerald-400/80">Features 1–6 (Done)</div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Phase 2: Auth</span>
            </div>
            <div className="text-[11px] text-emerald-400/80">Features 7–14 (Done)</div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Phase 3: Stories</span>
            </div>
            <div className="text-[11px] text-emerald-400/80">Features 15–22 (Done)</div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Phase 4: Feed & Explore</span>
            </div>
            <div className="text-[11px] text-indigo-400/80">Features 23–29 (Active)</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 space-y-1">
            <div className="font-bold">Phases 5–10: Social & Admin</div>
            <div className="text-[11px] text-slate-500">Features 30–65</div>
          </div>
        </div>
      </section>
    </main>
  );
}
