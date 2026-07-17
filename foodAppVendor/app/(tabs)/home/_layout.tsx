import { Stack } from "expo-router";

export default function FoodLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="restaurant/[id]"
                options={{
                    title: "Back to Home",
                    headerBackVisible: true,
                }}
            />
        </Stack>
    );
}