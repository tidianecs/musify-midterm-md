import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { clearRecent } from "@/lib/db";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { username, saveUsername } = useUser();
  const [name, setName] = useState(username);

  useEffect(() => {
    setName(username);
  }, [username]);

  async function onSave() {
    await saveUsername(name.trim());
    Alert.alert("Saved", "Your name was saved.");
  }

  function onClearHistory() {
    clearRecent();
    Alert.alert("Done", "Recently played was cleared.");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Your name</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor={colors.subtext}
        />
        <Pressable onPress={onSave} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && { opacity: 0.7 }]}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>

      <View style={[styles.card, styles.row, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Dark mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: colors.primary }} />
      </View>

      <Pressable onPress={onClearHistory} style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Clear recently played</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
