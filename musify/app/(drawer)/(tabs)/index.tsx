import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { Artist, getChart, Track } from "@/lib/deezer";
import { getRecentTracks, SavedTrack } from "@/lib/db";
import TrackRow from "@/components/TrackRow";
import CoverCard from "@/components/CoverCard";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { username } = useUser();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [recent, setRecent] = useState<SavedTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadChart() {
    try {
      setError("");
      const chart = await getChart();
      setTracks(chart.tracks);
      setArtists(chart.artists);
    } catch {
      setError("Could not load music. Check your connection.");
    }
  }

  useEffect(() => {
    loadChart().finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRecent(getRecentTracks());
    }, [])
  );

  async function onRefresh() {
    setRefreshing(true);
    await loadChart();
    setRefreshing(false);
  }

  function openSong(id: number) {
    router.push({ pathname: "/song/[id]", params: { id: String(id) } });
  }

  function openArtist(id: number) {
    router.push({ pathname: "/artist/[id]", params: { id: String(id) } });
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {getGreeting()}
        {username ? `, ${username}` : ""}
      </Text>

      {error ? <Text style={[styles.error, { color: colors.subtext }]}>{error}</Text> : null}

      {recent.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently played</Text>
          <FlatList
            horizontal
            data={recent}
            keyExtractor={(item) => String(item.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
            renderItem={({ item }) => (
              <CoverCard
                title={item.title}
                subtitle={item.artist}
                image={item.cover}
                colors={colors}
                onPress={() => openSong(item.id)}
              />
            )}
          />
        </View>
      )}

      {artists.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular artists</Text>
          <FlatList
            horizontal
            data={artists}
            keyExtractor={(item) => String(item.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontal}
            renderItem={({ item }) => (
              <CoverCard
                title={item.name}
                subtitle="Artist"
                image={item.picture_medium}
                round
                colors={colors}
                onPress={() => openArtist(item.id)}
              />
            )}
          />
        </View>
      )}

      {tracks.length > 0 && <Text style={[styles.sectionTitle, { color: colors.text }]}>Top songs</Text>}
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={tracks}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={header}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TrackRow
          title={item.title}
          artist={item.artist.name}
          cover={item.album.cover_medium}
          colors={colors}
          onPress={() => openSong(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 24,
  },
  header: {
    paddingTop: 16,
    gap: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  error: {
    paddingHorizontal: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
  horizontal: {
    paddingHorizontal: 16,
    gap: 14,
  },
});
