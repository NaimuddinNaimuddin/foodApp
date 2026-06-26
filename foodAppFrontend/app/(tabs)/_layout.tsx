import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") iconName = "person-outline";
          else if (route.name === "orders") iconName = "receipt-outline";
          else if (route.name === "cart") iconName = "cart";
          else iconName = "restaurant";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="food" options={{ headerShown: false }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="orders" options={{ title: "My Orders" }} />
      <Tabs.Screen name="index" options={{ title: "My Profile" }} />
    </Tabs>
  );
}
