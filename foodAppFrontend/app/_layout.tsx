import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { UserProvider } from "@/context/userContext";
import { storage } from "@/lib/storage";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { Alert } from "react-native";

export default function RootLayout() {

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)/home");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        Alert.alert("AdMob initialized");
      });
  }, []);

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="index"
            options={{ title: "Create Your Account" }}
          />
          <Stack.Screen
            name="login/index"
            options={{ title: "Login Your Account" }}
          />
          <Stack.Screen
            name="login/forget"
            options={{ title: "Change Password" }}
          />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </UserProvider>
  );
}
