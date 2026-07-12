import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  phone: string;
  alt_phone: string | undefined;
  user_address: string | undefined;
  area_id: string | undefined;
}

interface UserContextType {
  user: User | null;
  initialLoading: Boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setInitialLoading(true);
      const data = await AsyncStorage.getItem("user");

      if (data) {
        setUser(JSON.parse(data));
      }
    } catch (error) {
      console.log("Failed to load user", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const saveUser = async (user: User) => {
    setUser(user);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: saveUser,
        initialLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return context;
}