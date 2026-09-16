import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  BookOpen,
  Calendar,
  Sparkles,
  Loader2,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PRESET_AVATARS = [
  {
    name: 'Tech Bot',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Techie&backgroundColor=6366f1',
  },
  {
    name: 'Campus Cool',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=8b5cf6',
  },
  {
    name: 'Scholar',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Harper&backgroundColor=ec4899',
  },
  {
    name: 'Creative',
    url: 'https://api.dicebear.com/7.x/personas/svg?seed=CreativeSpirit&backgroundColor=10b981',
  },
  {
    name: 'Casual',
    url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=CollegeVibes&backgroundColor=f59e0b',
  },
];

export default function EditProfileModal({ isOpen, onClose, onUpdated }) {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    batch: user?.batch || new Date().getFullYear(),
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPresetAvatar = (url) => {
    setFormData((prev) => ({ ...prev, profileImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.college.trim()) {
      toast.error('Name and College are required.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully! ✨');
        if (onUpdated) onUpdated(res.data.user);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Customize Campus Profile</h2>
              <p className="text-xs text-slate-400">Update your student info and storytelling persona</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 pt-5">
          
          {/* Avatar Selection Section */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Profile Avatar
            </label>

            <div className="flex items-center gap-4">
              <img
                src={
                  formData.profileImage ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    formData.name || 'Student'
                  )}&backgroundColor=6366f1`
                }
                alt="Avatar preview"
                className="h-16 w-16 rounded-2xl object-cover bg-slate-900 ring-2 ring-indigo-500 shadow-md shadow-indigo-600/20"
              />

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(preset.url)}
                      className={`h-9 w-9 rounded-xl overflow-hidden border transition p-0.5 ${
                        formData.profileImage === preset.url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="h-full w-full rounded-lg object-cover bg-slate-900"
                      />
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="Or paste custom image / avatar URL"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 placeholder-slate-500 text-xs transition outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Name & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Sonu Kumar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                College / University *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  placeholder="NIT Patna, Delhi University..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Course & Graduation Batch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Course / Major
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="MCA, B.Tech CSE, Literature..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Graduation Batch (Year)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="number"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  min={1980}
                  max={2035}
                  placeholder="2025"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Campus Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Campus Bio
              </label>
              <span className="text-[11px] text-slate-500">
                {formData.bio.length}/200
              </span>
            </div>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={200}
              placeholder="A one-liner about your college journey, passions, or memories..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
