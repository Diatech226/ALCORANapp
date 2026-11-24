import { RECITERS } from '../data/surahsIndex';
import { SurahDetail } from '../types/quran';

const ALQURAN_CLOUD_BASE = 'https://api.alquran.cloud/v1';
const BISMILLAH_PREFIX = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const surahCache = new Map<number, SurahDetail>();

interface AlQuranCloudEditionResponse {
  code: number;
  data: Array<{
    number: number;
    name: string;
    englishName: string;
    revelationType: 'Meccan' | 'Medinan';
    ayahs: Array<{
      number: number;
      numberInSurah: number;
      juz: number;
      page: number;
      text: string;
    }>;
  }>;
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

export function getAudioUrls(
  reciterId: string,
  surahNumber: number,
  ayahNumber: number,
  globalAyahNumber: number
): { primary: string; fallback: string } {
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];
  return {
    primary: `https://cdn.islamic.network/quran/audio/${reciter.bitrate}/${reciter.id}/${globalAyahNumber}.mp3`,
    fallback: `https://everyayah.com/data/${reciter.everyAyahFolder}/${pad3(surahNumber)}${pad3(ayahNumber)}.mp3`,
  };
}

async function fetchFromOpenSourceApi(surahNumber: number): Promise<SurahDetail> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `${ALQURAN_CLOUD_BASE}/surah/${surahNumber}/editions/quran-uthmani,fr.hamidullah`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = (await response.json()) as AlQuranCloudEditionResponse;
    const arEdition = payload.data?.[0];
    const frEdition = payload.data?.[1];

    if (!arEdition || !frEdition || !Array.isArray(arEdition.ayahs)) {
      throw new Error('Réponse incomplète de la base AlQuran Cloud.');
    }

    const ayahs = arEdition.ayahs.map((a, idx) => {
      let ar = a.text.replace(/^\uFEFF/, '').trim();
      if (idx === 0 && surahNumber !== 1 && surahNumber !== 9 && ar.startsWith(BISMILLAH_PREFIX)) {
        ar = ar.slice(BISMILLAH_PREFIX.length).trim();
      }
      const fr = (frEdition.ayahs[idx]?.text ?? '').trim();
      return {
        n: a.numberInSurah,
        g: a.number,
        j: a.juz,
        p: a.page,
        ar,
        fr,
      };
    });

    return {
      number: arEdition.number,
      name: arEdition.name,
      englishName: arEdition.englishName,
      revelationType: arEdition.revelationType,
      ayahs,
      source: 'alquran-cloud',
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromLocalCache(surahNumber: number): Promise<SurahDetail> {
  const response = await fetch(`/data/surahs/${surahNumber}.json`);
  if (!response.ok) {
    throw new Error(`Impossible de charger la sourate ${surahNumber}.`);
  }
  const data = (await response.json()) as SurahDetail;
  return { ...data, source: 'local-cache' };
}

export async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const normalized = Math.max(1, Math.min(114, Math.floor(surahNumber)));
  const cached = surahCache.get(normalized);
  if (cached) {
    return cached;
  }

  try {
    const apiData = await fetchFromOpenSourceApi(normalized);
    surahCache.set(normalized, apiData);
    return apiData;
  } catch {
    const localData = await fetchFromLocalCache(normalized);
    surahCache.set(normalized, localData);
    return localData;
  }
}
