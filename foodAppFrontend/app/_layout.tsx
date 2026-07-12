import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";


export default function RootLayout() {

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
        <Stack.Screen
          name="login/forget"
          options={{ title: "Change Password" }}
        />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
