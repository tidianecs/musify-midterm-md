import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useTheme } from "@/context/ThemeContext";
import { useLikes } from "@/context/LikesContext";
import { formatDuration, getTrack, Track } from "@/lib/deezer";
import { addRecent } from "@/lib/db";

function SongPlayer({ track }: { track: Track }) {
  const { colors } = useTheme();
  const { isLiked, toggleLike } = useLikes();
  const router = useRouter();
  const player = useAudioPlayer(track.preview);
  const status = useAudioPlayerStatus(player);
  const liked = isLiked(track.id);

  const saved = {
    id: track.id,
    title: track.title,
    artist: track.artist.name,
    cover: track.album.cover_medium,
  };

  useEffect(() => {
    addRecent(saved);
  }, [track.id]);

  function togglePlay() {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration - 0.5) {
      player.seekTo(0);
    }
    player.play();
  }

  const progress = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Image source={track.album.cover_xl} style={styles.cover} contentFit="cover" />

      <View style={styles.titleRow}>
        <View style={styles.titleInfo}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {track.title}
          </Text>
          <Text
            style={[styles.artist, { color: colors.subtext }]}
            onPress={() => router.push({ pathname: "/artist/[id]", params: { id: String(track.artist.id) } })}
          >
            {track.artist.name}
          </Text>
        </View>
        <Pressable onPress={() => toggleLike(saved)} hitSlop={10}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? colors.primary : colors.text} />
        </Pressable>
      </View>

      <View style={styles.progressBlock}>
        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.text }]} />
        </View>
        <View style={styles.times}>
          <Text style={[styles.time, { color: colors.subtext }]}>{formatDuration(status.currentTime)}</Text>
          <Text style={[styles.time, { color: colors.subtext }]}>{formatDuration(status.duration)}</Text>
        </View>
      </View>

      <Pressable
        onPress={togglePlay}
        disabled={!track.preview}
        style={({ pressed }) => [styles.playButton, { backgroundColor: colors.primary }, pressed && { opacity: 0.7 }]}
      >
        <Ionicons name={status.playing ? "pause" : "play"} size={36} color="#000" />
      </Pressable>

      <Text style={[styles.note, { color: colors.subtext }]}>
        {track.preview ? "30 second preview from Deezer" : "No preview available for this song"}
      </Text>
      <Text style={[styles.note, { color: colors.subtext }]}>
        {track.album.title} · {formatDuration(track.duration)}
      </Text>
    </ScrollView>
  );
}

export default function SongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTrack(id)
      .then(setTrack)
      .catch(() => setTrack(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!track) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Song not found</Text>
      </View>
    );
  }

  return <SongPlayer track={track} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 24,
    gap: 20,
    alignItems: "center",
  },
  cover: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  titleInfo: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 16,
  },
  progressBlock: {
    width: "100%",
    gap: 6,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
  },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  note: {
    fontSize: 13,
    textAlign: "center",
  },
});
