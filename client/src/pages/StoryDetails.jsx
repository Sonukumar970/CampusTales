import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Calendar,
  MapPin,
  Smile,
  Edit3,
  Trash2,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentsSection from '../components/CommentsSection';

const CATEGORY_STYLES = {
  Love: { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', emoji: '❤️' },
  Friendship: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', emoji: '🫂' },
  Heartbreak: { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', emoji: '💔' },
  Trips: { color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', emoji: '✈️' },
  Funny: { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', emoji: '😂' },
  Struggles: { color: 'text-slate-300 bg-slate-500/10 border-slate-500/30', emoji: '😔' },
  Growth: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', emoji: '🌱' },
  Memories: { color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', emoji: '🎓' },
};

export default function StoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStoryAndInteractions = async () => {
      try {
        const [storyRes, interactionsRes] = await Promise.all([
          api.get(`/stories/${id}`),
          api.get(`/stories/${id}/interactions`).catch(() => ({ data: { liked: false, saved: false } })),
        ]);

        if (storyRes.data.success) {
          setStory(storyRes.data.story);
          setLikeCount(storyRes.data.story.likesCount || 0);
          if (storyRes.data.story.isLiked !== undefined) {
            setIsLiked(Boolean(storyRes.data.story.isLiked));
          }
          if (storyRes.data.story.isSaved !== undefined) {
            setIsSaved(Boolean(storyRes.data.story.isSaved));
          }
        }

        if (interactionsRes.data?.success) {
          setIsLiked(Boolean(interactionsRes.data.liked));
          setIsSaved(Boolean(interactionsRes.data.saved));
        }
      } catch (err) {
        toast.error('Story not found or removed.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryAndInteractions();
  }, [id, navigate]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast('Please log in to like stories!', { icon: '❤️' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/stories/${id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.liked);
        setLikeCount(res.data.likesCount);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Could not update like.');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast('Please log in to save stories!', { icon: '🔖' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/stories/${id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.saved);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Could not update bookmark.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: story.title,
      text: `Read "${story.title}" on CampusTales!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Story link copied to clipboard! 🔗');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      const res = await api.delete(`/stories/${id}`);
      if (res.data.success) {
        toast.success('Story deleted.');
        navigate('/profile');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete story.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading story...</p>
      </div>
    );
  }

  if (!story) return null;

  const catStyle = CATEGORY_STYLES[story.category] || CATEGORY_STYLES.Memories;

  const formattedDate = story.eventDate
    ? new Date(story.eventDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      {/* Story Card Container */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 relative overflow-hidden">
        
        {/* Subtle Category Gradient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ── METADATA HEADER ── */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catStyle.color}`}
              >
                <span>{catStyle.emoji}</span>
                <span className="uppercase tracking-wider">{story.category}</span>
              </span>

              {story.circle && (
                <Link
                  to={`/circles/${story.circle.slug || story.circle}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition"
                  title={`Belongs to ${story.circle.name || 'Campus Circle'}`}
                >
                  <span>{story.circle.icon || '🌟'}</span>
                  <span>{story.circle.name || 'Circle'}</span>
                </Link>
              )}
            </div>

            {/* Owner Actions */}
            {story.isOwner && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit-story/${story._id}`}
                  className="px-3 py-1.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1 transition"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {story.title}
          </h1>

          {story.description && (
            <p className="text-base text-slate-300 italic border-l-2 border-indigo-500/60 pl-3 py-0.5">
              "{story.description}"
            </p>
          )}

          {/* Author Strip & Memory Context */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Author */}
            {story.author?._id && !story.isAnonymous ? (
              <Link
                to={`/users/${story.author._id}`}
                className="flex items-center gap-3 group/author transition hover:opacity-90"
                title={`View ${story.author.name}'s campus profile`}
              >
                <img
                  src={
                    story.author?.profileImage ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      story.author?.name || 'Student'
                    )}&backgroundColor=6366f1`
                  }
                  alt={story.author?.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-800 bg-slate-900 group-hover/author:ring-indigo-500 transition"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5 group-hover/author:text-indigo-400 transition">
                    <span>{story.author?.name}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {story.author?.college || 'College Campus'}
                    {story.author?.batch ? ` • Batch ${story.author.batch}` : ''}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={
                    story.author?.profileImage ||
                    'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=6366f1'
                  }
                  alt={story.author?.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-800 bg-slate-900"
                />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{story.author?.name || 'Anonymous 🎭'}</span>
                    {story.isAnonymous && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {story.author?.college || 'College Campus'}
                    {story.author?.batch ? ` • Batch ${story.author.batch}` : ''}
                  </div>
                </div>
              </div>
            )}

            {/* Memory Info Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {story.mood && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  {story.mood}
                </span>
              )}
              {story.location && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <MapPin className="h-3 w-3 text-rose-400" />
                  <span>{story.location}</span>
                </span>
              )}
              {formattedDate && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                  <Calendar className="h-3 w-3 text-indigo-400" />
                  <span>{formattedDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── STORY BODY NARRATIVE ── */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="prose prose-invert max-w-none text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-serif sm:font-sans">
            {story.content}
          </div>
        </div>

        {/* ── ENGAGEMENT ACTION BAR ── */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition active:scale-95 ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'glass-pill text-slate-300 hover:text-rose-400 hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount} Likes</span>
            </button>

            {/* Comments Counter Indicator */}
            <div className="px-4 py-2 rounded-xl glass-pill text-slate-300 text-xs font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>{story.commentsCount || 0} Comments</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark / Save */}
            <button
              onClick={handleSave}
              className={`p-2.5 rounded-xl text-xs font-semibold transition active:scale-95 ${
                isSaved
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'glass-pill text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isSaved ? 'Saved to bookmarks' : 'Save Story'}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-xl glass-pill text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              title="Share Story"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ── LIVE COMMENTS SECTION ── */}
        <CommentsSection
          storyId={id}
          onCommentAdded={() =>
            setStory((prev) =>
              prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev
            )
          }
          onCommentDeleted={() =>
            setStory((prev) =>
              prev
                ? { ...prev, commentsCount: Math.max(0, (prev.commentsCount || 1) - 1) }
                : prev
            )
          }
        />

      </div>
    </article>
  );
}
