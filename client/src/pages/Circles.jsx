import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Plus,
  BookOpen,
  Sparkles,
  Building2,
  Check,
  Compass,
  ArrowRight,
  Loader2,
  Filter,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CreateCircleModal from '../components/CreateCircleModal';

const CATEGORIES = [
  'All',
  'Hostel 🏢',
  'Tech & Coding 💻',
  'Arts & Lit 🎭',
  'Sports & Fitness ⚽',
  'Music & Jam 🎸',
  'Canteen & Chill ☕',
  'Placements & Career 💼',
];

export default function Circles() {
  const { user, isAuthenticated } = useAuth();
  const [circles, setCircles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch circles
  const fetchCircles = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/circles', { params });
      if (res.data.success) {
        setCircles(res.data.circles || []);
      }
    } catch (error) {
      console.error('Error loading circles:', error);
      toast.error('Failed to load campus circles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCircles();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Handle Join/Leave toggle
  const handleToggleJoin = async (circle) => {
    if (!isAuthenticated) {
      toast.error('Please log in to join campus circles!');
      return;
    }

    setTogglingId(circle._id);
    try {
      const res = await api.post(`/circles/${circle._id}/join`);
      if (res.data.success) {
        toast.success(res.data.message);
        setCircles((prev) =>
          prev.map((c) =>
            c._id === circle._id
              ? {
                  ...c,
                  isMember: res.data.isMember,
                  membersCount: res.data.membersCount,
                }
              : c
          )
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update membership.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* ── HERO BANNER ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-slate-800 bg-slate-950 overflow-hidden">
        {/* Glow ambient gradients */}
        <div className="absolute top-0 right-0 w-96 h-64 bg-indigo-600/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-48 bg-purple-600/10 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Users className="h-3.5 w-3.5" />
              <span>Campus Micro-Communities</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Find Your Tribe in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Campus Circles
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every college has unspoken corners — from late-night Maggi clubs and canteen addas, to coding clans and jamming guilds. Join a circle or build your own!
            </p>
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error('Please log in to start a circle!');
                return;
              }
              setIsCreateModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Start a Circle</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circles by name or description..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{circles.length}</strong> active campus circles
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'glass-pill text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CIRCLES GRID ── */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <span>Discovering campus circles...</span>
        </div>
      ) : circles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {circles.map((circle) => {
            const isToggling = togglingId === circle._id;

            return (
              <div
                key={circle._id}
                className="glass-card rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5"
              >
                {/* Top Banner Gradient with Big Icon */}
                <div
                  className={`h-24 bg-gradient-to-r ${circle.coverGradient || 'from-indigo-600/30 via-purple-600/20 to-pink-600/20'} p-4 flex items-end justify-between relative`}
                >
                  <div className="text-3xl p-2 rounded-2xl bg-slate-950/80 ring-2 ring-slate-900 backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform">
                    {circle.icon || '🌟'}
                  </div>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 font-semibold backdrop-blur-sm">
                    {circle.category}
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Building2 className="h-3 w-3 text-indigo-400" />
                      <span>{circle.college || 'All Campuses'}</span>
                    </div>

                    <h2 className="text-base font-bold text-white hover:text-indigo-400 transition line-clamp-1">
                      <Link to={`/circles/${circle.slug}`}>{circle.name}</Link>
                    </h2>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {circle.description}
                    </p>
                  </div>

                  {/* Stats Strip */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-indigo-400" />
                        <strong className="text-slate-200">{circle.membersCount || 0}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                        <strong className="text-slate-200">{circle.storyCount || 0}</strong> stories
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleJoin(circle)}
                        disabled={isToggling}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition active:scale-95 ${
                          circle.isMember
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : circle.isMember ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Joined</span>
                          </>
                        ) : (
                          <span>Join</span>
                        )}
                      </button>

                      <Link
                        to={`/circles/${circle.slug}`}
                        className="p-1.5 rounded-xl glass-pill hover:bg-slate-800 text-slate-400 hover:text-white transition"
                        title="View Circle Stories"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Users className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Circles Found</h3>
            <p className="text-xs text-slate-400">
              No campus communities match your current filters. Clear filters or launch a new circle!
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
            >
              Start Circle
            </button>
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      <CreateCircleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newCircle) => {
          setCircles((prev) => [newCircle, ...prev]);
        }}
      />
    </div>
  );
}
