import { BookOpen, Bookmark, List } from 'lucide-react';
import { ScreenId } from '../types/quran';

interface TopNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onResumeReading: () => void;
  bookmarkCount: number;
}

export function TopNav({
  activeScreen,
  onNavigate,
  onResumeReading,
  bookmarkCount,
}: TopNavProps) {
  return (
    <>
      {/* Desktop 3-Zone Top Bar */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single text element) */}
          <button
            type="button"
            onClick={() => onNavigate('surahs')}
            className="font-editorial text-lg font-semibold tracking-tight text-[#1C1E21] hover:text-[#0F5C4D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Le Noble Coran
          </button>

          {/* Zone 2: Clean typography navigation links */}
          <nav aria-label="Navigation principale" className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigate('surahs')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'surahs'
                  ? 'text-[#0F5C4D] font-semibold'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Liste des Sourates
              {activeScreen === 'surahs' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('reader')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'reader'
                  ? 'text-[#0F5C4D] font-semibold'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Lecture de la Sourate
              {activeScreen === 'reader' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('bookmarks')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'bookmarks'
                  ? 'text-[#0F5C4D] font-semibold'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Signets ({bookmarkCount})
              {activeScreen === 'bookmarks' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] rounded-full"
                />
              )}
            </button>
          </nav>

          {/* Zone 3: Single primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onResumeReading}
              className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-[#0F5C4D] hover:bg-[#004337] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reprendre
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Thumb Zone) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E6E1D8]"
      >
        <div className="grid grid-cols-3 items-center h-14">
          <button
            type="button"
            onClick={() => onNavigate('surahs')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'surahs' ? 'text-[#0F5C4D]' : 'text-[#5A5F66]'
            }`}
          >
            <List className="w-5 h-5" strokeWidth={activeScreen === 'surahs' ? 2.25 : 1.75} />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Sourates
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reader')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'reader' ? 'text-[#0F5C4D]' : 'text-[#5A5F66]'
            }`}
          >
            <BookOpen className="w-5 h-5" strokeWidth={activeScreen === 'reader' ? 2.25 : 1.75} />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Lecture
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('bookmarks')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'bookmarks' ? 'text-[#0F5C4D]' : 'text-[#5A5F66]'
            }`}
          >
            <Bookmark
              className="w-5 h-5"
              strokeWidth={activeScreen === 'bookmarks' ? 2.25 : 1.75}
              fill={activeScreen === 'bookmarks' ? 'currentColor' : 'none'}
            />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Signets
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
