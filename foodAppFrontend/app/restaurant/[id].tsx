import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { CategoryGroup } from "../../types/orders";
import { restaurantStyles as styles } from "../../assets/styles/restaurantStyles";
import { storage } from "@/lib/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // const [foodItems, setFoodItems] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchFoodItems = async () => {
  //     if (!id) return;

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const res = await axios.get(`${API_BASE_URL}/food/${id}/food-items`);
  //       console.log({ res })
  //       setFoodItems(res.data);
  //       // auto-select first category
  //       if (res.data.length > 0) {
  //         setSelectedCategory(res.data[0].category);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to load food items");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFoodItems();
  // }, [id]);

  const fetchFoodItems = async (id: string) => {
    const res = await axios.get(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/food/${id}/food-items`
    );
    return res.data;
  };

  const {
    data: foodItems = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["food-items", id],
    queryFn: () => fetchFoodItems(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id, // important (wait until id exists)
  });

  useEffect(() => {
    if (foodItems.length > 0) {
      setSelectedCategory(foodItems[0].category);
    }
  }, [foodItems]);

  const selectedItems =
    foodItems.find((c: any) => c.category === selectedCategory)?.items || [];

  const addToCart = async (foodId: string) => {
    const userId = await storage.getItem('userId');
    if (!userId) return;
    const res = await axios.post(`${API_BASE_URL}/cart/add`, {
      userId,
      foodId
    });
    if (res.status == 200) {
      Toast.show({
        type: "success",
        text1: "Added to Cart 🛒",
      });
    }
  };

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  if (isError) return <Text style={styles.errorText}>{error.message}</Text>;

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
            <Image source={{ uri: item.image_url }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.foodName} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={styles.qty}>{item.quantity_info}</Text>

              {item.short_desc ? (
                <Text style={styles.desc} numberOfLines={1}>
                  {item.short_desc}
                </Text>
              ) : null}

              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.mrp}>₹{item.mrp}</Text>
              </View>

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
