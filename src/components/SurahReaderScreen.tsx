import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MapPin,
  Moon,
  Pause,
  PenLine,
  Play,
  SlidersHorizontal,
  Sun,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Translations } from '../data/i18n';
import {
  ARABIC_FONTS,
  LATIN_FONTS,
  RECITERS,
  SURAHS_INDEX,
  getSurahSummary,
  toArabicIndicDigits,
} from '../data/surahsIndex';
import { fetchSurahDetail } from '../services/quranService';
import {
  AppLanguage,
  ArabicFontId,
  ArabicSizeOption,
  Ayah,
  BookmarkItem,
  LatinFontId,
  ReaderSettings,
  ReadingProgress,
  SurahDetail,
} from '../types/quran';
import { AudioTrackState } from './MiniAudioPlayer';

interface SurahReaderScreenProps {
  surahNumber: number;
  targetAyahNumber: number | null;
  settings: ReaderSettings;
  readingProgress: ReadingProgress;
  audioTrack: AudioTrackState | null;
  t: Translations;
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  getBookmark: (surahNumber: number, ayahNumber: number) => BookmarkItem | undefined;
  onBackToList: () => void;
  onChangeSurah: (surahNumber: number, ayahNumber?: number) => void;
  onToggleBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  onSaveNote: (item: Omit<BookmarkItem, 'id' | 'createdAt'>, note: string) => void;
  onUpdateProgress: (surahNumber: number, ayahNumber: number) => void;
  onUpdateSettings: (partial: Partial<ReaderSettings>) => void;
  onPlayAyah: (surahNumber: number, ayah: Ayah, totalAyahs: number) => void;
  onToggleAudioPlay: () => void;
  onClearTargetAyah: () => void;
}

const ARABIC_SIZE_CLASSES: Record<ArabicSizeOption, string> = {
  compact: 'text-[22px] leading-[40px]',
  comfortable: 'text-[26px] leading-[48px]',
  large: 'text-[32px] leading-[58px]',
};

