import {
  ArrowRight,
  Bookmark,
  BookOpen,
  PenLine,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Translations } from '../data/i18n';
import { getSurahSummary, toArabicIndicDigits } from '../data/surahsIndex';
import { AppLanguage, BookmarkItem, ReadingProgress } from '../types/quran';

interface BookmarksScreenProps {
  bookmarks: BookmarkItem[];
  readingProgress: ReadingProgress;
  language: AppLanguage;
  t: Translations;
  onOpenAyah: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateNote: (item: Omit<BookmarkItem, 'id' | 'createdAt'>, note: string) => void;
  onGoToSurahs: () => void;
}

type BookmarkFilter = 'all' | 'with-notes';

function formatDateForLanguage(isoDate: string, language: AppLanguage): string {
  const locale = language === 'ar' ? 'ar-SA' : 'fr-FR';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return '';
  }
}

export function BookmarksScreen({
  bookmarks,
  readingProgress,
  language,
  t,
  onOpenAyah,
  onRemoveBookmark,
  onUpdateNote,
  onGoToSurahs,
}: BookmarksScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<BookmarkFilter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const progressSurah = getSurahSummary(readingProgress.surahNumber);
  const notesCount = useMemo(
    () => bookmarks.filter((b) => Boolean(b.note && b.note.trim())).length,
    [bookmarks]
  );

  const filteredBookmarks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookmarks.filter((b) => {
      if (filterMode === 'with-notes' && (!b.note || !b.note.trim())) {
        return false;
      }
      if (!q) return true;
      const surah = getSurahSummary(b.surahNumber);
      return (
        surah.transliteration.toLowerCase().includes(q) ||
        surah.frenchTitle.toLowerCase().includes(q) ||
        b.fr.toLowerCase().includes(q) ||
        (b.note && b.note.toLowerCase().includes(q)) ||
        `${b.surahNumber}:${b.ayahNumber}`.includes(q)
      );
    });
  }, [bookmarks, filterMode, searchQuery]);

  const startEditing = (b: BookmarkItem) => {
    setEditingId(b.id);
    setNoteDraft(b.note ?? '');
  };

  const saveEdit = (b: BookmarkItem) => {
    onUpdateNote(
      {
        surahNumber: b.surahNumber,
        ayahNumber: b.ayahNumber,
        globalAyahNumber: b.globalAyahNumber,
        juz: b.juz,
        ar: b.ar,
        fr: b.fr,
      },
      noteDraft
    );
    setEditingId(null);
  };

  return (
    <main className="max-w-5xl mx-auto px-5 sm:px-6 pt-6 pb-24 md:pb-16">
      {/* Page Title */}
      <div className="mb-6">
        <p className="md:hidden text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] mb-1">
          {t.navBookmarks}
        </p>
        <h1 className="font-editorial text-[26px] sm:text-[28px] leading-9 font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
          {t.bookmarksTitle}
        </h1>
        <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1 tabular-nums">
          {t.bookmarksSubtitle(bookmarks.length, notesCount)}
        </p>
      </div>

      {/* Reading Position Card */}
      <section aria-label={t.savedReadingPosition} className="mb-8">
        <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6]">
              {t.savedReadingPosition}
            </p>
            <h2 className="font-editorial text-xl font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mt-1">
              {progressSurah.number}. {progressSurah.transliteration} —{' '}
              {progressSurah.frenchTitle}
            </h2>
            <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-0.5 tabular-nums">
              {t.verseOf(readingProgress.ayahNumber, progressSurah.ayahCount)} · Juz{' '}
              {progressSurah.juz}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenAyah(readingProgress.surahNumber, readingProgress.ayahNumber)
            }
            className="min-h-[48px] px-5 py-2.5 bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
          >
            <span>{t.resumeAtVerse}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </section>

      {/* Search & Filter Controls */}
      {bookmarks.length > 0 && (
        <section aria-label={t.searchBookmarksPlaceholder} className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#5A5F66] dark:text-[#A4ADA8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                inputMode="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchBookmarksPlaceholder}
                aria-label={t.searchBookmarksPlaceholder}
                className="w-full min-h-[44px] pl-10 pr-10 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] placeholder:text-[#5A5F66] dark:placeholder:text-[#A4ADA8] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-[#5A5F66] dark:text-[#A4ADA8] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label={t.navBookmarks}
              className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] dark:bg-[#232A26] rounded-lg self-start"
            >
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-[#0F5C4D] text-white'
                    : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
                }`}
              >
                {t.allBookmarks(bookmarks.length)}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('with-notes')}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterMode === 'with-notes'
                    ? 'bg-[#0F5C4D] text-white'
                    : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
                }`}
              >
                {t.withNotesFilter(notesCount)}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bookmarks List or Empty State */}
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF8EC] dark:bg-[#2A2518] border border-[#B8860B]/25 dark:border-[#E0AF3E]/30 text-[#B8860B] dark:text-[#E0AF3E] flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-5 h-5" />
          </div>
          <h2 className="font-editorial text-xl font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
            {t.noBookmarksTitle}
          </h2>
          <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] max-w-md mx-auto mt-1.5">
            {t.noBookmarksHint}
          </p>
          <button
            type="button"
            onClick={onGoToSurahs}
            className="mt-6 min-h-[48px] px-5 py-2.5 bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.browseSurahs}</span>
          </button>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-10 text-center">
          <p className="font-editorial text-lg font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
            {t.noFilteredBookmarks}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterMode('all');
            }}
            className="mt-4 min-h-[44px] px-4 py-2 text-sm font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] border border-[#E6E1D8] dark:border-[#2C3530] rounded-lg cursor-pointer"
          >
            {t.showAll}
          </button>
        </div>
      ) : (
        <section aria-label={t.bookmarksTitle} className="space-y-4">
          {filteredBookmarks.map((b) => {
            const surah = getSurahSummary(b.surahNumber);
            const isEditing = editingId === b.id;

            return (
              <article
                key={b.id}
                className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-5 sm:p-6"
              >
                {/* Bookmark Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-[#E6E1D8] dark:border-[#2C3530]">
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenAyah(b.surahNumber, b.ayahNumber)}
                      className="text-left group cursor-pointer"
                    >
                      <h3 className="font-editorial text-lg font-semibold text-[#1C1E21] dark:text-[#ECE9E2] group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] transition-colors">
                        {surah.number}. {surah.transliteration} — {surah.frenchTitle}
                      </h3>
                    </button>
                    <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8] mt-0.5 tabular-nums">
                      {t.verseLabel(b.ayahNumber)} · Juz {b.juz} ·{' '}
                      {t.savedOn(formatDateForLanguage(b.createdAt, language))}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 -mr-2">
                    <button
                      type="button"
                      onClick={() => onOpenAyah(b.surahNumber, b.ayahNumber)}
                      className="min-h-[44px] px-3 text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] hover:bg-[#0F5C4D]/8 dark:hover:bg-[#5EC4A6]/12 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{t.readAction}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditing(b)}
                      aria-label={`${t.edit} ${b.surahNumber}:${b.ayahNumber}`}
                      className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2] rounded-lg transition-colors cursor-pointer"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(b.id)}
                      aria-label={`Supprimer ${b.surahNumber}:${b.ayahNumber}`}
                      className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#BA1A1A] dark:hover:text-[#FFB4AB] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic & French Preview */}
                <div className="pt-4">
                  <p
                    lang="ar"
                    dir="rtl"
                    className="font-arabic-verse text-2xl leading-[44px] text-right text-[#1C1E21] dark:text-[#ECE9E2]"
                  >
                    {b.ar}{' '}
                    <span className="text-[#B8860B] dark:text-[#E0AF3E] text-[0.85em] px-1 select-none">
                      ﴿{toArabicIndicDigits(b.ayahNumber)}﴾
                    </span>
                  </p>
                  <p
                    dir="ltr"
                    className="font-french-prose text-base leading-[26px] text-[#1C1E21] dark:text-[#E2DFD7] dark:tracking-[0.005em] mt-3"
                  >
                    {b.fr}
                  </p>
                </div>

                {/* Note Display or Inline Editor */}
                {isEditing ? (
                  <div className="mt-4 pt-4 border-t border-[#E6E1D8] dark:border-[#2C3530]">
                    <label
                      htmlFor={`bm-note-${b.id}`}
                      className="block text-xs font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
                    >
                      {t.personalNote}
                    </label>
                    <textarea
                      id={`bm-note-${b.id}`}
                      rows={3}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder={t.notePlaceholder}
                      className="font-french-prose w-full p-3 bg-[#FAF8F5] dark:bg-[#121614] border border-[#E6E1D8] dark:border-[#2C3530] rounded-lg text-sm text-[#1C1E21] dark:text-[#ECE9E2] placeholder:text-[#5A5F66] dark:placeholder:text-[#A4ADA8] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="min-h-[40px] px-4 py-1.5 text-xs font-semibold text-[#5A5F66] dark:text-[#A4ADA8] cursor-pointer"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(b)}
                        className="min-h-[40px] px-4 py-1.5 text-xs font-semibold bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white rounded-lg cursor-pointer"
                      >
                        {t.save}
                      </button>
                    </div>
                  </div>
                ) : (
                  b.note && (
                    <div className="mt-4 bg-[#F2EFE9]/75 dark:bg-[#232A26] rounded-xl px-4 py-3 text-sm text-[#1C1E21] dark:text-[#ECE9E2]">
                      <span className="block text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] mb-0.5">
                        {t.personalNote}
                      </span>
                      <p className="font-french-prose leading-relaxed">{b.note}</p>
                    </div>
                  )
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
