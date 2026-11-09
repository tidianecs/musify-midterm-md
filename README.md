# Musify

Spotify-like app made with React Native (Expo) and the [Deezer API](https://developers.deezer.com/api).
Browse the charts, search songs or artists, and listen to the 30s previews.

## Features
- Home: top songs, popular artists, recently played
- Search songs and artists
- Song page with a player and a like button
- Artist page with their top songs
- Library with your liked songs
- Settings: your name, dark/light mode, clear history

No albums, it's an MVP.

## What's used
- **Tabs**: Home / Search / Your Library
- **Drawer**: Home / Settings
- **Stack + dynamic routes**: `song/[id]`, `artist/[id]`
- **Context API**: `ThemeContext`, `UserContext`, `LikesContext` (with `useReducer`)
- **Dark / light theme**: switch in Settings
- **Backend API**: Deezer public API with `fetch`
- **Local storage**:
  - SQLite (`expo-sqlite`): liked songs + recently played
  - AsyncStorage: theme
  - SecureStore (`expo-secure-store`): your name
- **Hooks**: `useState`, `useEffect`, `useReducer`, `useContext`, `useCallback`, `useFocusEffect`, `useRouter`, `useLocalSearchParams`, `useAudioPlayer`, `useAudioPlayerStatus`
- FlatList, SectionList, expo-image, expo-audio

## Run it
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go.

If the phone can't connect (timeout), use a tunnel:
```bash
npx expo login --no-browser -u <your_username>
npx expo start --tunnel
```
Also log in to Expo Go on the phone with the same account.

Web doesn't work, Deezer blocks browser requests (CORS). Use a phone or an emulator.

## Structure
```
app/
  _layout.tsx          root stack + providers
  (drawer)/
    _layout.tsx        drawer
    settings.tsx
    (tabs)/
      _layout.tsx      tabs
      index.tsx        home
      search.tsx
      library.tsx
  song/[id].tsx
  artist/[id].tsx
components/            TrackRow, ArtistRow, CoverCard
context/               Theme, User, Likes
lib/                   deezer.ts (api), db.ts (sqlite)
```
