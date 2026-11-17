import { useEffect, useState } from 'react';

interface iTunesResult {
  results: Array<{
    artworkUrl100: string;
    artworkUrl60?: string;
  }>;
}

function upscaleArtwork(url: string): string {
  return url.replace('100x100', '600x600').replace('60x60', '600x600');
}

export function useAlbumArt(query: string | null): string | null {
  const [art, setArt] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setArt(null);
      return;
    }
    let cancelled = false;
    setArt(null);
    fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1&entity=song`
    )
      .then((r) => r.json() as Promise<iTunesResult>)
      .then((data) => {
        if (cancelled) return;
        if (data.results && data.results.length > 0) {
          setArt(upscaleArtwork(data.results[0].artworkUrl100));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [query]);

  return art;
}
