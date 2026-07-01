import { router, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useEffect } from "react";
import { storage } from "@/lib/storage";
// import { isTokenValid } from "@/lib/checkAuth";

export default function RootLayout() {

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem("token");
      // const valid = isTokenValid(token);
      if (!token) {
        await storage.removeItem("token");
        await storage.removeItem("user");

        router.replace("/login");
      } else {
        router.replace("/(tabs)/home");
      }
    };
    checkAuth();
  }, []);

  return (
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
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
