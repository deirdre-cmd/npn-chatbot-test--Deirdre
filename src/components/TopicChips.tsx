import React from 'react';
import {
  Sparkles,
  FlaskConical,
  Lightbulb,
  Flame,
  Brain,
  ShieldAlert,
  Compass,
  Activity,
  Check,
  CheckCheck,
  RotateCcw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ALL_TOPICS } from '../data/events';

interface TopicChipsProps {
  selectedTopics: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onApplyPreset: (topicIds: string[]) => void;
  onFindEvents: () => void;
  matchCount: number;
}

// Icon mapper for topics
const getTopicIcon = (iconName: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Sparkles;
    case 'FlaskConical':
      return FlaskConical;
    case 'Lightbulb':
      return Lightbulb;
    case 'Flame':
      return Flame;
    case 'Brain':
      return Brain;
    case 'ShieldAlert':
      return ShieldAlert;
    case 'Compass':
      return Compass;
    case 'Activity':
      return Activity;
    default:
      return Brain;
  }
};

export const TopicChips: React.FC<TopicChipsProps> = ({
  selectedTopics,
  onToggleTopic,
  onSelectAll,
  onClearAll,
  onApplyPreset,
  onFindEvents,
  matchCount,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-10 border border-slate-800/80 shadow-2xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Applied Neuroscience Community Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find neuroscience events that elevate your practice.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
            Skip the noise of dense master calendars. Select your focus topics below to curate a
            focused feed of upcoming applied neuroscience masterclasses, workshops, and webinars.
          </p>
        </div>
      </div>

      {/* Main Topic Selection Card */}
      <div className="bg-slate-900/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
        
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" />
              <span>Select Neuroscience Topics</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Toggle topics of interest. Your choices are automatically stored in your browser for future visits.
            </p>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 rounded-xl border border-slate-700/70 transition-all flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select All</span>
            </button>
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Presets Bar */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Curated Practitioner Presets:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => onApplyPreset(['neuroscience-coaching', 'neuroplasticity'])}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-500/50 whitespace-nowrap transition-all"
            >
              🧠 Professional Coaching
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset(['trauma', 'vagus-nerve', 'stress'])}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-500/50 whitespace-nowrap transition-all"
            >
              🛡️ Somatic & Trauma
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset(['creativity', 'neurotransmitters'])}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-500/50 whitespace-nowrap transition-all"
            >
              💡 Cognitive Flow & Peak
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset(['hypnosis', 'vagus-nerve'])}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-indigo-950/60 text-slate-300 hover:text-indigo-200 border border-slate-700/80 hover:border-indigo-500/50 whitespace-nowrap transition-all"
            >
              🌀 Trance & Regulation
            </button>
          </div>
        </div>

        {/* Dynamic Topic Selection Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {ALL_TOPICS.map((topic) => {
            const isSelected = selectedTopics.has(topic.id);
            const IconComponent = getTopicIcon(topic.iconName);

            return (
              <div
                key={topic.id}
                role="button"
                tabIndex={0}
                onClick={() => onToggleTopic(topic.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleTopic(topic.id);
                  }
                }}
                className={`group relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-600 via-indigo-600 to-cyan-600 border-cyan-400 text-white shadow-lg shadow-indigo-600/30 scale-[1.01]'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-indigo-400 group-hover:text-cyan-400'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-white text-indigo-700 border-white'
                        : 'border-slate-700 bg-slate-800/50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-bold text-sm leading-snug ${
                      isSelected ? 'text-white' : 'text-slate-100'
                    }`}
                  >
                    {topic.label}
                  </h3>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-slate-100/85' : 'text-slate-400'
                    }`}
                  >
                    {topic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <span className="font-extrabold text-cyan-400 text-lg">
              {selectedTopics.size}
            </span>
            <span>of {ALL_TOPICS.length} topics active</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-200 font-semibold">
              {matchCount} event{matchCount === 1 ? '' : 's'} available
            </span>
          </div>

          <button
            type="button"
            onClick={onFindEvents}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Find Matching Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
