import * as SQLite from "expo-sqlite";

export type SavedTrack = {
  id: number;
  title: string;
  artist: string;
  cover: string;
};

const db = SQLite.openDatabaseSync("musify.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS liked (id INTEGER PRIMARY KEY NOT NULL, title TEXT, artist TEXT, cover TEXT);
  CREATE TABLE IF NOT EXISTS recent (id INTEGER PRIMARY KEY NOT NULL, title TEXT, artist TEXT, cover TEXT, played_at INTEGER);
`);

export function getLikedTracks() {
  return db.getAllSync<SavedTrack>("SELECT id, title, artist, cover FROM liked ORDER BY rowid DESC");
}

export function insertLiked(track: SavedTrack) {
  db.runSync(
    "INSERT OR REPLACE INTO liked (id, title, artist, cover) VALUES (?, ?, ?, ?)",
    track.id,
    track.title,
    track.artist,
    track.cover
  );
}

export function deleteLiked(id: number) {
  db.runSync("DELETE FROM liked WHERE id = ?", id);
}

export function getRecentTracks() {
  return db.getAllSync<SavedTrack>("SELECT id, title, artist, cover FROM recent ORDER BY played_at DESC LIMIT 10");
}

export function addRecent(track: SavedTrack) {
  db.runSync(
    "INSERT OR REPLACE INTO recent (id, title, artist, cover, played_at) VALUES (?, ?, ?, ?, ?)",
    track.id,
    track.title,
    track.artist,
    track.cover,
    Date.now()
  );
}

export function clearRecent() {
  db.runSync("DELETE FROM recent");
}
