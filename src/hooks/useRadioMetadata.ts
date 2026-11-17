import { useEffect, useRef, useState, useCallback } from 'react';

export interface Track {
  artist: string;
  title: string;
  raw: string;
  startedAt: Date;
}

export interface RadioMetadata {
  current: Track | null;
  history: Track[];
  isLive: boolean;
}

function parseStreamTitle(streamTitle: string): { artist: string; title: string } {
  const raw = streamTitle.trim();
  if (raw.includes(' - ')) {
    const [artist, ...rest] = raw.split(' - ');
    return { artist: artist.trim(), title: rest.join(' - ').trim() };
  }
  return { artist: '', title: raw };
}

/**
 * Connects to the Zeno.fm Metadata API (Server-Sent Events) to receive
 * real-time "now playing" updates. The audio stream is played separately
 * via the RadioPlayer component — this hook only handles metadata.
 *
 * The mountPoint must match the Zeno.fm station ID used for the audio stream.
 */
export function useRadioMetadata(
  mountPoint: string,
  maxHistory = 20
): RadioMetadata {
  const [current, setCurrent] = useState<Track | null>(null);
  const [history, setHistory] = useState<Track[]>([]);
  const [isLive, setIsLive] = useState(false);
  const currentRef = useRef<Track | null>(null);

  const pushTrack = useCallback(
    (streamTitle: string) => {
      const { artist, title } = parseStreamTitle(streamTitle);
      if (!title && !artist) return;
      const track: Track = {
        artist,
        title,
        raw: streamTitle.trim(),
        startedAt: new Date(),
      };
      const prev = currentRef.current;
      if (prev && prev.raw === track.raw) return; // duplicate
      currentRef.current = track;
      setCurrent(track);
      setHistory((prevHistory) => {
        const next = prev ? [prev, ...prevHistory] : prevHistory;
        return next.slice(0, maxHistory);
      });
    },
    [maxHistory]
  );

  const metadataUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${mountPoint}`;

  useEffect(() => {
    let es: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let receivedData = false;

    const connect = () => {
      es = new EventSource(metadataUrl);
      es.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.streamTitle) {
            if (!receivedData) {
              receivedData = true;
              setIsLive(true);
            }
            pushTrack(data.streamTitle);
          }
        } catch {
          // ignore malformed payloads
        }
      });
      es.onerror = () => {
        es?.close();
        if (!receivedData) setIsLive(false);
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      es?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [metadataUrl, pushTrack]);

  return { current, history, isLive };
}
