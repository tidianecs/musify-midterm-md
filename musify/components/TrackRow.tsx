import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/context/ThemeContext";

type Props = {
  title: string;
  artist: string;
  cover: string;
  colors: Colors;
  onPress: () => void;
};

export default function TrackRow({ title, artist, cover, colors, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <Image source={cover} style={styles.cover} contentFit="cover" />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.artist, { color: colors.subtext }]} numberOfLines={1}>
          {artist}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  artist: {
    fontSize: 13,
  },
});
