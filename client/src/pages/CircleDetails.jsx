import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  BookOpen,
  PenTool,
  Check,
  ArrowLeft,
  Loader2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

export default function CircleDetails() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState('stories');
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingJoin, setIsTogglingJoin] = useState(false);

  useEffect(() => {
    const fetchCircleData = async () => {
      try {
        setIsLoading(true);
        const [circleRes, storiesRes] = await Promise.all([
          api.get(`/circles/${slug}`),
          api.get(`/circles/${slug}/stories`),
        ]);

        if (circleRes.data.success) {
          setCircle(circleRes.data.circle);
        }
        if (storiesRes.data.success) {
          setStories(storiesRes.data.stories || []);
        }
      } catch (err) {
        console.error('Error fetching circle details:', err);
        toast.error('Could not find this campus circle.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleData();
  }, [slug]);

  const handleToggleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to join this circle!');
      navigate('/login');
      return;
    }

    if (!circle) return;

    setIsTogglingJoin(true);
    try {
      const res = await api.post(`/circles/${circle._id}/join`);
      if (res.data.success) {
        toast.success(res.data.message);
        setCircle((prev) => ({
          ...prev,
          isMember: res.data.isMember,
          membersCount: res.data.membersCount,
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update membership.');
    } finally {
      setIsTogglingJoin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <span>Loading community circle...</span>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Circle Not Found</h2>
        <p className="text-xs text-slate-400">
          This campus circle might have been renamed or removed.
        </p>
        <Link
          to="/circles"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Circles</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Circles Nav */}
      <Link
        to="/circles"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>All Campus Circles</span>
      </Link>

      {/* ── HERO BANNER ── */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden relative">
        {/* Banner Gradient Header */}
        <div
          className={`h-40 sm:h-52 bg-gradient-to-r ${circle.coverGradient || 'from-indigo-600/30 via-purple-600/20 to-pink-600/20'} p-6 sm:p-8 flex flex-col justify-between relative`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-200 font-semibold backdrop-blur-md">
              {circle.category}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-white/90 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <Building2 className="h-3.5 w-3.5 text-indigo-300" />
              <span>{circle.college || 'All Campuses'}</span>
            </div>
          </div>
        </div>

        {/* Hero Content Body */}
        <div className="p-6 sm:p-8 space-y-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex items-end gap-5">
              {/* Big Circle Icon Avatar */}
              <div className="h-24 w-24 rounded-3xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-slate-950 shrink-0">
                {circle.icon || '🌟'}
              </div>

              {/* Title & Metadata */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {circle.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  {circle.creator && (
                    <span>
                      Founded by{' '}
                      <strong className="text-slate-200">{circle.creator.name}</strong>
                    </span>
                  )}
                  <span>•</span>
                  <span>{circle.college}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Join & Share Story */}
            <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto">
              <button
                onClick={handleToggleJoin}
                disabled={isTogglingJoin}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 ${
                  circle.isMember
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/25'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                }`}
              >
                {isTogglingJoin ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : circle.isMember ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Member</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Join Circle</span>
                  </>
                )}
              </button>

              <Link
                to={`/create-story?circle=${circle._id}`}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <PenTool className="h-4 w-4" />
                <span>Share Story</span>
              </Link>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {circle.description}
          </p>

          {/* Quick Stats Strip */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-400" />
              <strong className="text-white text-sm">{circle.membersCount || 0}</strong>
              <span>Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-purple-400" />
              <strong className="text-white text-sm">{stories.length}</strong>
              <span>Stories Shared</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'stories'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Stories in this Circle ({stories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'about'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'glass-pill text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>About & Guidelines</span>
          </button>
        </div>

        {/* Tab 1: Stories */}
        {activeTab === 'stories' && (
          <div>
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stories.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-md mx-auto">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <PenTool className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Stories in this Circle Yet</h3>
                  <p className="text-xs text-slate-400">
                    Be the first student to immortalize a memory in {circle.name}!
                  </p>
                </div>
                <Link
                  to={`/create-story?circle=${circle._id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition active:scale-95"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Write First Story</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About & Guidelines */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span>Community Guidelines for {circle.name}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">1. Authentic Campus Tales</div>
                  <p className="text-slate-400">
                    Stories should be grounded in real college moments, experiences, and emotions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">2. Respect Privacy & Freedom</div>
                  <p className="text-slate-400">
                    Publish openly or choose the Anonymous 🎭 mode whenever you want to share vulnerable memories safely.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">3. Uplift & Support</div>
                  <p className="text-slate-400">
                    Leave thoughtful comments and cheer on your campus peers as they preserve their 4-year journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Circle Admin / Creator Info */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 h-fit">
              <h3 className="text-sm font-bold text-white">Circle Organizer</h3>
              {circle.creator && (
                <div className="flex items-center gap-3">
                  <img
                    src={
                      circle.creator.profileImage ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        circle.creator.name
                      )}`
                    }
                    alt={circle.creator.name}
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-indigo-500/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{circle.creator.name}</div>
                    <div className="text-[11px] text-slate-400">{circle.creator.college}</div>
                  </div>
                </div>
              )}
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                Created on {new Date(circle.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
