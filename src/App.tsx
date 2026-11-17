import { useRadioMetadata } from '@/hooks/useRadioMetadata';
import { useAlbumArt } from '@/hooks/useAlbumArt';
import { RadioPlayer } from '@/components/RadioPlayer';
import { Playlist } from '@/components/Playlist';
import { SocialLinks } from '@/components/SocialLinks';
import { Radio } from 'lucide-react';

// Audio stream: surfernetwork auto-redirects to a fresh-token URL on each connect
const STREAM_URL = 'https://stream.surfernetwork.com/t6arvo56ldlvv';
// Zeno.fm mount point for live metadata (now-playing titles via SSE)
const MOUNT_POINT = 't6arvo56ldlvv';

function App() {
  const { current, history, isLive } = useRadioMetadata(MOUNT_POINT, 20);
  const currentQuery = current
    ? current.artist
      ? `${current.artist} ${current.title}`
      : current.title
    : null;
  const albumArt = useAlbumArt(current ? currentQuery : null);

  const currentDisplay = current
    ? current.artist
      ? `${current.artist} — ${current.title}`
      : current.title
    : '';

  return (
    <div className="relative min-h-screen bg-stone-950 text-white overflow-x-hidden">
      {/* Animated blurred backdrop from album art */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: albumArt ? `url(${albumArt})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: albumArt ? 0.15 : 0,
            filter: 'blur(80px)',
            transform: 'scale(1.2)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/70 to-stone-950" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-950/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-base sm:text-lg tracking-wide">ZIGOMAR FM</p>
              <p className="text-[10px] sm:text-xs text-amber-300/70 uppercase tracking-widest">HD Stream</p>
            </div>
          </div>
          <SocialLinks />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Player column */}
          <section className="lg:sticky lg:top-24 flex flex-col items-center">
            <div className="w-full rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-8 sm:p-12">
              <RadioPlayer
                streamUrl={STREAM_URL}
                currentTitle={currentDisplay}
                isLive={isLive}
              />
            </div>

            {/* Social row under player */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs text-stone-500 uppercase tracking-widest">Suivez-nous</p>
              <SocialLinks />
            </div>
          </section>

          {/* Playlist column */}
          <section className="rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-6 sm:p-8">
            <Playlist current={current} history={history} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Radio ZIGOMAR FM &mdash; Tous droits réservés
          </p>
          <SocialLinks className="scale-90" />
        </div>
      </footer>
    </div>
  );
}

export default App;
