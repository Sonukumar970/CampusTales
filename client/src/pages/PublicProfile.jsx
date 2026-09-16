import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Heart,
  BookMarked,
  ArrowLeft,
  Sparkles,
  Loader2,
  Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import MemoryTimeline from '../components/MemoryTimeline';
import BadgesShowcase from '../components/BadgesShowcase';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState({ storiesCount: 0, totalLikesReceived: 0, totalBadgesUnlocked: 0 });
  const [badges, setBadges] = useState([]);
  const [stories, setStories] = useState([]);
  const [memories, setMemories] = useState([]);
  const [activeTab, setActiveTab] = useState('stories');
  const [isLoading, setIsLoading] = useState(true);

  const isOwnProfile = currentUser && currentUser._id === id;

  useEffect(() => {
    const fetchPublicProfile = async () => {
      setIsLoading(true);
      try {
        const [profileRes, memoriesRes, badgesRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/memories/user/${id}`).catch(() => ({ data: { memories: [] } })),
          api.get(`/users/${id}/badges`).catch(() => ({ data: { badges: [] } })),
        ]);

        if (profileRes.data.success) {
          setProfileUser(profileRes.data.user);
          setStats(profileRes.data.stats || { storiesCount: 0, totalLikesReceived: 0, totalBadgesUnlocked: 0 });
          setStories(profileRes.data.stories || []);
        }

        if (memoriesRes.data?.success) {
          setMemories(memoriesRes.data.memories || []);
        }

        if (badgesRes.data?.success) {
          setBadges(badgesRes.data.badges || []);
        } else if (profileRes.data?.badges) {
          setBadges(profileRes.data.badges);
        }
      } catch (err) {
        toast.error('Student profile not found.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading campus profile...</p>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      {/* ── PROFILE BANNER & DETAILS ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        {/* Ambient glow banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-600/25 via-purple-600/20 to-sky-600/20 -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  profileUser.profileImage ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    profileUser.name
                  )}&backgroundColor=6366f1`
                }
                alt={profileUser.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover bg-slate-900 ring-4 ring-slate-950 shadow-xl shadow-indigo-600/20"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>

            {/* Name & College details */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {profileUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {profileUser.role === 'admin' ? 'Campus Admin 🛡️' : 'Storyteller 🎓'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-indigo-300">
                  <BookOpen className="h-3.5 w-3.5" />
                  {profileUser.course || 'Student'} • Batch {profileUser.batch || '2025'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {profileUser.college || 'College Campus'}
                </span>
              </div>

              {profileUser.bio && (
                <p className="text-sm text-slate-300 italic pt-1 max-w-md">
                  "{profileUser.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action button if own profile */}
          {isOwnProfile && (
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Manage Your Profile</span>
            </Link>
          )}
        </div>

        {/* Public Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-white">{stats.storiesCount}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Stories Published</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-rose-400 flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 fill-current" />
              <span>{stats.totalLikesReceived}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Appreciation</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-purple-400 flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>{memories.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Milestones</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <span>🏆</span>
              <span>{badges.filter((b) => b.unlocked).length}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Badges Earned</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 col-span-2 sm:col-span-1">
            <div className="text-lg font-bold text-indigo-400 flex items-center justify-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>{profileUser.batch || '2025'}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Batch Class</div>
          </div>
        </div>
      </div>

      {/* ── GAMIFIED BADGES SHOWCASE ── */}
      {badges.length > 0 && (
        <BadgesShowcase
          badges={badges}
          totalUnlocked={badges.filter((b) => b.unlocked).length}
          totalBadges={badges.length}
        />
      )}

      {/* ── PUBLIC TABS: STORIES VS TIMELINE ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'stories'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <BookMarked className="h-3.5 w-3.5" />
            <span>Public Stories ({stories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'timeline'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>College Timeline ({memories.length})</span>
          </button>
        </div>

        {/* Stories Tab */}
        {activeTab === 'stories' && (
          <div>
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {stories.map((story) => (
                  <StoryCard key={story._id} story={story} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 border border-slate-800 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Public Stories Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {profileUser.name} hasn't published any public stories yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* College Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>{profileUser.name}'s College Journey</span>
              </h3>
              <p className="text-xs text-slate-400">
                Key campus memories and landmark milestones
              </p>
            </div>

            <MemoryTimeline
              memories={memories}
              isOwner={isOwnProfile}
              onDeleted={(id) => setMemories((prev) => prev.filter((m) => m._id !== id))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
