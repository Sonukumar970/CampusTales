import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Heart,
  Users,
  HeartCrack,
  Plane,
  Laugh,
  Frown,
  Sprout,
  BookOpen,
  Calendar,
  MapPin,
  Smile,
  Shield,
  EyeOff,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  PenTool,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { id: 'Love', name: 'Love', emoji: '❤️', icon: Heart, desc: 'College romance, secret crushes & first dates', color: 'from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-300' },
  { id: 'Friendship', name: 'Friendship', emoji: '🫂', icon: Users, desc: 'Late night talks, canteen gang & roomies', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300' },
  { id: 'Heartbreak', name: 'Heartbreak', emoji: '💔', icon: HeartCrack, desc: 'Letting go, goodbyes & painful endings', color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300' },
  { id: 'Trips', name: 'Trips', emoji: '✈️', icon: Plane, desc: 'Goa plans, hill treks & spontaneous getaways', color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/40 text-sky-300' },
  { id: 'Funny', name: 'Funny', emoji: '😂', icon: Laugh, desc: 'Hostel pranks, exam mishaps & epic moments', color: 'from-yellow-500/20 to-lime-500/20 border-yellow-500/40 text-yellow-300' },
  { id: 'Struggles', name: 'Struggles', emoji: '😔', icon: Frown, desc: 'Placement stress, backlogs & tough phases', color: 'from-slate-500/20 to-zinc-500/20 border-slate-500/40 text-slate-300' },
  { id: 'Growth', name: 'Growth', emoji: '🌱', icon: Sprout, desc: 'Overcoming fear, self-discovery & maturity', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300' },
  { id: 'Memories', name: 'Memories', emoji: '🎓', icon: BookOpen, desc: 'Orientation, fests, convocation & golden days', color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-300' },
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

export default function CreateStory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const circleParam = searchParams.get('circle');

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCircles, setAvailableCircles] = useState([]);

  const [formData, setFormData] = useState({
    category: 'Memories',
    title: '',
    description: '',
    content: '',
    mood: '😊 Nostalgic',
    location: '',
    eventDate: new Date().toISOString().split('T')[0],
    isAnonymous: false,
    status: 'published',
    circle: circleParam || '',
  });

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const res = await api.get('/circles');
        if (res.data.success) {
          setAvailableCircles(res.data.circles || []);
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchCircles();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.category) {
        toast.error('Please select a story category.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.title.trim()) {
        toast.error('Please give your story a catchy title.');
        return false;
      }
      if (!formData.description.trim()) {
        toast.error('Please add a short preview description.');
        return false;
      }
      if (!formData.content.trim()) {
        toast.error('Story content cannot be empty.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (publishStatus = 'published') => {
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: publishStatus,
      };

      const response = await api.post('/stories', payload);
      if (response.data.success) {
        toast.success(
          publishStatus === 'published'
            ? '🎉 Story published to campus successfully!'
            : '📝 Story saved as draft!',
          { id: 'story-toast' }
        );
        navigate(`/stories/${response.data.story._id}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to publish story.', { id: 'story-toast' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <PenTool className="h-3.5 w-3.5" />
            <span>Story Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Share Your College Story
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Write, connect, and immortalize the memories that defined your journey.
          </p>
        </div>

        {/* Stepper progress indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-8 w-8 rounded-xl flex items-center justify-center transition ${
                step === s
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : step > s
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
              }`}
            >
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
          ))}
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium text-slate-400">
        <span className={step === 1 ? 'text-indigo-400 font-bold' : ''}>1. Category</span>
        <span className={step === 2 ? 'text-indigo-400 font-bold' : ''}>2. Story</span>
        <span className={step === 3 ? 'text-indigo-400 font-bold' : ''}>3. Memory Info</span>
        <span className={step === 4 ? 'text-indigo-400 font-bold' : ''}>4. Privacy & Publish</span>
      </div>

      {/* ── STEP 1: CATEGORY SELECTION ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Step 1 — Choose a Category</h2>
            <p className="text-xs text-slate-400">What kind of college tale are you sharing today?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleChange('category', cat.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-900 ring-2 ring-indigo-500 ${cat.color} shadow-lg shadow-indigo-500/10`
                      : 'glass-card hover:bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{cat.emoji}</span>
                    <Icon className="h-5 w-5 opacity-80" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-base text-white">{cat.name}</div>
                    <div className="text-xs text-slate-400 leading-snug">{cat.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 2: STORY INFORMATION ── */}
      {step === 2 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Step 2 — Story Narrative</h2>
            <p className="text-xs text-slate-400">Craft your title, hook, and full memory.</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Story Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. How I Met My Best Friend on Orientation Day"
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-base font-medium transition outline-none"
            />
            <div className="text-right text-[11px] text-slate-500 mt-1">
              {formData.title.length}/150
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Short Hook / Preview <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="A 1-2 sentence hook that appears on feed cards..."
              maxLength={350}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm transition outline-none resize-none"
            />
            <div className="text-right text-[11px] text-slate-500 mt-1">
              {formData.description.length}/350
            </div>
          </div>

          {/* Full Content */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Story Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={10}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="It was my first week of college. The rain was pouring down, and I had lost my way to the computer science department..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm leading-relaxed transition outline-none resize-y"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Write freely — markdown and paragraphs supported.</span>
              <span>{formData.content.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: MEMORY DETAILS ── */}
      {step === 3 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Step 3 — When & Where Did It Happen?</h2>
            <p className="text-xs text-slate-400">Contextualize the memory with dates, mood, and location.</p>
          </div>

          {/* Mood selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Memory Mood
            </label>
            <div className="flex flex-wrap gap-2.5">
              {MOODS.map((mood) => {
                const isSelected = formData.mood === mood;
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => handleChange('mood', mood)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'glass-pill text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mood}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Where did it happen?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. Canteen stairs, Room 204, Manali"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 text-sm transition outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                When did it happen?
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleChange('eventDate', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm transition outline-none"
                />
              </div>
            </div>
          </div>

          {/* Optional Campus Circle Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Post to Campus Circle (Optional)
            </label>
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
              <select
                value={formData.circle}
                onChange={(e) => handleChange('circle', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-sm transition outline-none cursor-pointer"
              >
                <option value="">🌐 None (Post to Global Feed Only)</option>
                {availableCircles.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.icon} {c.name} ({c.college})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Select a micro-community circle to share this memory with specific hostel, club, or batch mates.
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 4: PRIVACY & PUBLISHING ── */}
      {step === 4 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Step 4 — Privacy & Ownership</h2>
            <p className="text-xs text-slate-400">
              Decide whether to publish with your name or anonymously.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Public Option */}
            <div
              onClick={() => handleChange('isAnonymous', false)}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                !formData.isAnonymous
                  ? 'bg-indigo-500/10 border-indigo-500 text-white'
                  : 'glass-card border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <User className="h-6 w-6 text-indigo-400" />
                {!formData.isAnonymous && <CheckCircle2 className="h-5 w-5 text-indigo-400" />}
              </div>
              <div className="font-bold text-base text-white">Publish as {user?.name || 'Your Name'}</div>
              <p className="text-xs text-slate-400 mt-1">
                Your name, college, and profile avatar will be visible on the story.
              </p>
            </div>

            {/* Anonymous Option */}
            <div
              onClick={() => handleChange('isAnonymous', true)}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                formData.isAnonymous
                  ? 'bg-purple-500/10 border-purple-500 text-white'
                  : 'glass-card border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🎭</span>
                {formData.isAnonymous && <CheckCircle2 className="h-5 w-5 text-purple-400" />}
              </div>
              <div className="font-bold text-base text-white">Publish Anonymously 🎭</div>
              <p className="text-xs text-slate-400 mt-1">
                Your identity is hidden as "By Anonymous 🎭". You retain editing & deletion control.
              </p>
            </div>
          </div>

          {/* Summary Preview Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <div className="text-slate-400 uppercase tracking-wider font-bold">Story Overview:</div>
            <div className="text-sm font-semibold text-white">{formData.title}</div>
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <span>Category: <strong>{formData.category}</strong></span>
              <span>•</span>
              <span>Mood: <strong>{formData.mood}</strong></span>
              <span>•</span>
              <span>Privacy: <strong>{formData.isAnonymous ? 'Anonymous 🎭' : user?.name}</strong></span>
              {formData.circle && availableCircles.find((c) => c._id === formData.circle) && (
                <>
                  <span>•</span>
                  <span className="text-indigo-300">
                    Circle: <strong>{availableCircles.find((c) => c._id === formData.circle).icon} {availableCircles.find((c) => c._id === formData.circle).name}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {step === 4 ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl glass-pill hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmit('published')}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Publish Story 🚀</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
