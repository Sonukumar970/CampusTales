import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  BookOpen,
  Trash2,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const MILESTONE_COLORS = {
  'Orientation 🎓': 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
  'Exams & Sems 📚': 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  'College Fest 🎸': 'border-rose-500/40 bg-rose-500/10 text-rose-300',
  'Hostel Life 🏢': 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  'Road Trip ✈️': 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  'Placements 💼': 'border-violet-500/40 bg-violet-500/10 text-violet-300',
  'Farewell 🌅': 'border-orange-500/40 bg-orange-500/10 text-orange-300',
  'Other ✨': 'border-purple-500/40 bg-purple-500/10 text-purple-300',
};

export default function MemoryTimeline({
  memories = [],
  isOwner = false,
  onDeleted,
  onAddClick,
}) {
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this milestone from your college timeline?')) {
      return;
    }

    try {
      const res = await api.delete(`/memories/${id}`);
      if (res.data.success) {
        toast.success('Milestone removed.');
        if (onDeleted) onDeleted(id);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete milestone.');
    }
  };

  if (!memories || memories.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
        <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
          <GraduationCap className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No College Milestones Marked Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            Every college journey is a constellation of memories — your first orientation, hostel Maggi, fests, exams, and farewell.
          </p>
        </div>
        {isOwner && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 transition active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Mark First Milestone</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-500 before:to-slate-800">
      {memories.map((milestone, idx) => {
        const typeStyle =
          MILESTONE_COLORS[milestone.milestoneType] || MILESTONE_COLORS['Other ✨'];
        const formattedDate = milestone.eventDate
          ? new Date(milestone.eventDate).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })
          : null;

        return (
          <div key={milestone._id} className="relative group animate-fade-in">
            {/* Glowing Milestone Marker Node */}
            <div className="absolute -left-[29px] sm:-left-[37px] top-1.5 h-4 w-4 rounded-full bg-slate-950 border-2 border-purple-400 ring-4 ring-purple-500/20 group-hover:scale-125 group-hover:border-purple-300 transition-all duration-200" />

            {/* Milestone Card */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800 hover:border-slate-700/80 space-y-3 transition-all">
              
              {/* Header Strip: Year, Sem & Category */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 font-bold text-slate-200 text-[11px]">
                    {milestone.academicYear} • {milestone.semester}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${typeStyle}`}
                  >
                    {milestone.milestoneType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  {formattedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-purple-400" />
                      <span>{formattedDate}</span>
                    </span>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(milestone._id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete milestone"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Milestone Title */}
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {milestone.title}
                </h4>

                {milestone.location && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="h-3 w-3 text-rose-400" />
                    <span>{milestone.location}</span>
                  </div>
                )}
              </div>

              {/* Reflection Description */}
              {milestone.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-2 border-purple-500/40 pl-3 py-0.5">
                  "{milestone.description}"
                </p>
              )}

              {/* Connected Story Link */}
              {milestone.linkedStory && (
                <div className="pt-2 flex items-center justify-between">
                  <Link
                    to={`/stories/${milestone.linkedStory._id || milestone.linkedStory}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition group/link"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>
                      Read Story: "
                      {milestone.linkedStory.title || 'Connected Story'}"
                    </span>
                    <ArrowRight className="h-3 w-3 group-hover/link:translate-x-1 transition" />
                  </Link>
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
