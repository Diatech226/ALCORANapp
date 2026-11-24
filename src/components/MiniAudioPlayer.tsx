import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { RECITERS, getSurahSummary } from '../data/surahsIndex';

export interface AudioTrackState {
  surahNumber: number;
  ayahNumber: number;
  totalAyahs: number;
  globalAyahNumber: number;
  isPlaying: boolean;
  progressPercent: number;
  errorMessage?: string;
}

interface MiniAudioPlayerProps {
  track: AudioTrackState;
  reciterId: string;
  onTogglePlay: () => void;
  onPrevAyah: () => void;
  onNextAyah: () => void;
  onClose: () => void;
  onOpenSurah: (surahNumber: number, ayahNumber: number) => void;
}

export function MiniAudioPlayer({
  track,
  reciterId,
  onTogglePlay,
  onPrevAyah,
  onNextAyah,
  onClose,
  onOpenSurah,
}: MiniAudioPlayerProps) {
  const surah = getSurahSummary(track.surahNumber);
  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0];

  return (
    <div
      role="region"
      aria-label="Lecteur audio du Coran"
      className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-30 bg-white/95 backdrop-blur-md border border-[#E6E1D8] rounded-2xl shadow-[0_4px_20px_rgba(28,30,33,0.08)] overflow-hidden"
    >
      {/* Progress Bar */}
      <div className="h-1 w-full bg-[#F2EFE9]">
        <div
          className="h-full bg-[#0F5C4D] transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, track.progressPercent))}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpenSurah(track.surahNumber, track.ayahNumber)}
          className="min-w-0 flex-1 text-left cursor-pointer group"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1E21] group-hover:text-[#0F5C4D] transition-colors truncate">
            <Volume2 className="w-4 h-4 text-[#0F5C4D] shrink-0" />
            <span className="truncate">
              {surah.transliteration} · Verset {track.ayahNumber}/{track.totalAyahs}
            </span>
          </div>
          <p className="text-xs text-[#5A5F66] truncate mt-0.5 tabular-nums">
            {track.errorMessage ? track.errorMessage : reciter.name}
          </p>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onPrevAyah}
            disabled={track.ayahNumber <= 1}
            aria-label="Verset précédent"
            className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#5A5F66] hover:text-[#1C1E21] disabled:opacity-35 transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={track.isPlaying ? 'Mettre en pause' : 'Lire la récitation'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#0F5C4D] hover:bg-[#004337] text-white transition-colors cursor-pointer"
          >
            {track.isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={onNextAyah}
            disabled={track.ayahNumber >= track.totalAyahs}
            aria-label="Verset suivant"
            className="min-h-[44px] min-w-[40px] flex items-center justify-center text-[#5A5F66] hover:text-[#1C1E21] disabled:opacity-35 transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le lecteur audio"
            className="min-h-[44px] min-w-[36px] flex items-center justify-center text-[#5A5F66] hover:text-[#1C1E21] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
