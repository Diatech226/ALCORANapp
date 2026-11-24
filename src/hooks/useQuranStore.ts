import { useCallback, useEffect, useState } from 'react';
import { ARABIC_FONTS, LATIN_FONTS, RECITERS } from '../data/surahsIndex';
import { fetchSurahDetail } from '../services/quranService';
import { AppLanguage, BookmarkItem, ReaderSettings, ReadingProgress } from '../types/quran';

const STORAGE_KEYS = {
  bookmarks: 'quran_fr_bookmarks_v1',
  seeded: 'quran_fr_bookmarks_seeded_v1',
  progress: 'quran_fr_progress_v1',
  settings: 'quran_fr_settings_v1',
  langOnboarded: 'quran_fr_lang_onboarded_v1',
};

const DEFAULT_PROGRESS: ReadingProgress = {
  surahNumber: 1,
  ayahNumber: 1,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_SETTINGS: ReaderSettings = {
  showFrench: true,
  arabicSize: 'comfortable',
  reciterId: 'ar.alafasy',
  theme: 'light',
  arabicFont: 'amiri',
  latinFont: 'literata',
  language: 'fr',
};

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useQuranStore() {
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.langOnboarded) === '1';
    } catch {
      return false;
    }
  });
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() =>
    safeReadJson<BookmarkItem[]>(STORAGE_KEYS.bookmarks, [])
  );
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() =>
    safeReadJson<ReadingProgress>(STORAGE_KEYS.progress, DEFAULT_PROGRESS)
  );
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const stored = safeReadJson<ReaderSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
    const validReciter = RECITERS.some((r) => r.id === stored.reciterId);
    const validTheme = stored.theme === 'dark' || stored.theme === 'light' ? stored.theme : 'light';
    const validArabicFont = ARABIC_FONTS.some((f) => f.id === stored.arabicFont);
    const validLatinFont = LATIN_FONTS.some((f) => f.id === stored.latinFont);
    const validLanguage =
      stored.language === 'fr' || stored.language === 'ff' || stored.language === 'ar'
        ? stored.language
        : DEFAULT_SETTINGS.language;
    return {
      ...DEFAULT_SETTINGS,
      ...stored,
      reciterId: validReciter ? stored.reciterId : DEFAULT_SETTINGS.reciterId,
      theme: validTheme,
      arabicFont: validArabicFont ? stored.arabicFont : DEFAULT_SETTINGS.arabicFont,
      latinFont: validLatinFont ? stored.latinFont : DEFAULT_SETTINGS.latinFont,
      language: validLanguage,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
    } catch {
      // Ignore storage quota errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(readingProgress));
    } catch {
      // Ignore storage quota errors
    }
  }, [readingProgress]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    const arabicFontOption =
      ARABIC_FONTS.find((f) => f.id === settings.arabicFont) ?? ARABIC_FONTS[0];
    const latinFontOption =
      LATIN_FONTS.find((f) => f.id === settings.latinFont) ?? LATIN_FONTS[0];
    document.documentElement.style.setProperty(
      '--reader-arabic-font',
      arabicFontOption.cssFamily
    );
    document.documentElement.style.setProperty(
      '--reader-latin-font',
      latinFontOption.cssFamily
    );

    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  // Seed initial starter bookmarks dynamically from static JSON on first visit
  useEffect(() => {
    const alreadySeeded = localStorage.getItem(STORAGE_KEYS.seeded);
    const existing = safeReadJson<BookmarkItem[]>(STORAGE_KEYS.bookmarks, []);
    if (alreadySeeded || existing.length > 0) {
      return;
    }

    let cancelled = false;
    async function seedStarterBookmarks() {
      try {
        const [s1, s2, s94] = await Promise.all([
          fetchSurahDetail(1),
          fetchSurahDetail(2),
          fetchSurahDetail(94),
        ]);
        if (cancelled) return;

        const now = new Date().toISOString();
        const starterRefs: Array<{
          surah: typeof s1;
          ayahNum: number;
          note: string;
        }> = [
          {
            surah: s1,
            ayahNum: 5,
            note: 'Verset central de la sourate Al-Fatiha : adoration et demande d’aide.',
          },
          {
            surah: s2,
            ayahNum: 255,
            note: 'Ayat al-Kursi — le verset du Trône, à méditer matin et soir.',
          },
          {
            surah: s94,
            ayahNum: 6,
            note: 'Rappel apaisant : chaque difficulté est accompagnée d’une facilité.',
          },
        ];

        const seededItems: BookmarkItem[] = [];
        for (const ref of starterRefs) {
          const ayah = ref.surah.ayahs.find((a) => a.n === ref.ayahNum);
          if (ayah) {
            seededItems.push({
              id: `${ref.surah.number}:${ayah.n}`,
              surahNumber: ref.surah.number,
              ayahNumber: ayah.n,
              globalAyahNumber: ayah.g,
              juz: ayah.j,
              ar: ayah.ar,
              fr: ayah.fr,
              note: ref.note,
              createdAt: now,
            });
          }
        }

        localStorage.setItem(STORAGE_KEYS.seeded, '1');
        if (seededItems.length > 0) {
          setBookmarks(seededItems);
        }
      } catch {
        // Ignore if seeding fails
      }
    }

    seedStarterBookmarks();
    return () => {
      cancelled = true;
    };
  }, []);

  const isBookmarked = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const id = `${surahNumber}:${ayahNumber}`;
      return bookmarks.some((b) => b.id === id);
    },
    [bookmarks]
  );

  const getBookmark = useCallback(
    (surahNumber: number, ayahNumber: number) => {
      const id = `${surahNumber}:${ayahNumber}`;
      return bookmarks.find((b) => b.id === id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
      const id = `${item.surahNumber}:${item.ayahNumber}`;
      localStorage.setItem(STORAGE_KEYS.seeded, '1');
      setBookmarks((prev) => {
        const exists = prev.some((b) => b.id === id);
        if (exists) {
          return prev.filter((b) => b.id !== id);
        }
        return [
          {
            ...item,
            id,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
    []
  );

  const saveBookmarkNote = useCallback(
    (item: Omit<BookmarkItem, 'id' | 'createdAt'>, noteText: string) => {
      const id = `${item.surahNumber}:${item.ayahNumber}`;
      const cleaned = noteText.trim();
      localStorage.setItem(STORAGE_KEYS.seeded, '1');
      setBookmarks((prev) => {
        const existingIndex = prev.findIndex((b) => b.id === id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            note: cleaned || undefined,
          };
          return updated;
        }
        return [
          {
            ...item,
            id,
            note: cleaned || undefined,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
    []
  );

  const removeBookmark = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEYS.seeded, '1');
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const updateProgress = useCallback((surahNumber: number, ayahNumber: number) => {
    setReadingProgress({
      surahNumber,
      ayahNumber,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const completeLanguageOnboarding = useCallback((language: AppLanguage) => {
    try {
      localStorage.setItem(STORAGE_KEYS.langOnboarded, '1');
    } catch {
      // Ignore storage errors
    }
    setSettings((prev) => ({
      ...prev,
      language,
      latinFont: language === 'ff' && prev.latinFont === 'literata' ? 'andika' : prev.latinFont,
    }));
    setHasSelectedLanguage(true);
  }, []);

  return {
    hasSelectedLanguage,
    bookmarks,
    readingProgress,
    settings,
    isBookmarked,
    getBookmark,
    toggleBookmark,
    saveBookmarkNote,
    removeBookmark,
    updateProgress,
    updateSettings,
    completeLanguageOnboarding,
  };
}
