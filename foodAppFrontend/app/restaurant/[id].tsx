import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface Food {
  _id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface CategoryGroup {
  category: string;
  items: Food[];
}


export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const [foodItems, setFoodItems] = useState<Food[]>([]);
  // const [foodItems, setFoodItems] = useState<CategoryGroup[]>([]);
  const [foodItems, setFoodItems] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const selectedItems =
    foodItems.find((c) => c.category === selectedCategory)?.items || [];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_BASE_URL}/food/${id}/food-items`);
        console.log({ res })
        setFoodItems(res.data);
        // auto-select first category
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].category);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load food items");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [id]);

  const addToCart = async (foodId: string) => {
    const res = await axios.post(`${API_BASE_URL}/cart/add`, {
      userId: "64a3f7c6b9c12345abcde678",
      foodId
    });
    // console.log({ res });
    Toast.show({
      type: "success",
      text1: "Added to Cart 🛒",
      text2: "Item added successfully",
    });
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={foodItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.tabContainer}
        renderItem={({ item }) => {
          const active = item.category === selectedCategory;

          return (
            <TouchableOpacity
              style={[styles.tab, active && styles.activeTab]}
              onPress={() => setSelectedCategory(item.category)}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {item.category}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image_url }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text style={styles.foodName} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => addToCart(item._id)}
              >
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items available</Text>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingVertical: 10,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: "#E23744",
    borderColor: "#E23744",
  },

  tabText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "700",
  },

  container: { padding: 16 },

  categorySection: {
    marginBottom: 20,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  card: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },

  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  foodName: {
    fontSize: 15,
    fontWeight: "500",
  },

  price: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  addBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E23744",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 6,
  },

  addText: {
    color: "#E23744",
    fontWeight: "700",
    fontSize: 13,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },

  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
});