export function SurahReaderScreen({
  surahNumber,
  targetAyahNumber,
  settings,
  readingProgress,
  audioTrack,
  t,
  isBookmarked,
  getBookmark,
  onBackToList,
  onChangeSurah,
  onToggleBookmark,
  onSaveNote,
  onUpdateProgress,
  onUpdateSettings,
  onPlayAyah,
  onToggleAudioPlay,
  onClearTargetAyah,
}: SurahReaderScreenProps) {
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [editingNoteAyah, setEditingNoteAyah] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null);

  const ayahRefs = useRef<Map<number, HTMLElement>>(new Map());
  const surahSummary = getSurahSummary(surahNumber);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setEditingNoteAyah(null);

    fetchSurahDetail(surahNumber)
      .then((data) => {
        if (!cancelled) {
          setSurahDetail(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Erreur de chargement.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber]);

  // Smooth scroll to target ayah when coming from Continue Reading or Bookmarks
  useEffect(() => {
    if (!loading && surahDetail && targetAyahNumber) {
      const el = ayahRefs.current.get(targetAyahNumber);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedAyah(targetAyahNumber);
        });
        const timer = setTimeout(() => {
          setHighlightedAyah(null);
          onClearTargetAyah();
        }, 2800);
        return () => clearTimeout(timer);
      } else {
        onClearTargetAyah();
      }
    } else if (!loading && surahDetail && !targetAyahNumber) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [loading, surahDetail, targetAyahNumber, onClearTargetAyah]);

  const handleCopyVerse = async (ayah: Ayah) => {
    const payload = `${ayah.ar}\n\n« ${ayah.fr} »\n— Coran, ${surahSummary.transliteration} (${surahSummary.number}:${ayah.n})`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopiedAyah(ayah.n);
      setTimeout(() => setCopiedAyah((prev) => (prev === ayah.n ? null : prev)), 2000);
    } catch {
      // Clipboard blocked in some contexts
    }
  };

  const handleJumpToAyah = (ayahNum: number) => {
    const el = ayahRefs.current.get(ayahNum);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedAyah(ayahNum);
      setTimeout(() => setHighlightedAyah(null), 2200);
    }
  };

  const openNoteEditor = (ayah: Ayah) => {
    const existing = getBookmark(surahNumber, ayah.n);
    setNoteDraft(existing?.note ?? '');
    setEditingNoteAyah(ayah.n);
  };

  const commitNote = (ayah: Ayah) => {
    onSaveNote(
      {
        surahNumber,
        ayahNumber: ayah.n,
        globalAyahNumber: ayah.g,
        juz: ayah.j,
        ar: ayah.ar,
        fr: ayah.fr,
      },
      noteDraft
    );
    setEditingNoteAyah(null);
  };

  const isPlayingThisSurah =
    audioTrack?.surahNumber === surahNumber && audioTrack.isPlaying;

  const handlePlaySurah = () => {
    if (!surahDetail || surahDetail.ayahs.length === 0) return;
    if (audioTrack?.surahNumber === surahNumber) {
      onToggleAudioPlay();
    } else {
      onPlayAyah(surahNumber, surahDetail.ayahs[0], surahDetail.ayahs.length);
    }
  };

  const isDarkMode = settings.theme === 'dark';

  const renderSettingsControls = () => (
    <div className="space-y-5">
      {/* App Language Selector */}
      <div>
        <label
          htmlFor="app-language-select"
          className="block text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
        >
          {t.appLanguageLabel}
        </label>
        <select
          id="app-language-select"
          value={settings.language}
          onChange={(e) => onUpdateSettings({ language: e.target.value as AppLanguage })}
          className="w-full min-h-[44px] px-3 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
        >
          <option value="fr">Français</option>
          <option value="ff">Fulfulde (Pulaar)</option>
          <option value="ar">العربية (Arabe)</option>
        </select>
      </div>

      {/* Night Mode Toggle */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E6E1D8] dark:border-[#2C3530]">
        <div className="flex items-center gap-2.5 min-w-0">
          {isDarkMode ? (
            <Moon className="w-4 h-4 text-[#5EC4A6] shrink-0" />
          ) : (
            <Sun className="w-4 h-4 text-[#B8860B] shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
              {t.nightModeTitle}
            </p>
            <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8]">
              {t.nightModeSubtitle}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDarkMode}
          aria-label={t.nightModeTitle}
          onClick={() => onUpdateSettings({ theme: isDarkMode ? 'light' : 'dark' })}
          className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
            isDarkMode ? 'bg-[#0F5C4D]' : 'bg-[#D9DADE]'
          }`}
        >
          <span
            className={`block w-5 h-5 rounded-full bg-white transition-transform ${
              isDarkMode ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* French Translation Toggle */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E6E1D8] dark:border-[#2C3530]">
        <div>
          <p className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
            {t.frenchTranslationTitle}
          </p>
          <p className="text-xs text-[#5A5F66] dark:text-[#A4ADA8]">
            {t.frenchTranslationSubtitle}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.showFrench}
          aria-label={t.frenchTranslationTitle}
          onClick={() => onUpdateSettings({ showFrench: !settings.showFrench })}
          className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
            settings.showFrench ? 'bg-[#0F5C4D]' : 'bg-[#D9DADE] dark:bg-[#2C3530]'
          }`}
        >
          <span
            className={`block w-5 h-5 rounded-full bg-white transition-transform ${
              settings.showFrench ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Arabic Text Size */}
      <div>
        <p className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2">
          {t.arabicSizeTitle}
        </p>
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F2EFE9] dark:bg-[#232A26] rounded-lg">
          {(
            [
              { id: 'compact', label: t.sizeCompact },
              { id: 'comfortable', label: t.sizeComfortable },
              { id: 'large', label: t.sizeLarge },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onUpdateSettings({ arabicSize: opt.id })}
              className={`min-h-[36px] text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                settings.arabicSize === opt.id
                  ? 'bg-[#0F5C4D] text-white'
                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Arabic Font Selection */}
      <div>
        <label
          htmlFor="arabic-font-select"
          className="block text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
        >
          {t.arabicFontTitle}
        </label>
        <select
          id="arabic-font-select"
          value={settings.arabicFont}
          onChange={(e) => onUpdateSettings({ arabicFont: e.target.value as ArabicFontId })}
          className="w-full min-h-[44px] px-3 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
        >
          {ARABIC_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label} — {font.description}
            </option>
          ))}
        </select>
      </div>

      {/* French & Fulfulde Font Selection */}
      <div>
        <label
          htmlFor="latin-font-select"
          className="block text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
        >
          {t.latinFontTitle}
        </label>
        <select
          id="latin-font-select"
          value={settings.latinFont}
          onChange={(e) => onUpdateSettings({ latinFont: e.target.value as LatinFontId })}
          className="w-full min-h-[44px] px-3 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
        >
          {LATIN_FONTS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label} — {font.description}
            </option>
          ))}
        </select>
      </div>

      {/* Compact Live Font Preview */}
      <div className="bg-[#FAF8F5] dark:bg-[#121614] border border-[#E6E1D8] dark:border-[#2C3530] rounded-xl p-3 space-y-1.5">
        <p className="text-[11px] font-semibold text-[#5A5F66] dark:text-[#A4ADA8]">
          {t.fontPreviewTitle}
        </p>
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic-verse text-xl leading-9 text-right text-[#1C1E21] dark:text-[#ECE9E2]"
        >
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="font-french-prose text-xs leading-5 text-[#1C1E21] dark:text-[#E2DFD7]">
          Français · Fulfulde : Joom-yurmeende (ɓ, ɗ, ƴ, ŋ)
        </p>
      </div>

      {/* Reciter Selection */}
      <div>
        <label
          htmlFor="reciter-select"
          className="block text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
        >
          {t.reciterTitle}
        </label>
        <select
          id="reciter-select"
          value={settings.reciterId}
          onChange={(e) => onUpdateSettings({ reciterId: e.target.value })}
          className="w-full min-h-[44px] px-3 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
        >
          {RECITERS.map((reciter) => (
            <option key={reciter.id} value={reciter.id}>
              {reciter.name} ({reciter.style})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="pb-28 md:pb-16">
      {/* Mobile Compact Sticky Reading Top Bar (<= 48px) */}
      <div className="md:hidden sticky top-0 z-30 h-12 bg-[#FAF8F5]/95 dark:bg-[#121614]/95 backdrop-blur-md border-b border-[#E6E1D8] dark:border-[#2C3530] px-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToList}
          aria-label={t.backToSurahs}
          className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0F5C4D] dark:text-[#5EC4A6] cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
          <span>{t.navSurahsShort}</span>
        </button>

        <span className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] truncate tabular-nums">
          {surahSummary.number}. {surahSummary.transliteration}
        </span>

        <button
          type="button"
          onClick={() => setMobileSettingsOpen(true)}
          aria-label={t.readingSettings}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2] cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-5 sm:px-6 pt-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Desktop Left/Right Reading Column (Optimal 680px width) */}
          <div className="lg:col-span-8">
            <div className="max-w-[680px] mx-auto">
              {/* Desktop Breadcrumb Back Link */}
              <div className="hidden md:flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={onBackToList}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{t.backToSurahs}</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-[#5A5F66] dark:text-[#A4ADA8] tabular-nums">
                  <span>{t.surahCountLabel(surahSummary.number)}</span>
                </div>
              </div>

              {/* Surah Opening Card */}
              <header className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-6 sm:p-8 text-center mb-6">
                <p
                  className="font-arabic-verse text-3xl sm:text-4xl text-[#0F5C4D] dark:text-[#5EC4A6] leading-snug"
                  lang="ar"
                >
                  سُورَةُ {surahSummary.arabicName}
                </p>

                <h1 className="font-editorial text-[26px] sm:text-[28px] font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mt-3">
                  {surahSummary.transliteration} — {surahSummary.frenchTitle}
                </h1>

                <p className="text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-1.5 tabular-nums">
                  {t.surahPrefix(surahSummary.number)} ·{' '}
                  {t.revelationLabel(surahSummary.revelation)} ·{' '}
                  {t.versesCountLabel(surahSummary.ayahCount)} · Juz {surahSummary.juz}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlaySurah}
                    disabled={loading || !surahDetail}
                    className="min-h-[48px] px-5 py-2.5 bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] disabled:opacity-50 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {isPlayingThisSurah ? (
                      <>
                        <Pause className="w-4 h-4" fill="currentColor" />
                        <span>{t.pauseAudio}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" fill="currentColor" />
                        <span>{t.listenSurah}</span>
                      </>
                    )}
                  </button>

                  {surahDetail && (
                    <select
                      aria-label={t.jumpToVerse}
                      value=""
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val) handleJumpToAyah(val);
                      }}
                      className="min-h-[48px] px-4 py-2 bg-[#F2EFE9] dark:bg-[#232A26] hover:bg-[#E8E4DB] dark:hover:bg-[#2C3530] text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg cursor-pointer"
                    >
                      <option value="" disabled>
                        {t.jumpToVerse}
                      </option>
                      {surahDetail.ayahs.map((a) => (
                        <option key={a.n} value={a.n}>
                          {t.verseLabel(a.n)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </header>

              {/* Bismillah Banner (All Surahs except Al-Fatiha #1 and At-Tawbah #9) */}
              {surahNumber !== 1 && surahNumber !== 9 && (
                <div className="py-6 px-4 text-center border-b border-[#E6E1D8] dark:border-[#2C3530]">
                  <p
                    className="font-arabic-verse text-2xl sm:text-3xl text-[#1C1E21] dark:text-[#ECE9E2]"
                    lang="ar"
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                  {settings.showFrench && (
                    <p className="font-french-prose italic text-sm text-[#5A5F66] dark:text-[#A4ADA8] mt-2">
                      Au nom d&apos;Allah, le Tout Miséricordieux, le Très Miséricordieux.
                    </p>
                  )}
                </div>
              )}

              {/* Loading / Error / Verse List */}
              {loading && (
                <div className="py-12 space-y-6" aria-busy="true">
                  {[1, 2, 3, 4].map((skeleton) => (
                    <div
                      key={skeleton}
                      className="py-6 border-b border-[#E6E1D8] dark:border-[#2C3530] animate-pulse space-y-4"
                    >
                      <div className="h-4 w-24 bg-[#E6E1D8] dark:bg-[#2C3530] rounded" />
                      <div className="h-7 w-4/5 ml-auto bg-[#E6E1D8] dark:bg-[#2C3530] rounded" />
                      <div className="h-4 w-full bg-[#F2EFE9] dark:bg-[#232A26] rounded" />
                      <div className="h-4 w-2/3 bg-[#F2EFE9] dark:bg-[#232A26] rounded" />
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-8 text-center my-6">
                  <p className="font-editorial text-lg font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => onChangeSurah(surahNumber)}
                    className="mt-4 min-h-[44px] px-4 py-2 bg-[#0F5C4D] text-white text-sm font-semibold rounded-lg cursor-pointer"
                  >
                    {t.retry}
                  </button>
                </div>
              )}

              {!loading && !error && surahDetail && (
                <section aria-label={t.navReader}>
                  {surahDetail.ayahs.map((ayah) => {
                    const bookmarked = isBookmarked(surahNumber, ayah.n);
                    const bookmarkData = getBookmark(surahNumber, ayah.n);
                    const isPlayingThisAyah =
                      audioTrack?.surahNumber === surahNumber &&
                      audioTrack?.ayahNumber === ayah.n &&
                      audioTrack.isPlaying;
                    const isAudioCurrent =
                      audioTrack?.surahNumber === surahNumber &&
                      audioTrack?.ayahNumber === ayah.n;
                    const isProgressHere =
                      readingProgress.surahNumber === surahNumber &&
                      readingProgress.ayahNumber === ayah.n;
                    const isHighlighted = highlightedAyah === ayah.n || isAudioCurrent;

                    return (
                      <article
                        key={ayah.n}
                        ref={(el) => {
                          if (el) ayahRefs.current.set(ayah.n, el);
                          else ayahRefs.current.delete(ayah.n);
                        }}
                        className={`py-7 border-b border-[#E6E1D8] dark:border-[#2C3530] transition-colors duration-300 ${
                          isHighlighted
                            ? 'bg-[#0F5C4D]/[0.045] dark:bg-[#5EC4A6]/[0.08] rounded-2xl px-4 -mx-4'
                            : ''
                        }`}
                      >
                        {/* Verse Utility Row */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-[#5A5F66] dark:text-[#A4ADA8] tabular-nums">
                            <span className="font-semibold text-sm text-[#0F5C4D] dark:text-[#5EC4A6]">
                              {surahNumber}:{ayah.n}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Juz {ayah.j}</span>
                            <span aria-hidden="true">·</span>
                            <span>Page {ayah.p}</span>
                            {isProgressHere && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#0F5C4D] dark:text-[#5EC4A6] font-semibold">
                                  {t.currentPosition}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Verse Actions (44px+ hit targets) */}
                          <div className="flex items-center -mr-2">
                            <button
                              type="button"
                              onClick={() => onUpdateProgress(surahNumber, ayah.n)}
                              title={t.currentPosition}
                              aria-label={`${t.currentPosition} ${ayah.n}`}
                              className={`min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                isProgressHere
                                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6]'
                              }`}
                            >
                              <MapPin className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (isAudioCurrent) {
                                  onToggleAudioPlay();
                                } else {
                                  onPlayAyah(surahNumber, ayah, surahDetail.ayahs.length);
                                }
                              }}
                              title={isPlayingThisAyah ? t.pauseAudio : t.listenSurah}
                              aria-label={t.verseLabel(ayah.n)}
                              className={`min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                isAudioCurrent
                                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6]'
                              }`}
                            >
                              {isPlayingThisAyah ? (
                                <Pause className="w-4 h-4" fill="currentColor" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => openNoteEditor(ayah)}
                              title={t.personalNote}
                              aria-label={t.noteTitleForVerse(surahNumber, ayah.n)}
                              className={`min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                bookmarkData?.note
                                  ? 'text-[#0F5C4D] dark:text-[#5EC4A6]'
                                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2]'
                              }`}
                            >
                              <PenLine className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                onToggleBookmark({
                                  surahNumber,
                                  ayahNumber: ayah.n,
                                  globalAyahNumber: ayah.g,
                                  juz: ayah.j,
                                  ar: ayah.ar,
                                  fr: ayah.fr,
                                })
                              }
                              title={t.navBookmarks}
                              aria-label={`${t.navBookmarks} ${ayah.n}`}
                              className={`min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                bookmarked
                                  ? 'text-[#B8860B] dark:text-[#E0AF3E]'
                                  : 'text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#B8860B] dark:hover:text-[#E0AF3E]'
                              }`}
                            >
                              <Bookmark
                                className="w-4 h-4"
                                fill={bookmarked ? 'currentColor' : 'none'}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyVerse(ayah)}
                              title="Copier"
                              aria-label={`Copier ${ayah.n}`}
                              className="min-h-[44px] min-w-[40px] flex items-center justify-center rounded-lg text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2] transition-colors cursor-pointer"
                            >
                              {copiedAyah === ayah.n ? (
                                <Check className="w-4 h-4 text-[#0F5C4D] dark:text-[#5EC4A6]" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Arabic Verse Text with Warm Gold Verse End Rosette */}
                        <p
                          lang="ar"
                          dir="rtl"
                          className={`font-arabic-verse text-right text-[#1C1E21] dark:text-[#ECE9E2] ${
                            ARABIC_SIZE_CLASSES[settings.arabicSize]
                          }`}
                        >
                          {ayah.ar}{' '}
                          <span
                            className="text-[#B8860B] dark:text-[#E0AF3E] text-[0.85em] px-1 select-none inline-block"
                            aria-hidden="true"
                          >
                            ﴿{toArabicIndicDigits(ayah.n)}﴾
                          </span>
                        </p>

                        {/* French Translation */}
                        {settings.showFrench && (
                          <p
                            dir="ltr"
                            className="font-french-prose text-[17px] sm:text-[18px] leading-[29px] sm:leading-[30px] text-[#1C1E21] dark:text-[#E2DFD7] dark:tracking-[0.005em] mt-4"
                          >
                            {ayah.fr}
                          </p>
                        )}

                        {/* Saved Personal Note Display */}
                        {bookmarkData?.note && editingNoteAyah !== ayah.n && (
                          <div className="mt-4 bg-[#F2EFE9]/75 dark:bg-[#232A26] rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                            <div className="text-sm text-[#1C1E21] dark:text-[#ECE9E2]">
                              <span className="font-semibold text-xs text-[#0F5C4D] dark:text-[#5EC4A6] block mb-0.5">
                                {t.personalNote}
                              </span>
                              <p className="font-french-prose leading-relaxed">{bookmarkData.note}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => openNoteEditor(ayah)}
                              className="text-xs font-semibold text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] shrink-0 py-1 cursor-pointer"
                            >
                              {t.edit}
                            </button>
                          </div>
                        )}

                        {/* Inline Note Editor */}
                        {editingNoteAyah === ayah.n && (
                          <div className="mt-4 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-xl p-4">
                            <label
                              htmlFor={`note-input-${ayah.n}`}
                              className="block text-xs font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-2"
                            >
                              {t.noteTitleForVerse(surahNumber, ayah.n)}
                            </label>
                            <textarea
                              id={`note-input-${ayah.n}`}
                              rows={3}
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder={t.notePlaceholder}
                              className="font-french-prose w-full p-3 bg-[#FAF8F5] dark:bg-[#121614] border border-[#E6E1D8] dark:border-[#2C3530] rounded-lg text-sm text-[#1C1E21] dark:text-[#ECE9E2] placeholder:text-[#5A5F66] dark:placeholder:text-[#A4ADA8] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none resize-y"
                            />
                            <div className="mt-3 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingNoteAyah(null)}
                                className="min-h-[40px] px-4 py-1.5 text-xs font-semibold text-[#5A5F66] dark:text-[#A4ADA8] hover:text-[#1C1E21] dark:hover:text-[#ECE9E2] rounded-lg cursor-pointer"
                              >
                                {t.cancel}
                              </button>
                              <button
                                type="button"
                                onClick={() => commitNote(ayah)}
                                className="min-h-[40px] px-4 py-1.5 text-xs font-semibold bg-[#0F5C4D] hover:bg-[#004337] dark:hover:bg-[#14725F] text-white rounded-lg cursor-pointer"
                              >
                                {t.saveNote}
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </section>
              )}

              {/* Previous / Next Surah Footer Navigation */}
              <nav
                aria-label="Navigation entre les sourates"
                className="mt-8 pt-4 flex items-center justify-between gap-3"
              >
                {surahNumber > 1 ? (
                  <button
                    type="button"
                    onClick={() => onChangeSurah(surahNumber - 1)}
                    className="min-h-[48px] px-4 py-2.5 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6] rounded-xl inline-flex items-center gap-2 text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0 rtl:rotate-180" />
                    <span className="truncate">
                      {getSurahSummary(surahNumber - 1).transliteration}
                    </span>
                  </button>
                ) : (
                  <div />
                )}

                {surahNumber < 114 && (
                  <button
                    type="button"
                    onClick={() => onChangeSurah(surahNumber + 1)}
                    className="min-h-[48px] px-4 py-2.5 bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] hover:border-[#0F5C4D] dark:hover:border-[#5EC4A6] rounded-xl inline-flex items-center gap-2 text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] hover:text-[#0F5C4D] dark:hover:text-[#5EC4A6] transition-colors cursor-pointer ml-auto"
                  >
                    <span className="truncate">
                      {getSurahSummary(surahNumber + 1).transliteration}
                    </span>
                    <ChevronRight className="w-4 h-4 shrink-0 rtl:rotate-180" />
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Desktop Quiet Reading Controls Sidebar */}
          <aside
            aria-label={t.readingSettings}
            className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4"
          >
            <div className="bg-white dark:bg-[#1A201D] border border-[#E6E1D8] dark:border-[#2C3530] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-4">
                {t.changeSurah}
              </h2>
              <select
                aria-label={t.changeSurah}
                value={surahNumber}
                onChange={(e) => onChangeSurah(Number(e.target.value))}
                className="w-full min-h-[44px] px-3 py-2 bg-[#F2EFE9] dark:bg-[#232A26] text-sm font-medium text-[#1C1E21] dark:text-[#ECE9E2] rounded-lg border border-transparent focus:bg-white dark:focus:bg-[#1A201D] focus:border-[#0F5C4D] dark:focus:border-[#5EC4A6] focus:outline-none cursor-pointer"
              >
                {SURAHS_INDEX.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.transliteration} — {s.frenchTitle}
                  </option>
                ))}
              </select>

              <div className="mt-6 pt-5 border-t border-[#E6E1D8] dark:border-[#2C3530]">
                <h2 className="text-sm font-semibold text-[#1C1E21] dark:text-[#ECE9E2] mb-4">
                  {t.readingSettings}
                </h2>
                {renderSettingsControls()}
              </div>

              <div className="mt-6 pt-5 border-t border-[#E6E1D8] dark:border-[#2C3530] flex items-center justify-between text-xs text-[#5A5F66] dark:text-[#A4ADA8] tabular-nums">
                <span>{t.savedPositionLabel}</span>
                <span className="font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
                  {getSurahSummary(readingProgress.surahNumber).transliteration} (v.{' '}
                  {readingProgress.ayahNumber})
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Sheet for Reading Settings */}
      {mobileSettingsOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-xs"
          onClick={() => setMobileSettingsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.readingSettings}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1A201D] rounded-t-3xl p-6 pb-8 border-t border-[#E6E1D8] dark:border-[#2C3530]"
          >
            <div className="w-10 h-1.5 bg-[#D9DADE] dark:bg-[#3A443F] rounded-full mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-editorial text-lg font-semibold text-[#1C1E21] dark:text-[#ECE9E2]">
                {t.readingSettings}
              </h2>
              <button
                type="button"
                onClick={() => setMobileSettingsOpen(false)}
                aria-label={t.cancel}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#5A5F66] dark:text-[#A4ADA8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSettingsControls()}
          </div>
        </div>
      )}
    </div>
  );
}
