# Musify

A tiny Spotify-like app built with React Native (Expo) and the [Deezer API](https://developers.deezer.com/api).
Browse the charts, search songs or artists, and play the 30s previews.

## Features
- Home: top songs, popular artists, recently played
- Search songs and artists
- Song page with a player (30s preview) and a like button
- Artist page with their top songs
- Library with your liked songs
- Settings: your name, dark/light mode, clear history

## What's used (from the lectures)
- **Tabs**: Home / Search / Your Library
- **Drawer**: Home / Settings
- **Stack + dynamic routes**: `song/[id]`, `artist/[id]`
- **Context API**: `ThemeContext`, `UserContext`, `LikesContext` (with `useReducer`)
- **Dark / light theme**: toggle in Settings
- **Backend API**: Deezer public API (`fetch`)
- **Local storage**:
  - SQLite (`expo-sqlite`): liked songs + recently played
  - AsyncStorage: theme choice
  - SecureStore (`expo-secure-store`): your name
- **Other hooks**: `useState`, `useEffect`, `useReducer`, `useCallback`, `useFocusEffect`, `useLocalSearchParams`, `useRouter`, `useAudioPlayer`
- FlatList, SectionList, expo-image, expo-audio

## Run it
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go. Use a phone or emulator, the web version won't work because Deezer blocks browser requests (CORS).

## Structure
```
app/
  _layout.tsx           root stack + providers
  (drawer)/
    _layout.tsx         drawer
    settings.tsx
    (tabs)/
      _layout.tsx       tabs
      index.tsx         home
      search.tsx
      library.tsx
  song/[id].tsx
  artist/[id].tsx
components/             TrackRow, ArtistRow, CoverCard
context/                Theme, User, Likes
lib/                    deezer.ts (api), db.ts (sqlite)
```

No albums for now, it's an MVP.
