import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/**
 * Radio Zigomar - Home Page with Audio Player
 * 
 * Design Philosophy:
 * - Warm, inviting aesthetic with radio heritage
 * - Red accent color (#DC2626) for brand identity
 * - Vintage radio vibes mixed with modern UI
 * - Focus on the audio player as the hero element
 */
export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const STREAM_URL = "https://stream.zeno.fm/pbzcyx7pjufuv";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Erreur lors de la lecture:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎙️</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Radio Zigomar</h1>
          </div>
          <p className="text-sm text-slate-600">La Radio des Aventuriers</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section with Player */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Player Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-2">Écoutez en Direct</h2>
              <p className="text-red-100 text-lg">Diffusion en continu 24/7</p>
            </div>

            {/* Player Body */}
            <div className="px-8 py-12">
              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">
                  {isPlaying ? "En direct" : "Hors ligne"}
                </span>
              </div>

              {/* Play/Pause Button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={togglePlay}
                  className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause size={48} fill="currentColor" />
                  ) : (
                    <Play size={48} fill="currentColor" className="ml-1" />
                  )}
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={toggleMute}
                  className="text-slate-600 hover:text-red-600 transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  aria-label="Volume"
                />
                <span className="text-sm text-slate-600 w-8">
                  {Math.round(isMuted ? 0 : volume * 100)}%
                </span>
              </div>

              {/* Time Display */}
              <div className="text-center text-sm text-slate-600 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src={STREAM_URL}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-bold text-slate-900 mb-2">Musique Éclectique</h3>
              <p className="text-sm text-slate-600">
                Pop 80's, rock alternatif, world et perles franco-arabes
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🎙️</div>
              <h3 className="font-bold text-slate-900 mb-2">Théâtre Radiophonique</h3>
              <p className="text-sm text-slate-600">
                Histoires immersives et chroniques incarnées
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-bold text-slate-900 mb-2">Aventure Sonore</h3>
              <p className="text-sm text-slate-600">
                Un refuge sonore pour les esprits libres
              </p>
            </div>
          </div>
        </div>

        {/* Emissions Section */}
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Émissions Phares</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-600 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-slate-900 mb-1">La Matinale avec Dali</h3>
              <p className="text-sm text-slate-600">Lun-Sam, 06h-10h</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-600 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-slate-900 mb-1">L'Aventure du Jazz</h3>
              <p className="text-sm text-slate-600">Avec DJ Lionel - Nocturne</p>
            </div>
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-600 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-slate-900 mb-1">Formats Intimes</h3>
              <p className="text-sm text-slate-600">En français et en arabe</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Rejoins les Aventuriers</h2>
            <p className="text-red-100 mb-8">
              Suis-nous sur les réseaux sociaux pour ne rien manquer
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="secondary"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                Facebook
              </Button>
              <Button
                variant="secondary"
                className="bg-white text-red-600 hover:bg-red-50"
              >
                Instagram
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Radio Zigomar</h3>
              <p className="text-sm">La Radio des Aventuriers</p>
              <p className="text-sm">98.3 FM • Perpignan</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Émissions</h3>
              <ul className="text-sm space-y-2">
                <li>La Matinale avec Dali</li>
                <li>L'Aventure du Jazz</li>
                <li>Formats Intimes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Informations</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">À Propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>© 2024 Radio Zigomar. Tous droits réservés. Créé avec passion pour les aventuriers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
