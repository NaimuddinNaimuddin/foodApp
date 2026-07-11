import { storage } from "@/lib/storage";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

export default function RootLayout() {

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem("token");

      if (!token) {
        router.replace("/");
      } else {
        router.replace("/(tabs)/orders");
      }
    };
    checkAuth();
  }, []);

  return <>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="index"
        options={{ title: "Vendor Login" }}
      />
    </Stack>
    <Toast />
  </>;

}
