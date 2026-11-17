import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from 'lucide-react';

interface RadioPlayerProps {
  streamUrl: string;
  currentTitle: string;
  isLive: boolean;
}

export function RadioPlayer({ streamUrl, currentTitle, isLive }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  useEffect(() => {
    const audio = new Audio(streamUrl);
    audio.preload = 'none';
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onPlay = () => { setIsPlaying(true); setIsLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const onError = () => { setIsLoading(false); setIsPlaying(false); };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [streamUrl]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setIsLoading(true);
      audio.volume = muted ? 0 : volume;
      audio.play().catch(() => {
        setIsLoading(false);
      });
    }
  }, [isPlaying, volume, muted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      setMuted(false);
      audio.volume = prevVolume;
      audio.muted = false;
    } else {
      setPrevVolume(volume);
      setMuted(true);
      audio.volume = 0;
      audio.muted = true;
    }
  }, [muted, volume, prevVolume]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    setMuted(false);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = v;
      audio.muted = false;
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Visualizer / Album blur backdrop */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        {/* Pulsing rings when live */}
        {isPlaying && (
          <>
            <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping-slow" />
            <span className="absolute -inset-3 rounded-full border border-amber-500/15 animate-pulse" />
          </>
        )}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-900/50 transition-transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-20 h-20 text-white animate-spin" strokeWidth={1.5} />
          ) : isPlaying ? (
            <Pause className="w-20 h-20 text-white" strokeWidth={1.5} />
          ) : (
            <Play className="w-20 h-20 text-white ml-2" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Live badge + Now playing */}
      <div className="text-center max-w-md px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold tracking-widest uppercase mb-3">
          <span className={`w-2 h-2 rounded-full bg-white ${isLive ? 'animate-pulse' : ''}`} />
          {isLive ? 'On Air' : 'Connecting'}
        </div>
        <div className="flex items-center justify-center gap-2 text-amber-300/90 text-sm mb-1">
          <Radio className="w-4 h-4" />
          <span className="font-medium tracking-wide">ZIGOMAR FM</span>
        </div>
        <p className="text-white text-lg sm:text-xl font-semibold leading-snug min-h-[1.75rem]">
          {currentTitle || 'En attente du titre en cours...'}
        </p>
      </div>

      {/* Volume control */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="text-amber-300 hover:text-white transition-colors"
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          aria-label="Volume"
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-amber-500"
        />
      </div>
    </div>
  );
}
