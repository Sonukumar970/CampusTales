import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, Trash2, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommentsSection({
  storyId,
  onCommentAdded,
  onCommentDeleted,
}) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/stories/${storyId}/comments`);
        if (res.data.success) {
          setComments(res.data.comments || []);
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [storyId]);

  // Handle post comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast('Please log in to join the discussion!', { icon: '💬' });
      navigate('/login');
      return;
    }

    if (!content.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/stories/${storyId}/comments`, {
        content: content.trim(),
      });

      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setContent('');
        toast.success('Comment posted! 💬');
        if (typeof onCommentAdded === 'function') {
          onCommentAdded(res.data.comment);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete your comment?')) return;

    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success('Comment deleted.');
        if (typeof onCommentDeleted === 'function') {
          onCommentDeleted(commentId);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment.');
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-800/80">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <span>Campus Discussion ({comments.length})</span>
        </h3>
        <span className="text-xs text-slate-500">Kindness & college spirit expected</span>
      </div>

      {/* Post comment input */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isAuthenticated
                ? `Share your thoughts or similar experience, ${user?.name}...`
                : 'Log in to join the conversation...'
            }
            maxLength={500}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-xs sm:text-sm transition outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{content.length}/500</span>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition active:scale-95 disabled:opacity-40"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {isLoading ? (
          <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Loading comments...</span>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      comment.author?.profileImage ||
                      'https://api.dicebear.com/7.x/initials/svg?seed=Student'
                    }
                    alt={comment.author?.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-700 bg-slate-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      {comment.author?.name || 'Fellow Student'}
                    </div>
                    {comment.author?.college && (
                      <div className="text-[10px] text-slate-500">
                        {comment.author.college}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>

                  {comment.isOwner && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 pl-9 leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No comments yet. Be the first to share your reaction!
          </div>
        )}
      </div>
    </div>
  );
}
