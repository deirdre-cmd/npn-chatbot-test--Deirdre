import React, { useState } from 'react';
import { Brain, SlidersHorizontal, CalendarCheck, Bookmark, Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  activeView: 'preferences' | 'results';
  onNavigate: (view: 'preferences' | 'results') => void;
  matchCount: number;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  matchCount,
  bookmarkCount,
  onOpenBookmarks,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => onNavigate('preferences')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  NeuroEvents
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Applied Neuroscience Event Finder
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onNavigate('preferences')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'preferences'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Topics</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('results')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'results'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Matching Events</span>
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-950 text-indigo-300 border border-indigo-500/30">
                  {matchCount}
                </span>
              </button>
            </nav>

            {/* Saved Bookmarks Button */}
            <button
              type="button"
              onClick={onOpenBookmarks}
              title="Saved Bookmarks"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center shadow">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* PWA Install Button */}
            {!isInstalled && (
              <>
                {isInstallable && (
                  <button
                    type="button"
                    onClick={install}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Install App</span>
                    <span className="sm:hidden">Install</span>
                  </button>
                )}

                {isIOS && (
                  <button
                    type="button"
                    onClick={() => setShowIOSModal(true)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Install</span>
                  </button>
                )}
              </>
            )}

          </div>
        </div>
      </header>

      {/* iOS Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Install on iPhone / iPad</h3>
              <p className="text-xs text-slate-400 mt-1">
                Install this app on your home screen for quick offline access:
              </p>
            </div>

            <ol className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>Tap the <strong className="text-white">Share</strong> icon at the bottom of Safari.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top right corner.</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
