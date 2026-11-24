import { ArrowRight, Bookmark, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  POPULAR_SURAH_NUMBERS,
  SURAHS_INDEX,
  getSurahSummary,
} from '../data/surahsIndex';
import { BookmarkItem, ReadingProgress, RevelationType } from '../types/quran';

interface SurahListScreenProps {
  readingProgress: ReadingProgress;
  bookmarks: BookmarkItem[];
  onSelectSurah: (surahNumber: number, ayahNumber?: number) => void;
}

type RevelationFilter = 'all' | RevelationType;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’-]/g, '');
}

export function SurahListScreen({
  readingProgress,
  bookmarks,
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
    const q = normalizeText(searchQuery.trim());
    return SURAHS_INDEX.filter((s) => {
      if (revelationFilter !== 'all' && s.revelation !== revelationFilter) {
        return false;
      }
      if (selectedJuz !== 'all' && s.juz !== selectedJuz) {
        return false;
      }
      if (!q) return true;
      const numMatch = String(s.number) === q;
      const translitMatch = normalizeText(s.transliteration).includes(q);
      const frenchMatch = normalizeText(s.frenchTitle).includes(q);
      const arabicMatch = s.arabicName.includes(searchQuery.trim());
      return numMatch || translitMatch || frenchMatch || arabicMatch;
    });
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
      <div className="md:hidden mb-6">
        <p className="text-xs font-semibold text-[#0F5C4D] tracking-wide">
          Saint Coran · Arabe &amp; Français
        </p>
        <h1 className="font-editorial text-[26px] leading-tight font-semibold text-[#1C1E21] mt-1">
          Liste des Sourates
        </h1>
      </div>

      {/* Desktop Page Title */}
      <div className="hidden md:flex md:items-end md:justify-between mb-6">
        <div>
          <h1 className="font-editorial text-[28px] leading-9 font-semibold text-[#1C1E21]">
            Liste des Sourates
          </h1>
          <p className="text-sm text-[#5A5F66] mt-1">
            Texte arabe uthmanique et traduction française de Muhammad Hamidullah · 114 sourates
          </p>
        </div>
      </div>

      {/* Top Editorial Bento Row: Continue Reading + Quick Surahs */}
      <section
        aria-label="Reprise de lecture"
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8 items-stretch"
      >
        {/* Primary Focal Anchor: Dernière lecture */}
        <div className="lg:col-span-7 bg-white border border-[#E6E1D8] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#0F5C4D]">Dernière lecture</p>
                <h2 className="font-editorial text-[22px] leading-8 font-semibold text-[#1C1E21] mt-1">
                  {currentSurah.number}. {currentSurah.transliteration} — {currentSurah.frenchTitle}
                </h2>
                <p className="text-sm text-[#5A5F66] mt-1 tabular-nums">
                  Verset {readingProgress.ayahNumber} sur {currentSurah.ayahCount} · Juz{' '}
                  {currentSurah.juz} · {currentSurah.revelation}
                </p>
              </div>
              <span
                className="font-arabic-verse text-3xl text-[#0F5C4D] leading-none pt-1 shrink-0"
                aria-hidden="true"
              >
                {currentSurah.arabicName}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-[#5A5F66] mb-1.5 tabular-nums">
                <span>Progression dans la sourate</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#F2EFE9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F5C4D] rounded-full transition-all duration-300"
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
              className="min-h-[48px] px-5 py-2.5 bg-[#0F5C4D] hover:bg-[#004337] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Poursuivre la lecture</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Surface: Sourates fréquemment lues */}
        <div className="lg:col-span-5 bg-white border border-[#E6E1D8] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1C1E21]">Accès rapide</h2>
            <p className="text-xs text-[#5A5F66] mt-0.5">
              Sourates fréquemment méditées
            </p>
          </div>

          <div className="mt-3 divide-y divide-[#E6E1D8]">
            {POPULAR_SURAH_NUMBERS.map((num) => {
              const s = getSurahSummary(num);
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => onSelectSurah(s.number)}
                  className="w-full min-h-[44px] py-2 flex items-center justify-between gap-3 text-left hover:text-[#0F5C4D] transition-colors cursor-pointer group"
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#B8860B] tabular-nums w-6 shrink-0">
                      {s.number}.
                    </span>
                    <span className="text-sm font-medium text-[#1C1E21] group-hover:text-[#0F5C4D] truncate">
                      {s.transliteration} · {s.frenchTitle}
                    </span>
                  </div>
                  <span className="font-arabic-verse text-lg text-[#5A5F66] group-hover:text-[#0F5C4D] shrink-0">
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
            <Search className="w-4 h-4 text-[#5A5F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une sourate (nom, numéro, traduction)..."
              aria-label="Rechercher une sourate"
              className="w-full min-h-[44px] pl-10 pr-10 py-2 bg-[#F2EFE9] text-sm text-[#1C1E21] placeholder:text-[#5A5F66] rounded-lg border border-transparent focus:bg-white focus:border-[#0F5C4D] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-[#5A5F66] hover:text-[#1C1E21] cursor-pointer"
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
              aria-label="Filtrer par Juz"
              className="w-full min-h-[44px] px-3.5 py-2 bg-[#F2EFE9] text-sm font-medium text-[#1C1E21] rounded-lg border border-transparent focus:bg-white focus:border-[#0F5C4D] focus:outline-none cursor-pointer"
            >
              <option value="all">Tous les Juz (1–30)</option>
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
            className="inline-flex items-center gap-1 p-1 bg-[#F2EFE9] rounded-lg"
          >
            <button
              type="button"
              onClick={() => setRevelationFilter('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'all'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Toutes (114)
            </button>
            <button
              type="button"
              onClick={() => setRevelationFilter('Mecquoise')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'Mecquoise'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Mecquoises
            </button>
            <button
              type="button"
              onClick={() => setRevelationFilter('Médinoise')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                revelationFilter === 'Médinoise'
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] hover:text-[#1C1E21]'
              }`}
            >
              Médinoises
            </button>
          </div>

          <p className="text-xs text-[#5A5F66] tabular-nums">
            {filteredSurahs.length} sourate{filteredSurahs.length > 1 ? 's' : ''} affichée
            {filteredSurahs.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Surah Index Grid */}
      {filteredSurahs.length === 0 ? (
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-10 text-center">
          <p className="font-editorial text-lg font-semibold text-[#1C1E21]">
            Aucune sourate ne correspond à votre recherche
          </p>
          <p className="text-sm text-[#5A5F66] mt-1">
            Essayez un autre nom français, une translittération ou un numéro entre 1 et 114.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 min-h-[44px] px-4 py-2 text-sm font-semibold text-[#0F5C4D] border border-[#E6E1D8] hover:border-[#0F5C4D] rounded-lg transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <section
          aria-label="Index des sourates"
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
                className={`w-full min-h-[76px] bg-white rounded-2xl border p-4 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                  isLastRead
                    ? 'border-[#0F5C4D]/45 hover:border-[#0F5C4D]'
                    : 'border-[#E6E1D8] hover:border-[#0F5C4D]/45'
                }`}
              >
                <div className="min-w-0 flex items-center gap-3.5 flex-1">
                  {/* Surah Number Badge */}
                  <span
                    className={`w-10 h-10 rounded-xl text-sm font-semibold tabular-nums flex items-center justify-center shrink-0 transition-colors ${
                      isLastRead
                        ? 'bg-[#0F5C4D] text-white'
                        : 'bg-[#FDF8EC] border border-[#B8860B]/25 text-[#B8860B] group-hover:bg-[#0F5C4D]/10 group-hover:text-[#0F5C4D] group-hover:border-[#0F5C4D]/25'
                    }`}
                  >
                    {surah.number}
                  </span>

                  {/* Surah Names + Unboxed Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[15px] font-semibold text-[#1C1E21] group-hover:text-[#0F5C4D] transition-colors truncate">
                        {surah.transliteration}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A5F66] truncate">{surah.frenchTitle}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5A5F66] mt-1 tabular-nums">
                      <span>{surah.revelation}</span>
                      <span aria-hidden="true">·</span>
                      <span>{surah.ayahCount} v.</span>
                      {bookmarkCount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-0.5 text-[#B8860B] font-semibold">
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
                  <span className="font-arabic-verse text-xl text-[#1C1E21] group-hover:text-[#0F5C4D] transition-colors">
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
