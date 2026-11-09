import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useTheme } from "@/context/ThemeContext";
import { Artist, getArtist, getArtistTopTracks, Track } from "@/lib/deezer";
import TrackRow from "@/components/TrackRow";

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getArtist(id), getArtistTopTracks(id)])
      .then(([foundArtist, foundTracks]) => {
        setArtist(foundArtist);
        setTracks(foundTracks);
      })
      .catch(() => setArtist(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!artist) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Artist not found</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.list}
      data={tracks}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.header}>
          <Image source={artist.picture_xl ?? artist.picture_medium} style={styles.picture} contentFit="cover" />
          <Text style={[styles.name, { color: colors.text }]}>{artist.name}</Text>
          {artist.nb_fan !== undefined && (
            <Text style={{ color: colors.subtext }}>{artist.nb_fan.toLocaleString()} fans</Text>
          )}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular</Text>
        </View>
      }
      ListEmptyComponent={<Text style={[styles.empty, { color: colors.subtext }]}>No songs found</Text>}
      renderItem={({ item }) => (
        <TrackRow
          title={item.title}
          artist={item.artist.name}
          cover={item.album.cover_medium}
          colors={colors}
          onPress={() => router.push({ pathname: "/song/[id]", params: { id: String(item.id) } })}
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
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    paddingBottom: 8,
  },
  picture: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
  },
});
