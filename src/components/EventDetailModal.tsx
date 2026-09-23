import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Bookmark,
  CalendarPlus,
  ExternalLink,
  Globe,
  Tag,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { EventItem } from '../types';
import { ALL_TOPICS } from '../data/events';
import { downloadEventICS } from '../utils/calendar';

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  selectedTopics: Set<string>;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  isBookmarked,
  onToggleBookmark,
  selectedTopics,
}) => {
  if (!event) return null;

  const matchCount = event.topics.filter((t) => selectedTopics.has(t)).length;
  const matchPercentage =
    event.topics.length > 0 ? Math.round((matchCount / event.topics.length) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-12">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {matchPercentage}% Interest Match
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>CET Standard Timezone</span>
          </span>
          {event.organizer && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{event.organizer}</span>
            </span>
          )}
        </div>

        {/* Title & Speaker */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {event.title}
          </h2>

          <div className="flex items-center gap-3 text-slate-300 pt-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-base">{event.speaker}</div>
              <div className="text-xs text-slate-400">
                {event.speakerTitle || 'Senior Applied Neuroscience Practitioner'}
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-950/70 rounded-2xl border border-slate-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-950/60 text-indigo-400 rounded-xl mt-0.5 border border-indigo-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Date & Time (CET)
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                {event.displayDate}
              </div>
              {event.duration && (
                <div className="text-xs text-slate-400">Session length: {event.duration}</div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-cyan-950/60 text-cyan-400 rounded-xl mt-0.5 border border-cyan-500/30">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                Format & Venue
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">
                {event.location}
              </div>
              <div className="text-xs text-slate-400">Live Interactive Access</div>
            </div>
          </div>
        </div>

        {/* Relevant Topics */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Neuroscience Topics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {event.topics.map((tId) => {
              const topicObj = ALL_TOPICS.find((t) => t.id === tId);
              const isSelected = selectedTopics.has(tId);
              return (
                <span
                  key={tId}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-950 text-cyan-200 border border-indigo-500/50 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{topicObj ? topicObj.label : tId}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Detailed Overview */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Session Description & Learning Objectives
          </div>
          <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </button>

            <button
              type="button"
              onClick={() => downloadEventICS(event)}
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Add to Calendar (.ics)"
            >
              <CalendarPlus className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Add to Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(event.id)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Event'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Primary Registration Link */}
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
          >
            <span>Register for Event</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
