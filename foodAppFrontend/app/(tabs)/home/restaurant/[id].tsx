import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { restaurantStyles as styles } from "@/assets/styles/restaurantStyles";
import { storage } from "@/lib/storage";
import { SkeletonCard } from "@/lib/components/Skeletion";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleApiError } from "@/lib/common/handleApiError";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RestaurantScreen() {
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addToCartItem, setAddToCartItem] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();

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
    enabled: !!id, // (wait until id exists)
  });

  const addToCart = async (foodId: string) => {
    try {
      const userId = await storage.getItem('userId');
      if (!userId) return;
      setAddToCartLoading(true);
      setAddToCartItem(foodId);
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
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setAddToCartLoading(false);
      setAddToCartItem(null);
    }

  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <FlatList
          data={Array.from({ length: 7 })}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 15,
            marginTop: 18,
          }}
          renderItem={() => <SkeletonCard />}
        />
      </SafeAreaView>
    );
  }
  if (isError) return <Text>{error.message}</Text>;

  return (
    <FlatList
      data={foodItems}
      keyExtractor={(item) => item.category}
      contentContainerStyle={{ paddingBottom: 10, marginTop: 10 }}
      renderItem={({ item }) => (
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{item.category}</Text>

          <FlatList
            data={item.items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(food) => food._id}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item: food }) => (
              <View style={styles.card}>
                <Image
                  source={{ uri: food.image_url }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {food.name}
                  </Text>

                  <Text style={styles.qty}>
                    {food.quantity_info}
                  </Text>

                  {!!food.short_desc && (
                    <Text style={styles.desc} numberOfLines={2}>
                      {food.short_desc}
                    </Text>
                  )}

                  <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{food.price}</Text>
                    <Text style={styles.mrp}>₹{food.mrp}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addBtn}
                    disabled={addToCartLoading && food._id === addToCartItem}
                    onPress={() => addToCart(food._id)}
                  >
                    <Text style={styles.addText}>
                      {
                        (addToCartLoading && food._id === addToCartItem) ?
                          <ActivityIndicator size={"small"} color={"#fff"} />
                          : "ADD"
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    />
  );
}
