import { ArrowRight, Bookmark, Globe, Moon, Search, Sun, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Translations } from '../data/i18n';
import {
  POPULAR_SURAH_NUMBERS,
  SURAHS_INDEX,
  getSurahSummary,
} from '../data/surahsIndex';
import {
  AppLanguage,
  BookmarkItem,
  ReadingProgress,
  RevelationType,
  ThemeMode,
} from '../types/quran';

interface SurahListScreenProps {
  readingProgress: ReadingProgress;
  bookmarks: BookmarkItem[];
  theme: ThemeMode;
  language: AppLanguage;
  t: Translations;
  onToggleTheme: () => void;
  onChangeLanguage: (lang: AppLanguage) => void;
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
}

type RevelationFilter = 'all' | RevelationType;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeCompact(value: string): string {
  return normalizeText(value).replace(/\s+/g, '');
}

function normalizeArabic(value: string): string {
  return value
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

export function SurahListScreen({
  readingProgress,
  bookmarks,
  theme,
  language,
  t,
  onToggleTheme,
  onChangeLanguage,
  onSelectSurah,
}: SurahListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>('all');
  const [selectedJuz, setSelectedJuz] = useState<number | 'all'>('all');

  const currentSurah = getSurahSummary(readingProgress.surahNumber);
  const progressPercent = Math.round(
    (readingProgress.ayahNumber / currentSurah.ayahCount) * 100
  );

  const bookmarksBySurah = useMemo(() => {
    const map = new Map<number, number>();
    for (const b of bookmarks) {
      map.set(b.surahNumber, (map.get(b.surahNumber) ?? 0) + 1);
    }
    return map;
  }, [bookmarks]);

  const filteredSurahs = useMemo(() => {
    const rawTrimmed = searchQuery.trim();
    const q = normalizeText(rawTrimmed);
    const qCompact = normalizeCompact(rawTrimmed);
    const qArabic = normalizeArabic(rawTrimmed);
    const isNumericQuery = /^\d+$/.test(rawTrimmed);

    const matches = SURAHS_INDEX.filter((s) => {
      if (revelationFilter !== 'all' && s.revelation !== revelationFilter) {
        return false;
      }
      if (selectedJuz !== 'all' && s.juz !== selectedJuz) {
        return false;
      }
      if (!q && !qArabic) return true;

      if (isNumericQuery) {
        return String(s.number).startsWith(rawTrimmed);
      }

      const translitNorm = normalizeText(s.transliteration);
      const translitCompact = normalizeCompact(s.transliteration);
      const frenchNorm = normalizeText(s.frenchTitle);
      const frenchCompact = normalizeCompact(s.frenchTitle);
      const arabicNorm = normalizeArabic(s.arabicName);

      const nameMatch =
        translitNorm.includes(q) ||
        translitCompact.includes(qCompact) ||
        frenchNorm.includes(q) ||
        frenchCompact.includes(qCompact) ||
        (qArabic.length > 0 && arabicNorm.includes(qArabic));

      const embeddedNumber = rawTrimmed.match(/\b(\d{1,3})\b/)?.[1];
      const embeddedMatch = embeddedNumber ? String(s.number) === embeddedNumber : false;

      return nameMatch || embeddedMatch;
    });

    if (isNumericQuery) {
      return [...matches].sort((a, b) => {
        const aExact = String(a.number) === rawTrimmed ? 0 : 1;
        const bExact = String(b.number) === rawTrimmed ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        return a.number - b.number;
      });
    }

    return matches;
  }, [searchQuery, revelationFilter, selectedJuz]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || revelationFilter !== 'all' || selectedJuz !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setRevelationFilter('all');
    setSelectedJuz('all');
  };

  return (
    <main className="max-w-6xl mx-auto px-5 sm:px-6 pt-6 pb-24 md:pb-16">
      {/* Mobile Page Header (scrolls naturally with page) */}
      <div className="md:hidden mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] tracking-wide">
            {t.appName}
          </p>
          <h1 className="font-editorial text-[26px] leading-tight font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mt-1">
            {t.titleSurahs}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select
            aria-label={t.appLanguageLabel}
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value as AppLanguage)}
            className="min-h-[44px] px-2.5 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-xl text-xs font-semibold text-[#1C1E21] dark:text-[#ECE9E2] cursor-pointer"
          >
            <option value="fr">FR</option>
            <option value="ff">FF</option>
            <option value="ar">AR</option>
          </select>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.modeDay : t.modeNight}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Desktop Page Title */}
      <div className="hidden md:flex md:items-end md:justify-between mb-6 gap-4">
        <div>
          <h1 className="font-editorial text-[28px] leading-9 font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
            {t.titleSurahs}
          </h1>
          <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1">
            {t.subtitleIndex}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-[#5A5F66] dark:text-[#A4ADA8] absolute left-3 pointer-events-none" />
            <select
              aria-label={t.appLanguageLabel}
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as AppLanguage)}
              className="min-h-[40px] pl-8 pr-3 py-2 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6] rounded-lg text-xs font-semibold text-[#1C1E21] dark:text-[#ECE9E2] transition-colors cursor-pointer"
            >
              <option value="fr">Français</option>
              <option value="ff">Fulfulde</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={theme === 'dark'}
            className="min-h-[40px] px-3.5 py-2 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6] rounded-lg inline-flex items-center gap-2 text-xs font-semibold text-[#1C1E21] dark:text-[#ECE9E2] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#E0AF3E]" />
                <span>{t.modeDay}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#0F5C4D]" />
                <span>{t.modeNight}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top Editorial Bento Row: Continue Reading + Quick Surahs */}
      <section
        aria-label={t.lastReading}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8 items-stretch"
      >
        {/* Primary Focal Anchor: Dernière lecture */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#0F5C4D] dark:text-[#5EC4A6]">
                  {t.lastReading}
                </p>
                <h2 className="font-editorial text-[22px] leading-8 font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mt-1">
                  {currentSurah.number}. {currentSurah.transliteration} — {currentSurah.frenchTitle}
                </h2>
                <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1 tabular-nums">
                  {t.verseOf(readingProgress.ayahNumber, currentSurah.ayahCount)} · Juz{' '}
                  {currentSurah.juz} · {t.revelationLabel(currentSurah.revelation)}
                </p>
              </div>
              <span
                className="font-arabic-verse text-3xl text-[#0F5C4D] dark:text-[#5EC4A6] leading-none pt-1 shrink-0"
                aria-hidden="true"
              >
                {currentSurah.arabicName}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-[#5A5F66] dark:text-[#A4ADA8] mb-1.5 tabular-nums">
                <span>{t.surahProgress}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#F2EFE9] dark:bg-[#232A26] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F5C4D] dark:bg-[#5EC4A6] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onSelectSurah(readingProgress.surahNumber, readingProgress.ayahNumber)
              }
              className="min-h-[48px] px-5 py-2.5 bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.continueReading}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Secondary Surface: Sourates fréquemment lues */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
              {t.quickAccess}
            </h2>
            <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8] mt-0.5">
              {t.quickAccessSubtitle}
            </p>
          </div>

          <div className="mt-3 divide-y divide-[#E6E1D8] dark:divide-[#2C3530]">
            {POPULAR_SURAH_NUMBERS.map((num) => {
              const s = getSurahSummary(num);
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onSelectSurah(s.number)}
                  className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#B8860B] dark:text-[#E0AF3E] tabular-nums w-6 shrink-0">
                      {s.number}.
                    </span>
                    <span className="text-sm font-medium text-[#1C1E21] dark:text-[#ECE9E2] group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] truncate">
                      {s.transliteration} · {s.frenchTitle}
                    </span>
                  </div>
                  <span className="font-arabic-verse text-lg text-[#5A5F66] dark:text-[#A4ADA8] group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] shrink-0">
                    {s.arabicName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <section aria-label="Recherche et filtres" className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5A5F66] dark:text-[#A4ADA8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              inputMode="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                } else if (e.key === 'Enter' && filteredSurahs.length === 1) {
                  onSelectSurah(filteredSurahs[0].number);
                }
              }}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full min-h-[44px] pl-10 pr-10 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] placeholder:text-[#5A5F66] dark:placeholder:text-[#A4ADA8] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Juz Filter Select */}
          <div className="sm:w-48 shrink-0">
            <select
              value={selectedJuz}
              onChange={(e) =>
                setSelectedJuz(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              aria-label={t.allJuz}
              className="w-full min-h-[44px] px-3.5 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm font-medium text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
            >
              <option value="all">{t.allJuz}</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <option key={juz} value={juz}>
                  Juz {juz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Segmented Filter + Count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label="Filtrer par lieu de révélation"
            className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] dark:bg-[#232A26] rounded-lg"
          >
            <button
              type="button"
              onClick={() => setRevelationFilter('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'all'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setRevelationFilter('Mecquoise')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'Mecquoise'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.filterMeccan}
            </button>
            <button
              type="button"
              onClick={() => setRevelationFilter('Médinoise')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'Médinoise'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {t.filterMedinan}
            </button>
          </div>

          <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8] tabular-nums">
            {t.surahsDisplayed(filteredSurahs.length)}
          </p>
        </div>
      </section>

      {/* Surah Index Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-10 text-center">
          <p className="font-editorial text-lg font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
            {t.noSurahFound}
          </p>
          <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1">
            {t.noSurahHint}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 min-h-[44px] px-4 py-2 text-sm font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] border border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6] rounded-lg transition-colors cursor-pointer"
            >
              {t.resetFilters}
            </button>
          )}
        </div>
      ) : (
        <section
          aria-label={t.titleSurahs}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredSurahs.map((surah) => {
            const isLastRead = surah.number === readingProgress.surahNumber;
            const bookmarkCount = bookmarksBySurah.get(surah.number) ?? 0;

            return (
              <button
                key={surah.number}
                type="button"
                onClick={() => onSelectSurah(surah.number)}
                className={`w-full min-h-[76px] bg-white dark:bg-[#1A201D] rounded-2xl border p-4 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                  isLastRead
                    ? 'border-[#0F5C4D]/45 dark:border-[#5EC4A6]/55 hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6]'
                    : 'border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D]/45 dark:hover:border-[#5EC4A6]/55'
                }`}
              >
                <div className="min-w-0 flex items-center gap-3.5 flex-1">
                  {/* Surah Number Badge */}
                  <span
                    className={`w-10 h-10 rounded-xl text-sm font-semibold tabular-nums flex items-center justify-center shrink-0 transition-colors ${
                      isLastRead
                        ? 'bg-[#0F5C4D] text-white'
                        : 'bg-[#FDF8EC] dark:bg-[#2A2518] border border-[#B8860B]/25 dark:border-[#E0AF3E]/30 text-[#B8860B] dark:text-[#E0AF3E] group-hover:bg-[#0F5C4D]/10 dark:group-hover:bg-[#5EC4A6]/15 group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] group-hover:border-[#0F5C4D]/25 dark:group-hover:border-[#5EC4A6]/30'
                    }`}
                  >
                    {surah.number}
                  </span>

                  {/* Surah Names + Unboxed Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[15px] font-semibold text-[#1C1E21] dark:text-[#ECE9E2] group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] transition-colors truncate">
                        {surah.transliteration}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8] truncate">
                      {surah.frenchTitle}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5A5F66] dark:text-[#A4ADA8] mt-1 tabular-nums">
                      <span>{t.revelationLabel(surah.revelation)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{surah.ayahCount} v.</span>
                      {bookmarkCount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-0.5 text-[#B8860B] dark:text-[#E0AF3E] font-semibold">
                            <Bookmark className="w-3 h-3" fill="currentColor" />
                            {bookmarkCount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arabic Surah Name */}
                <div className="shrink-0 text-right pl-2">
                  <span className="font-arabic-verse text-xl text-[#1C1E21] dark:text-[#ECE9E2] group-hover:text-[#0F5C4D] dark:group-hover:text-[#5EC4A6] transition-colors">
                    {surah.arabicName}
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      )}
    </main>
  );
}
