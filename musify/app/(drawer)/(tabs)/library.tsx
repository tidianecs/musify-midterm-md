import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useLikes } from "@/context/LikesContext";
import TrackRow from "@/components/TrackRow";

export default function LibraryScreen() {
  const { colors } = useTheme();
  const { likes } = useLikes();
  const router = useRouter();

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={likes}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={[styles.heart, { backgroundColor: colors.primary }]}>
            <Ionicons name="heart" size={28} color="#fff" />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Liked Songs</Text>
            <Text style={{ color: colors.subtext }}>{likes.length} songs</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.subtext }]}>
          Songs you like will appear here. Tap the heart on a song to save it.
        </Text>
      }
      renderItem={({ item }) => (
        <TrackRow
          title={item.title}
          artist={item.artist}
          cover={item.cover}
          colors={colors}
          onPress={() => router.push({ pathname: "/song/[id]", params: { id: String(item.id) } })}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  heart: {
    width: 64,
    height: 64,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    paddingHorizontal: 32,
    marginTop: 40,
    fontSize: 15,
  },
});
