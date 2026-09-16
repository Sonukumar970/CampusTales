import React, { useState } from 'react';
import { X, Users, Sparkles, Building2, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Hostel 🏢',
  'Tech & Coding 💻',
  'Arts & Lit 🎭',
  'Sports & Fitness ⚽',
  'Music & Jam 🎸',
  'Canteen & Chill ☕',
  'Placements & Career 💼',
  'General 🌟',
];

const ICONS = ['🏢', '💻', '📖', '☕', '💼', '🎸', '⚽', '🎭', '🌟', '🚀', '🍕', '✨', '🔥', '🎯'];

const GRADIENTS = [
  { id: 'indigo-purple', label: 'Indigo Purple', class: 'from-indigo-600/30 via-purple-600/20 to-pink-600/20' },
  { id: 'amber-rose', label: 'Warm Sunset', class: 'from-amber-500/20 via-orange-500/20 to-rose-500/20' },
  { id: 'emerald-teal', label: 'Fresh Green', class: 'from-emerald-500/20 via-teal-500/20 to-sky-500/20' },
  { id: 'violet-fuchsia', label: 'Neon Jam', class: 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20' },
  { id: 'sky-blue', label: 'Ocean Code', class: 'from-sky-500/20 via-blue-500/20 to-indigo-500/20' },
];

export default function CreateCircleModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hostel 🏢',
    college: user?.college || 'All Campuses',
    icon: '🏢',
    coverGradient: 'from-indigo-600/30 via-purple-600/20 to-pink-600/20',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter a circle name.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please enter a short description for your community.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/circles', formData);
      if (res.data.success) {
        toast.success(res.data.message || '🎉 Circle created successfully!');
        if (onCreated) onCreated(res.data.circle);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create circle.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white glass-pill transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Users className="h-3.5 w-3.5" />
            <span>Campus Micro-Community</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Launch a Campus Circle
          </h2>
          <p className="text-xs text-slate-400">
            Build a space for your hostel wing, department, club, or late-night gang.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Circle Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Circle Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={60}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Hostel Block B Legends, Code & Coffee Club"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Category Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
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

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Circle Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`h-9 w-9 rounded-xl text-lg flex items-center justify-center transition ${
                    formData.icon === emoji
                      ? 'bg-indigo-600 ring-2 ring-indigo-400 scale-105'
                      : 'glass-pill hover:bg-slate-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* College Campus */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              College Campus
            </label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="e.g. NIT Patna, Delhi University, or 'All Campuses'"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Purpose & Vibe <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500">{formData.description.length}/400</span>
            </div>
            <textarea
              rows={3}
              required
              maxLength={400}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What makes this circle special? What stories and memories belong here?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
            />
          </div>

          {/* Theme Gradient */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Card Banner Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, coverGradient: g.class })}
                  className={`p-2 rounded-xl text-left border transition text-xs flex items-center gap-2 ${
                    formData.coverGradient === g.class
                      ? 'border-indigo-500 bg-slate-900 text-white'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${g.class}`} />
                  <span className="truncate">{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white glass-pill transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Launching Circle...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Create Circle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
