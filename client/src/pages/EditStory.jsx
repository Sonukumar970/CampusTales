import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Trash2,
  Calendar,
  MapPin,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Love',
  'Friendship',
  'Heartbreak',
  'Trips',
  'Funny',
  'Struggles',
  'Growth',
  'Memories',
];

const MOODS = [
  '😊 Nostalgic',
  '❤️ In Love',
  '🥳 Excited',
  '😂 Hilarious',
  '🥺 Emotional',
  '💔 Heartbroken',
  '🌱 Inspired',
  '😔 Thoughtful',
];

export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Memories',
    mood: '😊 Nostalgic',
    location: '',
    eventDate: '',
    isAnonymous: false,
    status: 'published',
  });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${id}`);
        if (res.data.success) {
          const s = res.data.story;

          if (!s.isOwner) {
            toast.error('You do not have permission to edit this story.');
            navigate(`/stories/${id}`);
            return;
          }

          setFormData({
            title: s.title || '',
            description: s.description || '',
            content: s.content || '',
            category: s.category || 'Memories',
            mood: s.mood || '😊 Nostalgic',
            location: s.location || '',
            eventDate: s.eventDate ? s.eventDate.split('T')[0] : '',
            isAnonymous: Boolean(s.isAnonymous),
            status: s.status || 'published',
          });
        }
      } catch (err) {
        toast.error('Could not load story for editing.');
        navigate('/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and story content cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put(`/stories/${id}`, formData);
      if (res.data.success) {
        toast.success('Story updated successfully! ✨');
        navigate(`/stories/${id}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update story.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await api.delete(`/stories/${id}`);
      if (res.data.success) {
        toast.success('Story deleted successfully.');
        navigate('/profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete story.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading story details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl glass-pill hover:bg-slate-800 text-slate-300 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Your Story</h1>
            <p className="text-xs text-slate-400">Update story details, memory information, or privacy.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Story</span>
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleChange('category', cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    formData.category === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'glass-pill text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm font-medium transition outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Short Description / Preview
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm transition outline-none resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Story Content
            </label>
            <textarea
              rows={10}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm leading-relaxed transition outline-none resize-y"
            />
          </div>

          {/* Memory Details: Mood, Location, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mood
              </label>
              <select
                value={formData.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Campus spot or city"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Memory Date
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Publish as Anonymous 🎭</span>
              </div>
              <p className="text-xs text-slate-400">
                When active, your name and avatar are masked from other students.
              </p>
            </div>
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => handleChange('isAnonymous', e.target.checked)}
              className="h-5 w-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
