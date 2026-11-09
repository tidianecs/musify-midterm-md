import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/context/ThemeContext";

type Props = {
  name: string;
  picture: string;
  colors: Colors;
  onPress: () => void;
};

export default function ArtistRow({ name, picture, colors, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <Image source={picture} style={styles.picture} contentFit="cover" />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.label, { color: colors.subtext }]}>Artist</Text>
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
  picture: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  label: {
    fontSize: 13,
  },
});
