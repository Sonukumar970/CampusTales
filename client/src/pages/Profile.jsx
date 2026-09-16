import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Mail,
  Heart,
  Bookmark,
  Sparkles,
  PenTool,
  Clock,
  LogOut,
  Edit3,
  Calendar,
  MapPin,
  Eye,
  Loader2,
  Trash2,
  Users,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import EditProfileModal from '../components/EditProfileModal';
import AddMemoryModal from '../components/AddMemoryModal';
import MemoryTimeline from '../components/MemoryTimeline';
import BadgesShowcase from '../components/BadgesShowcase';

export default function Profile() {
  const { user, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('stories');
  const [myStories, setMyStories] = useState([]);
  const [savedStories, setSavedStories] = useState([]);
  const [likedStories, setLikedStories] = useState([]);
  const [memories, setMemories] = useState([]);
  const [myCircles, setMyCircles] = useState([]);
  const [badgesData, setBadgesData] = useState({ badges: [], totalUnlocked: 0, totalBadges: 0 });
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingLiked, setIsLoadingLiked] = useState(true);
  const [isLoadingMemories, setIsLoadingMemories] = useState(true);
  const [isLoadingCircles, setIsLoadingCircles] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  // Fetch created stories, saved stories, liked stories, memories, circles, and badges
  useEffect(() => {
    if (!user?._id) return;

    const fetchAllData = async () => {
      try {
        const [storiesRes, savedRes, likedRes, memoriesRes, circlesRes, badgesRes] = await Promise.all([
          api.get(`/stories?author=${user._id}`),
          api.get('/users/saved-stories').catch(() => ({ data: { stories: [] } })),
          api.get('/users/liked-stories').catch(() => ({ data: { stories: [] } })),
          api.get('/memories/timeline').catch(() => ({ data: { memories: [] } })),
          api.get('/circles/my/joined').catch(() => ({ data: { circles: [] } })),
          api.get(`/users/${user._id}/badges`).catch(() => ({ data: { badges: [] } })),
        ]);

        if (storiesRes.data.success) {
          setMyStories(storiesRes.data.stories || []);
        }
        if (savedRes.data.success) {
          setSavedStories(savedRes.data.stories || []);
        }
        if (likedRes.data.success) {
          setLikedStories(likedRes.data.stories || []);
        }
        if (memoriesRes.data.success) {
          setMemories(memoriesRes.data.memories || []);
        }
        if (circlesRes.data.success) {
          setMyCircles(circlesRes.data.circles || []);
        }
        if (badgesRes.data.success) {
          setBadgesData(badgesRes.data);
        }
      } catch (err) {
        console.error('Profile data load error:', err);
      } finally {
        setIsLoadingStories(false);
        setIsLoadingSaved(false);
        setIsLoadingLiked(false);
        setIsLoadingMemories(false);
        setIsLoadingCircles(false);
      }
    };

    fetchAllData();
  }, [user?._id]);

  // Remove saved story handler
  const handleRemoveSave = async (storyId) => {
    try {
      const res = await api.post(`/stories/${storyId}/save`);
      if (res.data.success) {
        setSavedStories((prev) => prev.filter((s) => s._id !== storyId));
        toast.success('Removed from bookmarks.');
      }
    } catch (err) {
      toast.error('Failed to remove bookmark.');
    }
  };

  // Unlike story handler
  const handleUnlikeStory = async (storyId) => {
    try {
      const res = await api.post(`/stories/${storyId}/like`);
      if (res.data.success) {
        setLikedStories((prev) => prev.filter((s) => s._id !== storyId));
        toast.success('Removed from liked stories.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update like.');
    }
  };

  if (!user) {
    return null;
  }

  const totalLikesReceived = myStories.reduce(
    (acc, s) => acc + (s.likesCount || 0),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── PROFILE HEADER CARD ── */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        {/* Background glow banner */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-rose-600/20 -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative">
              <img
                src={
                  user.profileImage ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    user.name
                  )}&backgroundColor=6366f1,8b5cf6,ec4899`
                }
                alt={user.name}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover bg-slate-900 ring-4 ring-slate-950 shadow-xl shadow-indigo-600/20"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>

            {/* Name & Academic info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  {user.role === 'admin' ? 'Admin 🛡️' : 'Student 🎓'}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-indigo-300">
                  <BookOpen className="h-3.5 w-3.5" />
                  {user.course || 'MCA'} • {user.batch || '2025'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Building2 className="h-3.5 w-3.5" />
                  {user.college || 'College Campus'}
                </span>
              </div>

              <p className="text-sm text-slate-300 italic pt-1 max-w-md">
                "{user.bio || 'College life is a journey of laughter, memories, and lessons.'}"
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/80 flex items-center gap-1.5 transition active:scale-95"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Edit Profile</span>
            </button>

            <Link
              to="/create-story"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition active:scale-95"
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Write Story</span>
            </Link>

            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-white">{myStories.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Stories</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-rose-400 flex items-center justify-center gap-1">
              <Heart className="h-4 w-4 fill-current" />
              <span>{totalLikesReceived}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Likes Received</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-white">{savedStories.length}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Bookmarked</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-purple-400 flex items-center justify-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>{memories.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Milestones</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-indigo-400 flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              <span>{myCircles.length}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Circles</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="text-lg font-bold text-amber-400 flex items-center justify-center gap-1">
              <Award className="h-4 w-4" />
              <span>{badgesData.totalUnlocked}</span>
            </div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Badges</div>
          </div>
        </div>
      </div>

      {/* ── GAMIFIED BADGES SHOWCASE ── */}
      <BadgesShowcase
        badges={badgesData.badges}
        totalUnlocked={badgesData.totalUnlocked}
        totalBadges={badgesData.totalBadges}
      />

      {/* ── PROFILE TABS ── */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'stories'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>My Stories ({myStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'saved'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Stories ({savedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'liked'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Liked Stories ({likedStories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'memories'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Milestones ({memories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('circles')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'circles'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 glass-pill'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Joined Circles ({myCircles.length})</span>
          </button>
        </div>

        {/* Tab Content: My Stories */}
        {activeTab === 'stories' && (
          <div>
            {isLoadingStories ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Loading your stories...</span>
              </div>
            ) : myStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myStories.map((story) => (
                  <div
                    key={story._id}
                    className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                            {story.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                              story.status === 'draft'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}
                          >
                            {story.status === 'draft' ? 'Draft 📝' : 'Published 🟢'}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          {story.isAnonymous ? 'Anonymous 🎭' : 'Public 👤'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-indigo-400 transition">
                        <Link to={`/stories/${story._id}`}>{story.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-rose-400" /> {story.likesCount || 0}
                        </span>
                        {story.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500" /> {story.location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/stories/${story._id}`}
                          className="px-2.5 py-1 rounded-lg glass-pill hover:bg-slate-800 text-[11px] font-medium text-slate-300"
                        >
                          Read
                        </Link>
                        <Link
                          to={`/edit-story/${story._id}`}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 border border-slate-800 text-center space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <PenTool className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No Stories Published Yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Your college journey has moments worth remembering. Write your first story now!
                  </p>
                </div>
                <Link
                  to="/create-story"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition active:scale-95"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Write First Story</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Saved Stories */}
        {activeTab === 'saved' && (
          <div>
            {isLoadingSaved ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Loading saved stories...</span>
              </div>
            ) : savedStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedStories.map((story) => (
                  <div
                    key={story._id}
                    className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                          {story.category}
                        </span>
                        <button
                          onClick={() => handleRemoveSave(story._id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                          title="Remove bookmark"
                        >
                          <Bookmark className="h-3 w-3 fill-current" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-indigo-400 transition">
                        <Link to={`/stories/${story._id}`}>{story.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-slate-300">
                        {story.author?.name || 'Anonymous 🎭'}
                      </span>

                      <Link
                        to={`/stories/${story._id}`}
                        className="px-3 py-1 rounded-lg glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                      >
                        Read Story
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 border border-slate-800 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                  <Bookmark className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">No Saved Stories</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Bookmark stories you love from the home feed to read them anytime from your profile!
                </p>
                <Link
                  to="/"
                  className="inline-block mt-2 px-4 py-2 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                >
                  Explore Home Feed
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Liked Stories */}
        {activeTab === 'liked' && (
          <div>
            {isLoadingLiked ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Loading liked stories...</span>
              </div>
            ) : likedStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {likedStories.map((story) => (
                  <div
                    key={story._id}
                    className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20">
                          {story.category}
                        </span>
                        <button
                          onClick={() => handleUnlikeStory(story._id)}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                          title="Unlike story"
                        >
                          <Heart className="h-3 w-3 fill-current" />
                          <span>Liked</span>
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white hover:text-indigo-400 transition">
                        <Link to={`/stories/${story._id}`}>{story.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="text-slate-300">
                        {story.author?.name || 'Anonymous 🎭'}
                      </span>

                      <Link
                        to={`/stories/${story._id}`}
                        className="px-3 py-1 rounded-lg glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                      >
                        Read Story
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 border border-slate-800 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-rose-400 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
                <h3 className="text-lg font-bold text-white">No Liked Stories Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Tap the heart ❤️ icon on stories you love to show your appreciation and find them here!
                </p>
                <Link
                  to="/"
                  className="inline-block mt-2 px-4 py-2 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                >
                  Explore Stories
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Memories */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>College Journey Timeline ({memories.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Your landmark college moments, fests, exams, hostel memories, and career milestones
                </p>
              </div>

              <button
                onClick={() => setIsAddMemoryOpen(true)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Mark Milestone</span>
              </button>
            </div>

            {isLoadingMemories ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                <span>Loading your college milestones...</span>
              </div>
            ) : (
              <MemoryTimeline
                memories={memories}
                isOwner={true}
                onDeleted={(id) => setMemories((prev) => prev.filter((m) => m._id !== id))}
                onAddClick={() => setIsAddMemoryOpen(true)}
              />
            )}
          </div>
        )}

        {/* Tab Content: Joined Circles */}
        {activeTab === 'circles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Joined Campus Circles ({myCircles.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Micro-communities, hostel groups, and clubs where you belong and share memories
                </p>
              </div>

              <Link
                to="/circles"
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition active:scale-95"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Explore All Circles</span>
              </Link>
            </div>

            {isLoadingCircles ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span>Loading your joined circles...</span>
              </div>
            ) : myCircles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCircles.map((circle) => (
                  <div
                    key={circle._id}
                    className="glass-card rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                          {circle.icon || '🌟'}
                        </span>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                          {circle.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white hover:text-indigo-400 transition">
                        <Link to={`/circles/${circle.slug}`}>{circle.name}</Link>
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {circle.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{circle.membersCount || 0} members</span>
                      </span>

                      <Link
                        to={`/circles/${circle.slug}`}
                        className="px-3 py-1 rounded-lg glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
                      >
                        Visit Circle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-10 border border-slate-800 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">No Circles Joined Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore college circles for your hostel, tech clan, or music guild and connect with your campus tribe!
                </p>
                <Link
                  to="/circles"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition"
                >
                  Explore Campus Circles
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={(updated) => setUser(updated)}
      />

      {/* Add Memory Milestone Modal */}
      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAdded={(newMem) => setMemories((prev) => [...prev, newMem])}
        userStories={myStories}
      />
    </div>
  );
}
