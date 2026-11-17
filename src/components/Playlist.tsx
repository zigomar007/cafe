import { useAlbumArt } from '@/hooks/useAlbumArt';
import { Music2 } from 'lucide-react';
import type { Track } from '@/hooks/useRadioMetadata';

interface PlaylistItemProps {
  track: Track;
  index: number;
  isCurrent?: boolean;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'à l\'instant';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

function PlaylistRow({ track, index, isCurrent }: PlaylistItemProps) {
  const query = track.artist ? `${track.artist} ${track.title}` : track.title;
  const art = useAlbumArt(isCurrent ? null : query);
  const displayArt = isCurrent ? null : art;

  return (
    <li
      className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all ${
        isCurrent
          ? 'bg-amber-500/10 border border-amber-500/30'
          : 'bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
      }`}
    >
      {/* Cover art */}
      <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-stone-800 flex items-center justify-center">
        {displayArt ? (
          <img
            src={displayArt}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <Music2 className="w-5 h-5 text-stone-600" />
        )}
        {isCurrent && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="flex items-end gap-0.5 h-5">
              <span className="w-1 bg-amber-400 rounded-full animate-eq1" />
              <span className="w-1 bg-amber-400 rounded-full animate-eq2" />
              <span className="w-1 bg-amber-400 rounded-full animate-eq3" />
            </span>
          </span>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={`truncate text-sm sm:text-base font-medium ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
          {track.title || track.raw}
        </p>
        <p className="truncate text-xs sm:text-sm text-stone-400">
          {track.artist || 'ZIGOMAR FM'}
        </p>
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0 text-right">
        <span className="text-[10px] sm:text-xs text-stone-500 whitespace-nowrap">
          {isCurrent ? "En cours" : formatTimeAgo(track.startedAt)}
        </span>
      </div>
    </li>
  );
}

interface PlaylistProps {
  current: Track | null;
  history: Track[];
}

export function Playlist({ current, history }: PlaylistProps) {
  const allTracks = current ? [current, ...history] : history;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Titres récents</h2>
          <p className="text-sm text-stone-400">Playlist en direct &middot; 7 derniers jours</p>
        </div>
        <span className="text-xs text-stone-500">{allTracks.length} titre{allTracks.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 -mr-1 max-h-[60vh] sm:max-h-none scroll-area">
        {allTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-500">
            <Music2 className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">En attente des titres en direct...</p>
          </div>
        ) : (
          <ol className="space-y-2">
            {allTracks.map((track, i) => (
              <PlaylistRow
                key={`${track.startedAt.getTime()}-${i}`}
                track={track}
                index={i}
                isCurrent={i === 0 && current !== null}
              />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
