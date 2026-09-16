import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Loader2,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const MILESTONE_TYPES = [
  'Orientation 🎓',
  'Exams & Sems 📚',
  'College Fest 🎸',
  'Hostel Life 🏢',
  'Road Trip ✈️',
  'Placements 💼',
  'Farewell 🌅',
  'Other ✨',
];

const ACADEMIC_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Alumni',
];

const SEMESTERS = [
  'Sem 1',
  'Sem 2',
  'Sem 3',
  'Sem 4',
  'Sem 5',
  'Sem 6',
  'Sem 7',
  'Sem 8',
];

export default function AddMemoryModal({
  isOpen,
  onClose,
  onAdded,
  userStories = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    academicYear: '1st Year',
    semester: 'Sem 1',
    milestoneType: 'Orientation 🎓',
    eventDate: new Date().toISOString().split('T')[0],
    location: '',
    description: '',
    linkedStory: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please provide a milestone title.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        linkedStory: formData.linkedStory || null,
      };

      const res = await api.post('/memories', payload);
      if (res.data.success) {
        toast.success('College milestone added! 🎓');
        if (onAdded) onAdded(res.data.memory);
        onClose();
        // Reset form
        setFormData({
          title: '',
          academicYear: '1st Year',
          semester: 'Sem 1',
          milestoneType: 'Orientation 🎓',
          eventDate: new Date().toISOString().split('T')[0],
          location: '',
          description: '',
          linkedStory: '',
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add milestone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-3xl border border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add College Milestone</h2>
              <p className="text-xs text-slate-400">Mark a landmark moment in your college journey</p>
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
        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          
          {/* Milestone Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Milestone Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="e.g. Orientation Day, 3 AM Maggi, Fest Night..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition"
            />
          </div>

          {/* Milestone Type Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Milestone Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MILESTONE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, milestoneType: type }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    formData.milestoneType === type
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-1 ring-purple-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Year & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm outline-none transition"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-slate-900 text-slate-200">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm outline-none transition"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-slate-200">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Milestone Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Location on Campus
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Canteen Stairs, Hostel 3, OAT"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Memory Reflection
              </label>
              <span className="text-[11px] text-slate-500">
                {formData.description.length}/500
              </span>
            </div>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              placeholder="What made this moment unforgettable? Who was with you?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm outline-none transition resize-none"
            />
          </div>

          {/* Optional Linked Story */}
          {userStories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Link to a Published Story (Optional)
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                  name="linkedStory"
                  value={formData.linkedStory}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 text-slate-200 text-xs sm:text-sm outline-none transition"
                >
                  <option value="" className="bg-slate-900">
                    -- No connected story --
                  </option>
                  {userStories.map((story) => (
                    <option key={story._id} value={story._id} className="bg-slate-900">
                      {story.title} ({story.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding Milestone...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Milestone</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
