import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { restaurantStyles as styles } from "@/assets/styles/restaurantStyles";
import { SkeletonCard } from "@/lib/components/Skeletion";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleApiError } from "@/lib/common/handleApiError";
import { useUser } from "@/context/userContext";
import { queryClient } from "@/lib/queryClient";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function RestaurantScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUser();
    const [outOfStockLoading, setOutOfStockLoading] = useState(false);
    const [outOfStockItem, setOutOfStockItem] = useState<string | null>(null);

    const fetchFoodItems = async (id: string) => {
        const res = await axios.get(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/food/list/${id}`
        );
        return res.data;
    };

    const {
        data: foodItems = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["food/list", id],
        queryFn: () => fetchFoodItems(id),
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });

    const updateFoodStatusLocally = (foodId: string, inStockStatus: boolean) => {
        queryClient.setQueryData(["food/list", id], (oldData: any) => {
            if (!oldData) return oldData;

            return oldData.map((category: any) => ({
                ...category,
                items: category.items.map((item: any) =>
                    item._id === foodId
                        ? { ...item, in_stock: inStockStatus }
                        : item
                ),
            }));
        });
    };

    const handleOutOfStock = async (foodId: string, inStockStatus: boolean) => {
        try {
            if (!foodId) return;
            setOutOfStockLoading(true);
            setOutOfStockItem(foodId);
            const res = await axios.patch(`${API_BASE_URL}/vendor/food/instock`, { foodId, inStockStatus });
            if (res.status == 200) {
                updateFoodStatusLocally(foodId, inStockStatus);
                Toast.show({
                    type: "success",
                    text1: "Done.",
                });
            }
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setOutOfStockLoading(false);
            setOutOfStockItem(null);
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

    if (isError) {
        Toast.show({ type: 'error', text1: error.message || "Something Went Wrong." })
    }

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

                                    {food && <Text> {`${food.in_stock ? "Now In Stock" : "Not In Stock"}`} </Text>}

                                    {food && !food.in_stock &&
                                        <TouchableOpacity style={styles.addBtn}
                                            onPress={() => handleOutOfStock(food._id, true)}>
                                            <Text style={styles.addText}> Back In Stock </Text>
                                        </TouchableOpacity>}

                                    {food && food.in_stock && <TouchableOpacity
                                        style={styles.addBtn}
                                        disabled={outOfStockLoading && food._id === outOfStockItem}
                                        onPress={() => handleOutOfStock(food._id, false)}
                                    >
                                        <Text style={styles.addText}>
                                            {
                                                (outOfStockLoading && food._id === outOfStockItem) ?
                                                    <ActivityIndicator size={"small"} color={"#fff"} />
                                                    : "OUT OF STOCK"
                                            }
                                        </Text>
                                    </TouchableOpacity>}
                                </View>
                            </View>
                        )}
                    />
                </View>
            )}
        />
    );
}
