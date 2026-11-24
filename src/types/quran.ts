export type ScreenId = 'surahs' | 'reader' | 'bookmarks';

export type RevelationType = 'Mecquoise' | 'Médinoise';

export interface SurahSummary {
  number: number;
  arabicName: string;
  transliteration: string;
  frenchTitle: string;
  revelation: RevelationType;
  ayahCount: number;
  juz: number;
}

export interface Ayah {
  /** Verse number inside the surah (1-based) */
  n: number;
  /** Global ayah number (1..6236) used for audio CDN */
  g: number;
  /** Juz number (1..30) */
  j: number;
  /** Mushaf page number (1..604) */
  p: number;
  /** Arabic Uthmani text */
  ar: string;
  /** French translation (Hamidullah) */
  fr: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  revelationType: 'Meccan' | 'Medinan';
  ayahs: Ayah[];
  source?: 'alquran-cloud' | 'local-cache';
}

export interface BookmarkItem {
  id: string; // `${surahNumber}:${ayahNumber}`
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber: number;
  juz: number;
  ar: string;
  fr: string;
  note?: string;
  createdAt: string; // ISO date string
}

export interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: string;
}

export type ArabicSizeOption = 'compact' | 'comfortable' | 'large';

export interface ReaderSettings {
  showFrench: boolean;
  arabicSize: ArabicSizeOption;
  reciterId: string;
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  bitrate: 64 | 128;
  everyAyahFolder: string;
}
