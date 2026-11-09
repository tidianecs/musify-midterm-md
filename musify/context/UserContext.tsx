import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type UserValue = {
  username: string;
  saveUsername: (name: string) => Promise<void>;
};

const UserContext = createContext<UserValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    SecureStore.getItemAsync("username").then((saved) => {
      if (saved) setUsername(saved);
    });
  }, []);

  async function saveUsername(name: string) {
    await SecureStore.setItemAsync("username", name);
    setUsername(name);
  }

  return <UserContext.Provider value={{ username, saveUsername }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const value = useContext(UserContext);
  if (!value) throw new Error("useUser must be used inside UserProvider");
  return value;
}
