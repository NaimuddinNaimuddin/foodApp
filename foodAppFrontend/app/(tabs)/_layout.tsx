import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "profile") iconName = "person-outline";
          else if (route.name === "orders") iconName = "receipt-outline";
          else if (route.name === "cart") iconName = "cart";
          else iconName = "home";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="orders" options={{ title: "My Orders" }} />
      <Tabs.Screen name="profile" options={{ title: "My Profile", headerShown: false }} />
    </Tabs>
  );
}
