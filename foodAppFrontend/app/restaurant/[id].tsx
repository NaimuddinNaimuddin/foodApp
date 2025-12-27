import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Button } from "react-native";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface FoodItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_BASE_URL}/restaurants/${id}/food-items`);
        console.log({ res })
        setFoodItems(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load food items");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [id]);

  const addToCart = (foodId: string) => {
    const res = axios.post(`${API_BASE_URL}/restaurants/cart/add`, {
      userId: "user123",
      foodId
    });
    console.log({ res });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
            <Button
              title="Add to Cart"
              onPress={() => addToCart(item._id)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No food items available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  foodName: { fontSize: 16, fontWeight: "bold" },
  price: { marginTop: 4, color: "#555" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
  errorText: { textAlign: "center", marginTop: 20, color: "red" },
});
