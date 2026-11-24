import { BookOpen, Bookmark, List } from 'lucide-react';
import { Translations } from '../data/i18n';
import { ScreenId } from '../types/quran';

interface TopNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onResumeReading: () => void;
  bookmarkCount: number;
  t: Translations;
}

export function TopNav({
  activeScreen,
  onNavigate,
  onResumeReading,
  bookmarkCount,
  t,
}: TopNavProps) {
  return (
    <>
      {/* Desktop 3-Zone Top Bar */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#FAF8F5]/95 dark:bg-[#121614]/95 backdrop-blur-md border-b border-[#E6E1D8] dark:border-[#2C3530]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark (single text element) */}
          <button
            type="button"
            onClick={() => onNavigate('surahs')}
            className="font-editorial text-lg font-semibold tracking-tight text-[#1C1E21] dark:text-[#ECE9E2] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.appName}
          </button>

          {/* Zone 2: Clean typography navigation links */}
          <nav aria-label="Navigation principale" className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigate('surahs')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'surahs'
                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6] font-semibold'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.navSurahs}
              {activeScreen === 'surahs' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] dark:bg-[#5EC4A6] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('reader')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'reader'
                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6] font-semibold'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.navReader}
              {activeScreen === 'reader' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] dark:bg-[#5EC4A6] rounded-full"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('bookmarks')}
              className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                activeScreen === 'bookmarks'
                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6] font-semibold'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.navBookmarks} ({bookmarkCount})
              {activeScreen === 'bookmarks' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5C4D] dark:bg-[#5EC4A6] rounded-full"
                />
              )}
            </button>
          </nav>

          {/* Zone 3: Single primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onResumeReading}
              className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.navResume}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar (Thumb Zone) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1A201D]/95 backdrop-blur-md border-t border-[#E6E1D8] dark:border-[#2C3530]"
      >
        <div className="grid grid-cols-3 items-center h-14">
          <button
            type="button"
            onClick={() => onNavigate('surahs')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'surahs'
                ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                : 'text-[#5A5F66] dark:text-[#A4ADA8]'
            }`}
          >
            <List className="w-5 h-5" strokeWidth={activeScreen === 'surahs' ? 2.25 : 1.75} />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              {t.navSurahsShort}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reader')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'reader'
                ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                : 'text-[#5A5F66] dark:text-[#A4ADA8]'
            }`}
          >
            <BookOpen className="w-5 h-5" strokeWidth={activeScreen === 'reader' ? 2.25 : 1.75} />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              {t.navReaderShort}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('bookmarks')}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
              activeScreen === 'bookmarks'
                ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                : 'text-[#5A5F66] dark:text-[#A4ADA8]'
            }`}
          >
            <Bookmark
              className="w-5 h-5"
              strokeWidth={activeScreen === 'bookmarks' ? 2.25 : 1.75}
              fill={activeScreen === 'bookmarks' ? 'currentColor' : 'none'}
            />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              {t.navBookmarks}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
