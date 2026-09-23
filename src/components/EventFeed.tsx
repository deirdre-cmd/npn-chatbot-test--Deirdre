import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  SlidersHorizontal,
  Search,
  ExternalLink,
  Bookmark,
  ChevronRight,
  Sparkles,
  CalendarX,
  X,
} from 'lucide-react';
import { EventItem } from '../types';
import { ALL_TOPICS } from '../data/events';

interface EventFeedProps {
  events: (EventItem & { matchCount: number; matchPercentage: number })[];
  selectedTopics: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleTopic: (topicId: string) => void;
  onSelectAllTopics: () => void;
  onEditPreferences: () => void;
  onSelectEvent: (event: EventItem) => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (eventId: string) => void;
}

export const EventFeed: React.FC<EventFeedProps> = ({
  events,
  selectedTopics,
  searchQuery,
  onSearchChange,
  onToggleTopic,
  onSelectAllTopics,
  onEditPreferences,
  onSelectEvent,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action & Search Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Upcoming Matching Events
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-cyan-300 border border-indigo-500/30">
              {events.length} Found
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Filtered by your saved interest preferences. All event schedules standard in Central European Time (CET).
          </p>
        </div>

        {/* Filter Controls & Search Box */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search topic or speaker..."
              className="w-full sm:w-60 bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onEditPreferences}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Topics</span>
          </button>
        </div>
      </div>

      {/* Active Topics Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap text-[11px]">
          Active Filter Topics:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {selectedTopics.size === 0 ? (
            <span className="text-slate-400 italic">No topic filters applied (Showing all upcoming events)</span>
          ) : (
            Array.from(selectedTopics).map((tId) => {
              const topicObj = ALL_TOPICS.find((t) => t.id === tId);
              if (!topicObj) return null;
              return (
                <span
                  key={tId}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950/70 text-cyan-200 border border-indigo-500/40 shadow-sm"
                >
                  <span>{topicObj.label}</span>
                  <button
                    type="button"
                    onClick={() => onToggleTopic(tId)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title={`Remove ${topicObj.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Events Feed List Container */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((evt) => {
            const isBookmarked = bookmarkedIds.has(evt.id);

            return (
              <article
                key={evt.id}
                className="group bg-slate-900/80 hover:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-200 shadow-xl space-y-4 relative"
              >
                {/* Header Meta Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        evt.matchPercentage === 100
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {evt.matchPercentage}% Topic Match
                    </span>

                    <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.displayDate}</span>
                    </span>

                    {evt.duration && (
                      <span className="text-xs text-slate-400 font-normal">
                        ({evt.duration})
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(evt.id)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Event'}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Title & Speaker Section */}
                <div>
                  <h3
                    onClick={() => onSelectEvent(evt)}
                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors cursor-pointer leading-snug"
                  >
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-2.5 mt-2 text-sm text-slate-300 flex-wrap">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.speaker}</span>
                    </div>
                    {evt.speakerTitle && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">{evt.speakerTitle}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Topic Tags Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {evt.topics.map((tId) => {
                    const topicObj = ALL_TOPICS.find((t) => t.id === tId);
                    const isUserSelected = selectedTopics.has(tId);

                    return (
                      <span
                        key={tId}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          isUserSelected
                            ? 'bg-indigo-950/70 text-cyan-200 border border-indigo-500/50 font-semibold'
                            : 'bg-slate-800/60 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {topicObj ? topicObj.label : tId}
                      </span>
                    );
                  })}
                </div>

                {/* Description Excerpt */}
                <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {/* Footer Location & CTA Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{evt.location}</span>
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onSelectEvent(evt)}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={evt.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Register Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-900/40 rounded-3xl p-10 sm:p-14 text-center border border-slate-800/80 space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
            <CalendarX className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">No Matching Events Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            We couldn't find upcoming applied neuroscience events matching your specific search or active
            topics. Try broadening your topic preferences or resetting to view all sessions.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onSelectAllTopics}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Select All Topics</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
