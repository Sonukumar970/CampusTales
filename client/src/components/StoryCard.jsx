import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  MapPin,
  Calendar,
  Sparkles,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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

export default function StoryCard({ story }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(Boolean(story.isLiked));
  const [likes, setLikes] = useState(story.likesCount || 0);
  const [isSaved, setIsSaved] = useState(Boolean(story.isSaved));
  const [copied, setCopied] = useState(false);

  const catStyle = CATEGORY_STYLES[story.category] || CATEGORY_STYLES.Memories;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please log in to like stories!', { icon: '❤️' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/stories/${story._id}/like`);
      if (res.data.success) {
        setIsLiked(res.data.liked);
        setLikes(res.data.likesCount);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update like.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please log in to save stories!', { icon: '🔖' });
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/stories/${story._id}/save`);
      if (res.data.success) {
        setIsSaved(res.data.saved);
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update bookmark.');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const storyUrl = `${window.location.origin}/stories/${story._id}`;
    const shareData = {
      title: story.title,
      text: `Read "${story.title}" on CampusTales!`,
      url: storyUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(storyUrl);
    setCopied(true);
    toast.success('Story link copied! 🔗');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 transition duration-200 group">
      
      {/* Top Details & Title */}
      <div className="space-y-3">
        {/* Category & Mood pill */}
        <div className="flex items-center justify-between text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold border ${catStyle.color}`}
          >
            <span>{catStyle.emoji}</span>
            <span>{story.category}</span>
          </span>

          {story.mood && (
            <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
              {story.mood}
            </span>
          )}
        </div>

        {/* Circle Association Pill */}
        {story.circle && (
          <div className="pt-0.5">
            <Link
              to={`/circles/${story.circle.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition font-medium"
            >
              <span>{story.circle.icon || '🌟'}</span>
              <span className="truncate max-w-[200px]">{story.circle.name}</span>
            </Link>
          </div>
        )}

        {/* Title */}
        <Link to={`/stories/${story._id}`} className="block group">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-400 transition leading-snug">
            {story.title}
          </h3>
        </Link>

        {/* Teaser Description */}
        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
          "{story.description}"
        </p>

        {/* Location tag */}
        {story.location && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="h-3 w-3 text-rose-400/80" />
            <span className="truncate">{story.location}</span>
          </div>
        )}
      </div>

      {/* Footer Strip: Author & Actions */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {/* Author info */}
        {story.author?._id && !story.isAnonymous ? (
          <Link
            to={`/users/${story.author._id}`}
            className="flex items-center gap-2 max-w-[50%] truncate group/author transition hover:opacity-90"
            title={`View ${story.author.name}'s profile`}
          >
            <img
              src={
                story.author?.profileImage ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  story.author?.name || 'Student'
                )}&backgroundColor=6366f1`
              }
              alt={story.author?.name}
              className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-700 bg-slate-900 shrink-0 group-hover/author:ring-indigo-500 transition"
            />
            <div className="truncate">
              <div className="font-semibold text-slate-300 truncate text-[11px] group-hover/author:text-indigo-400 transition">
                {story.author?.name}
              </div>
              {story.author?.college && (
                <div className="text-[10px] text-slate-500 truncate">
                  {story.author.college}
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 max-w-[50%] truncate">
            <img
              src={
                story.author?.profileImage ||
                'https://api.dicebear.com/7.x/bottts/svg?seed=anonymous&backgroundColor=6366f1'
              }
              alt={story.author?.name}
              className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-700 bg-slate-900 shrink-0"
            />
            <div className="truncate">
              <div className="font-semibold text-slate-300 truncate text-[11px]">
                {story.author?.name || 'Anonymous 🎭'}
              </div>
            </div>
          </div>
        )}

        {/* Engagement Controls */}
        <div className="flex items-center gap-2">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
              isLiked
                ? 'text-rose-400 bg-rose-500/10'
                : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
            }`}
            title="Like story"
          >
            <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-[11px]">{likes}</span>
          </button>

          {/* Comment */}
          <Link
            to={`/stories/${story._id}`}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition"
            title="View discussion"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-[11px]">{story.commentsCount || 0}</span>
          </Link>

          {/* Bookmark */}
          <button
            onClick={handleSave}
            className={`p-1.5 rounded-lg transition ${
              isSaved
                ? 'text-indigo-400 bg-indigo-500/10'
                : 'text-slate-500 hover:text-white hover:bg-slate-800/60'
            }`}
            title={isSaved ? 'Saved' : 'Bookmark story'}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/60 transition"
            title="Copy link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
        </div>

      </div>
    </div>
  );
}
