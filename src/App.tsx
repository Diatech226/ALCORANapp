import { useCallback, useEffect, useRef, useState } from 'react';
import { BookmarksScreen } from './components/BookmarksScreen';
import { AudioTrackState, MiniAudioPlayer } from './components/MiniAudioPlayer';
import { SurahListScreen } from './components/SurahListScreen';
import { SurahReaderScreen } from './components/SurahReaderScreen';
import { TopNav } from './components/TopNav';
import { useQuranStore } from './hooks/useQuranStore';
import { fetchSurahDetail, getAudioUrls } from './services/quranService';
import { Ayah, ScreenId } from './types/quran';

export default function App() {
  const {
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
  } = useQuranStore();

  // Initial screen is always Screen 1: Liste des Sourates
  const [activeScreen, setActiveScreen] = useState<ScreenId>('surahs');
  const [activeSurahNumber, setActiveSurahNumber] = useState<number>(
    readingProgress.surahNumber || 1
  );
  const [targetAyahNumber, setTargetAyahNumber] = useState<number | null>(null);
  const [audioTrack, setAudioTrack] = useState<AudioTrackState | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioTrackRef = useRef<AudioTrackState | null>(null);
  const reciterRef = useRef<string>(settings.reciterId);
  const fallbackUrlRef = useRef<string | null>(null);

  useEffect(() => {
    audioTrackRef.current = audioTrack;
  }, [audioTrack]);

  useEffect(() => {
    reciterRef.current = settings.reciterId;
  }, [settings.reciterId]);

  const startAudioPlayback = useCallback(
    (surahNum: number, ayahNum: number, totalAyahs: number, globalAyahNum: number) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      const urls = getAudioUrls(reciterRef.current, surahNum, ayahNum, globalAyahNum);
      fallbackUrlRef.current = urls.fallback;
      audio.src = urls.primary;
      audio.load();

      setAudioTrack({
        surahNumber: surahNum,
        ayahNumber: ayahNum,
        totalAyahs,
        globalAyahNumber: globalAyahNum,
        isPlaying: true,
        progressPercent: 0,
      });

      audio.play().catch(() => {
        if (fallbackUrlRef.current && audio.src !== fallbackUrlRef.current) {
          const fb = fallbackUrlRef.current;
          fallbackUrlRef.current = null;
          audio.src = fb;
          audio.load();
          audio.play().catch(() => {
            setAudioTrack((prev) =>
              prev
                ? {
                    ...prev,
                    isPlaying: false,
                    errorMessage: 'Flux audio indisponible hors ligne',
                  }
                : null
            );
          });
        } else {
          setAudioTrack((prev) =>
            prev
              ? {
                  ...prev,
                  isPlaying: false,
                  errorMessage: 'Flux audio indisponible hors ligne',
                }
              : null
          );
        }
      });
    },
    []
  );

  const playAyahTrack = useCallback(
    async (surahNum: number, ayahNum: number) => {
      try {
        const surah = await fetchSurahDetail(surahNum);
        const ayah = surah.ayahs.find((a) => a.n === ayahNum);
        if (!ayah) return;
        startAudioPlayback(surahNum, ayah.n, surah.ayahs.length, ayah.g);
      } catch {
        setAudioTrack((prev) =>
          prev
            ? {
                ...prev,
                isPlaying: false,
                errorMessage: 'Flux audio indisponible hors ligne',
              }
            : null
        );
      }
    },
    [startAudioPlayback]
  );

  // Wire persistent HTML5 Audio element listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      setAudioTrack((prev) => (prev ? { ...prev, progressPercent: pct } : null));
    };

    const handleEnded = () => {
      const current = audioTrackRef.current;
      if (!current) return;
      if (current.ayahNumber < current.totalAyahs) {
        playAyahTrack(current.surahNumber, current.ayahNumber + 1);
      } else {
        setAudioTrack((prev) =>
          prev ? { ...prev, isPlaying: false, progressPercent: 100 } : null
        );
      }
    };

    const handleError = () => {
      if (fallbackUrlRef.current) {
        const fb = fallbackUrlRef.current;
        fallbackUrlRef.current = null;
        audio.src = fb;
        audio.load();
        audio.play().catch(() => {
          setAudioTrack((prev) =>
            prev
              ? {
                  ...prev,
                  isPlaying: false,
                  errorMessage: 'Impossible de lire le flux audio',
                }
              : null
          );
        });
        return;
      }

      setAudioTrack((prev) =>
        prev
          ? {
              ...prev,
              isPlaying: false,
              errorMessage: 'Impossible de lire le flux audio',
            }
          : null
      );
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playAyahTrack]);

  // Reload track if user switches reciter while a track is active
  useEffect(() => {
    const current = audioTrackRef.current;
    if (current && current.isPlaying) {
      playAyahTrack(current.surahNumber, current.ayahNumber);
    }
  }, [settings.reciterId, playAyahTrack]);

  const handleOpenSurah = useCallback(
    (surahNumber: number, ayahNumber?: number) => {
      setActiveSurahNumber(surahNumber);
      setTargetAyahNumber(ayahNumber ?? null);
      setActiveScreen('reader');
      updateProgress(surahNumber, ayahNumber ?? 1);
    },
    [updateProgress]
  );

  const handleNavigate = useCallback((screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleResumeReading = useCallback(() => {
    handleOpenSurah(readingProgress.surahNumber, readingProgress.ayahNumber);
  }, [handleOpenSurah, readingProgress]);

  const handlePlayAyahFromReader = useCallback(
    (surahNumber: number, ayah: Ayah, totalAyahs: number) => {
      startAudioPlayback(surahNumber, ayah.n, totalAyahs, ayah.g);
    },
    [startAudioPlayback]
  );

  const handleToggleAudioPlay = useCallback(() => {
    const audio = audioRef.current;
    const current = audioTrackRef.current;
    if (!audio || !current) return;

    if (current.isPlaying) {
      audio.pause();
      setAudioTrack((prev) => (prev ? { ...prev, isPlaying: false } : null));
    } else {
      audio
        .play()
        .then(() => {
          setAudioTrack((prev) =>
            prev ? { ...prev, isPlaying: true, errorMessage: undefined } : null
          );
        })
        .catch(() => {
          setAudioTrack((prev) =>
            prev
              ? {
                  ...prev,
                  isPlaying: false,
                  errorMessage: 'Flux audio indisponible hors ligne',
                }
              : null
          );
        });
    }
  }, []);

  const handlePrevAyah = useCallback(() => {
    const current = audioTrackRef.current;
    if (!current || current.ayahNumber <= 1) return;
    playAyahTrack(current.surahNumber, current.ayahNumber - 1);
  }, [playAyahTrack]);

  const handleNextAyah = useCallback(() => {
    const current = audioTrackRef.current;
    if (!current || current.ayahNumber >= current.totalAyahs) return;
    playAyahTrack(current.surahNumber, current.ayahNumber + 1);
  }, [playAyahTrack]);

  const handleCloseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setAudioTrack(null);
  }, []);

  const clearTargetAyah = useCallback(() => {
    setTargetAyahNumber(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1E21]">
      <TopNav
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        onResumeReading={handleResumeReading}
        bookmarkCount={bookmarks.length}
      />

      {activeScreen === 'surahs' && (
        <SurahListScreen
          readingProgress={readingProgress}
          bookmarks={bookmarks}
          onSelectSurah={handleOpenSurah}
        />
      )}

      {activeScreen === 'reader' && (
        <SurahReaderScreen
          surahNumber={activeSurahNumber}
          targetAyahNumber={targetAyahNumber}
          settings={settings}
          readingProgress={readingProgress}
          audioTrack={audioTrack}
          isBookmarked={isBookmarked}
          getBookmark={getBookmark}
          onBackToList={() => handleNavigate('surahs')}
          onChangeSurah={handleOpenSurah}
          onToggleBookmark={toggleBookmark}
          onSaveNote={saveBookmarkNote}
          onUpdateProgress={updateProgress}
          onUpdateSettings={updateSettings}
          onPlayAyah={handlePlayAyahFromReader}
          onToggleAudioPlay={handleToggleAudioPlay}
          onClearTargetAyah={clearTargetAyah}
        />
      )}

      {activeScreen === 'bookmarks' && (
        <BookmarksScreen
          bookmarks={bookmarks}
          readingProgress={readingProgress}
          onOpenAyah={handleOpenSurah}
          onRemoveBookmark={removeBookmark}
          onUpdateNote={saveBookmarkNote}
          onGoToSurahs={() => handleNavigate('surahs')}
        />
      )}

      {audioTrack && (
        <MiniAudioPlayer
          track={audioTrack}
          reciterId={settings.reciterId}
          onTogglePlay={handleToggleAudioPlay}
          onPrevAyah={handlePrevAyah}
          onNextAyah={handleNextAyah}
          onClose={handleCloseAudio}
          onOpenSurah={handleOpenSurah}
        />
      )}
    </div>
  );
}
