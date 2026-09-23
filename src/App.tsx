import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { TopicChips } from './components/TopicChips';
import { EventFeed } from './components/EventFeed';
import { EventDetailModal } from './components/EventDetailModal';
import { BookmarksModal } from './components/BookmarksModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ALL_TOPICS, SAMPLE_EVENTS } from './data/events';
import { EventItem, StoredPreferences } from './types';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const PREFERENCES_STORAGE_KEY = 'event_finder_preferences';
const BOOKMARKS_STORAGE_KEY = 'event_finder_bookmarks';

export default function App() {
  // Topic selection state
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const parsed: StoredPreferences = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.selectedTopics)) {
          return new Set(parsed.selectedTopics);
        }
      }
    } catch (e) {
      console.error('Failed to parse preferences from localStorage', e);
    }
    // Default initial topics per PRD schema example
    return new Set(['neuroscience-coaching', 'neuroplasticity', 'vagus-nerve']);
  });

  // Saved bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse bookmarks', e);
    }
    return new Set<string>();
  });

  // Navigation and active views
  const [activeView, setActiveView] = useState<'preferences' | 'results'>('preferences');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize topic selections to localStorage with exact key and format
  const savePreferences = (topics: Set<string>) => {
    try {
      const payload: StoredPreferences = {
        selectedTopics: Array.from(topics),
      };
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save preferences to localStorage', e);
    }
  };

  // Synchronize bookmarks to localStorage
  const saveBookmarks = (bookmarks: Set<string>) => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(Array.from(bookmarks)));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  };

  // Toast notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Topic toggle handlers
  const handleToggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      savePreferences(next);
      return next;
    });
  };

  const handleSelectAllTopics = () => {
    const all = new Set(ALL_TOPICS.map((t) => t.id));
    setSelectedTopics(all);
    savePreferences(all);
    showToast('All 8 neuroscience topics selected');
  };

  const handleClearAllTopics = () => {
    const empty = new Set<string>();
    setSelectedTopics(empty);
    savePreferences(empty);
    showToast('Cleared all topic selections');
  };

  const handleApplyPreset = (topicIds: string[]) => {
    const presetSet = new Set(topicIds);
    setSelectedTopics(presetSet);
    savePreferences(presetSet);
    showToast('Applied topic preset');
  };

  // Bookmark toggle handler
  const handleToggleBookmark = (eventId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
        showToast('Removed from saved bookmarks');
      } else {
        next.add(eventId);
        showToast('Saved to bookmarks!');
      }
      saveBookmarks(next);
      return next;
    });
  };

  // Matching algorithm: computes intersections with active user topics
  const matchingEvents = useMemo(() => {
    return SAMPLE_EVENTS.map((event) => {
      const matchCount = event.topics.filter((t) => selectedTopics.has(t)).length;
      const matchPercentage =
        event.topics.length > 0 ? Math.round((matchCount / event.topics.length) * 100) : 0;
      return {
        ...event,
        matchCount,
        matchPercentage,
      };
    })
      .filter((event) => {
        // Fallback: If user selected no topics, show all upcoming events
        const matchesTopics = selectedTopics.size === 0 || event.matchCount > 0;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          event.title.toLowerCase().includes(q) ||
          event.speaker.toLowerCase().includes(q) ||
          event.description.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q) ||
          event.topics.some((t) => t.toLowerCase().includes(q));

        return matchesTopics && matchesSearch;
      })
      .sort((a, b) => {
        // Sort primarily by highest match score, then chronological
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount;
        }
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      });
  }, [selectedTopics, searchQuery]);

  const bookmarkedEvents = useMemo(() => {
    return SAMPLE_EVENTS.filter((e) => bookmarkedIds.has(e.id));
  }, [bookmarkedIds]);

  const handleNavigate = (view: 'preferences' | 'results') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAllData = () => {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
    const defaults = new Set(['neuroscience-coaching', 'neuroplasticity', 'vagus-nerve']);
    setSelectedTopics(defaults);
    setBookmarkedIds(new Set());
    savePreferences(defaults);
    showToast('Reset all local storage preferences');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeView={activeView}
        onNavigate={handleNavigate}
        matchCount={matchingEvents.length}
        bookmarkCount={bookmarkedIds.size}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeView === 'preferences' ? (
          <TopicChips
            selectedTopics={selectedTopics}
            onToggleTopic={handleToggleTopic}
            onSelectAll={handleSelectAllTopics}
            onClearAll={handleClearAllTopics}
            onApplyPreset={handleApplyPreset}
            onFindEvents={() => handleNavigate('results')}
            matchCount={matchingEvents.length}
          />
        ) : (
          <EventFeed
            events={matchingEvents}
            selectedTopics={selectedTopics}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleTopic={handleToggleTopic}
            onSelectAllTopics={handleSelectAllTopics}
            onEditPreferences={() => handleNavigate('preferences')}
            onSelectEvent={(event) => setSelectedEvent(event)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
      </main>

      {/* VIEW 3: Event Detail Focus & Registration Modal */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isBookmarked={selectedEvent ? bookmarkedIds.has(selectedEvent.id) : false}
        onToggleBookmark={handleToggleBookmark}
        selectedTopics={selectedTopics}
      />

      {/* Bookmarks Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedEvents={bookmarkedEvents}
        onSelectEvent={(event) => setSelectedEvent(event)}
        onRemoveBookmark={handleToggleBookmark}
      />

      {/* Offline Status Pill */}
      <OfflineIndicator />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-fadeIn pointer-events-none">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Application Footer */}
      <footer className="border-t border-slate-900 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-300">Applied Neuroscience Community Event Finder</span>
            <span className="mx-2 text-slate-700">•</span>
            <span>Local Storage PWA</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">CET Standard Time</span>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={handleResetAllData}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Local Preferences</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
