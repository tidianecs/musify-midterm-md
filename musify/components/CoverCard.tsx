import { Pressable, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/context/ThemeContext";

type Props = {
  title: string;
  subtitle: string;
  image: string;
  round?: boolean;
  colors: Colors;
  onPress: () => void;
};

export default function CoverCard({ title, subtitle, image, round, colors, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.6 }]}>
      <Image source={image} style={[styles.image, round && styles.round]} contentFit="cover" />
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]} numberOfLines={1}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    gap: 4,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 6,
  },
  round: {
    borderRadius: 70,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
  },
});
