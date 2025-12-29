import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="restaurant/[id]" options={{ title: "Menu" }} />
        <Stack.Screen name="index" options={{ title: "Create Your Account" }} />
        <Stack.Screen name="login/index" options={{ title: "Login Your Account" }} />
      </Stack>
      <Toast />
    </>
  );
}
