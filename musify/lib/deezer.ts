const BASE_URL = "https://api.deezer.com";

export type Artist = {
  id: number;
  name: string;
  picture_medium: string;
  picture_xl?: string;
  nb_fan?: number;
};

export type Track = {
  id: number;
  title: string;
  duration: number;
  preview: string;
  artist: { id: number; name: string };
  album: { id: number; title: string; cover_medium: string; cover_xl: string };
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(BASE_URL + path);
  if (!res.ok) throw new Error("Network error");
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? "Deezer error");
  return json;
}

export async function getChart() {
  const data = await get<{ tracks: { data: Track[] }; artists: { data: Artist[] } }>("/chart");
  return { tracks: data.tracks.data, artists: data.artists.data };
}

export async function searchTracks(query: string) {
  const data = await get<{ data: Track[] }>(`/search?q=${encodeURIComponent(query)}&limit=20`);
  return data.data;
}

export async function searchArtists(query: string) {
  const data = await get<{ data: Artist[] }>(`/search/artist?q=${encodeURIComponent(query)}&limit=5`);
  return data.data;
}

export function getTrack(id: string) {
  return get<Track>(`/track/${id}`);
}

export function getArtist(id: string) {
  return get<Artist>(`/artist/${id}`);
}

export async function getArtistTopTracks(id: string) {
  const data = await get<{ data: Track[] }>(`/artist/${id}/top?limit=20`);
  return data.data;
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
