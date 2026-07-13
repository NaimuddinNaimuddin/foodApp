import { View, Text, FlatList, Button, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { cartStyles as styles } from "../../assets/styles/cartStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectSkeleton } from "@/lib/components/Skeletion";
import { router } from "expo-router";
import { handleApiError } from "@/lib/common/handleApiError";
import { useUser } from "@/context/userContext";
import EditAddressField from "@/lib/components/EditDeliveryAddress";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CartScreen() {
    const { user } = useUser();
    const [cart, setCart] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false as boolean);
    const [isOrderPlacing, setIsOrderPlacing] = useState(false as boolean);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const loadCarts = async () => {
        try {
            setIsLoading(true);
            const userId = user?.id;
            if (!userId) return;
            const { data } = await axios.get(`${API_URL}/cart/${userId}`);
            setCart(data);
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    }

    const decreaseQty = async (productId: string) => {
        try {
            const userId = user?.id;
            if (!userId) return;
            const { data } = await axios.put(`${API_URL}/cart/decrease/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            handleApiError(err);
        }
    };
    const increaseQty = async (productId: string) => {
        try {
            const userId = user?.id;
            if (!userId) return;
            const { data } = await axios.put(`${API_URL}/cart/increase/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            handleApiError(err);
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const userId = user?.id;
            if (!userId) return;
            const { data } = await axios.delete(`${API_URL}/cart/remove/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            handleApiError(err);
        }
    };

    const placeOrder = async () => {
        try {
            const areaId = user?.area_id;
            const deliveryAddress = user?.user_address;
            const altPhone = user?.alt_phone;
            if (!areaId) return;
            if (!deliveryAddress || !altPhone) {
                setModalVisible(true);
                return;
            }
            setIsOrderPlacing(true);
            const response = await axios.post(`${API_URL}/orders/place`, {
                ...cart, deliveryAddress, areaId
            });

            if (response && response.status == 201) {
                Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: response?.data?.message,
                });
                router.navigate('/(tabs)/orders');
            }

        } catch (err) {
            handleApiError(err);
        } finally {
            setIsOrderPlacing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCarts();
        }, [])
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <SelectSkeleton width={'100%'} height={80} style={{
                    marginTop: 12,
                    borderRadius: 12,
                }} />
                <SelectSkeleton width={'100%'} height={80} style={{
                    marginTop: 12,
                    borderRadius: 12,
                }} />
            </SafeAreaView>
        );
    }

    if (!cart || (cart.items && cart.items.length === 0)) {
        return (
            <View style={styles.center}>
                <Text>Your cart is empty.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cart.items}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Image
                            source={{
                                uri: item.foodId?.image_url || "https://via.placeholder.com/100",
                            }}
                            style={styles.foodImage}
                        />

                        <View style={styles.itemContent}>
                            <View style={styles.topRow}>
                                <Text style={styles.foodName} numberOfLines={1}>
                                    {item.foodId?.name}
                                </Text>

                                <View style={styles.stepper}>
                                    <TouchableOpacity
                                        onPress={() => decreaseQty(item.foodId._id)}
                                    >
                                        <Ionicons
                                            name="remove-circle-outline"
                                            size={20}
                                            color="#FF9800"
                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.qtyText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        onPress={() => increaseQty(item.foodId._id)}
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color="#4CAF50"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.foodName}>{item.foodId.quantity_info}</Text>
                            <View>
                                <Text style={styles.price}>
                                    ₹{(item.foodId?.price || 0) * item.quantity}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            />

            {cart && cart.items && (
                <View style={styles.checkoutBar}>
                    {user?.area_delivery_charge_in_rs && (<View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Delivery Charges</Text>
                        <Text style={{ ...styles.totalAmount, color: "555555", fontWeight: 400 }}>
                            ₹{(user?.area_delivery_charge_in_rs)}
                        </Text>
                    </View>)}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total </Text>
                        <Text style={styles.totalAmount}>
                            ₹{cart.items.reduce(
                                (sum: number, item: any) => sum + (item.foodId ? item.foodId.price : 0) * item.quantity, 0
                            ) + user?.area_delivery_charge_in_rs}
                        </Text>
                    </View>


                    <View style={styles.orderButton}>
                        <TouchableOpacity style={styles.button} disabled={isOrderPlacing} onPress={() => placeOrder()} >
                            <Text style={styles.buttonText}>
                                {isOrderPlacing ?
                                    <ActivityIndicator size={"small"} color={"#fff"} />
                                    : "Place Order - COD"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {modalVisible && <EditAddressField modalVisible={modalVisible} setModalVisible={setModalVisible} />}
        </View>
    )
}
