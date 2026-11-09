import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const lightColors = {
  background: "#ffffff",
  card: "#f1f1f1",
  text: "#121212",
  subtext: "#6a6a6a",
  border: "#e2e2e2",
  primary: "#1DB954",
};

const darkColors = {
  background: "#121212",
  card: "#242424",
  text: "#ffffff",
  subtext: "#a7a7a7",
  border: "#2a2a2a",
  primary: "#1DB954",
};

export type Colors = typeof lightColors;

type ThemeValue = {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme !== "light");

  useEffect(() => {
    AsyncStorage.getItem("theme").then((saved) => {
      if (saved) setIsDark(saved === "dark");
    });
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    AsyncStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? darkColors : lightColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
