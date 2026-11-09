import { useEffect, useState } from "react";
import { ActivityIndicator, SectionList, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Artist, searchArtists, searchTracks, Track } from "@/lib/deezer";
import TrackRow from "@/components/TrackRow";
import ArtistRow from "@/components/ArtistRow";

type Result = { kind: "artist"; item: Artist } | { kind: "track"; item: Track };

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const text = query.trim();
    if (!text) {
      setArtists([]);
      setTracks([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const [foundArtists, foundTracks] = await Promise.all([searchArtists(text), searchTracks(text)]);
        if (!cancelled) {
          setArtists(foundArtists);
          setTracks(foundTracks);
        }
      } catch {
        if (!cancelled) setError("Search failed. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const sections: { title: string; data: Result[] }[] = [];
  if (artists.length > 0) {
    sections.push({ title: "Artists", data: artists.map((item) => ({ kind: "artist", item })) });
  }
  if (tracks.length > 0) {
    sections.push({ title: "Songs", data: tracks.map((item) => ({ kind: "track", item })) });
  }

  function renderEmpty() {
    if (loading) return <ActivityIndicator style={styles.empty} color={colors.primary} />;
    if (error) return <Text style={[styles.emptyText, { color: colors.subtext }]}>{error}</Text>;
    if (query.trim()) return <Text style={[styles.emptyText, { color: colors.subtext }]}>No results for "{query}"</Text>;
    return <Text style={[styles.emptyText, { color: colors.subtext }]}>Find your favorite songs and artists</Text>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.subtext} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="What do you want to listen to?"
          placeholderTextColor={colors.subtext}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && <Ionicons name="close" size={20} color={colors.subtext} onPress={() => setQuery("")} />}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(result) => `${result.kind}-${result.item.id}`}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={renderEmpty}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
        )}
        renderItem={({ item: result }) =>
          result.kind === "artist" ? (
            <ArtistRow
              name={result.item.name}
              picture={result.item.picture_medium}
              colors={colors}
              onPress={() => router.push({ pathname: "/artist/[id]", params: { id: String(result.item.id) } })}
            />
          ) : (
            <TrackRow
              title={result.item.title}
              artist={result.item.artist.name}
              cover={result.item.album.cover_medium}
              colors={colors}
              onPress={() => router.push({ pathname: "/song/[id]", params: { id: String(result.item.id) } })}
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  empty: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});
