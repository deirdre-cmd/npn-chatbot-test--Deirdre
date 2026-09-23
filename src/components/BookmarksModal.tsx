import React from 'react';
import { X, Bookmark, ExternalLink, Eye, Trash2, Calendar, User } from 'lucide-react';
import { EventItem } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onRemoveBookmark: (eventId: string) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedEvents,
  onSelectEvent,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Bookmark className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bookmarked Events</h3>
            <p className="text-xs text-slate-400">
              {bookmarkedEvents.length} saved session{bookmarkedEvents.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {bookmarkedEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-500" />
              <p>No saved events yet.</p>
              <p className="text-slate-400">
                Click the bookmark icon on any event card to save it for quick reference.
              </p>
            </div>
          ) : (
            bookmarkedEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
              >
                <div className="overflow-hidden space-y-1">
                  <div
                    onClick={() => {
                      onSelectEvent(evt);
                      onClose();
                    }}
                    className="font-bold text-sm text-white hover:text-cyan-300 transition-colors cursor-pointer truncate"
                  >
                    {evt.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{evt.displayDate}</span>
                    <span>•</span>
                    <span>{evt.speaker}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEvent(evt);
                      onClose();
                    }}
                    className="p-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </button>

                  <a
                    href={evt.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-xs bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded-xl transition-colors"
                    title="Register"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onRemoveBookmark(evt.id)}
                    className="p-2 text-xs bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
