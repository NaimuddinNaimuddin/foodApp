import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") iconName = "home";
          else if (route.name === "explore") iconName = "compass";
          else if (route.name === "cart") iconName = "cart";
          else iconName = "restaurant";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="food" options={{ title: "Food" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
    </Tabs>
  );
}
