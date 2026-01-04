import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { cartStyles as styles } from "../../assets/styles/cartStyles";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CartScreen() {
    const [cart, setCart] = useState([] as any);
    console.log({ cart })
    const userId = "64a3f7c6b9c12345abcde678";
    const deliveryAddress = "'13 Street , Siyana'";

    const loadCarts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/cart/${userId}`);
            setCart(data);
        } catch (err: any) {
            console.error("Error loading restaurants:", err.message);
        }
    }

    const decreaseQty = async (userId: string, productId: string) => {
        try {
            const { data } = await axios.put(`${API_URL}/cart/decrease/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            console.log("Error decreasing quantity:", err);
            throw err;
        }
    };
    const increaseQty = async (userId: string, productId: string) => {
        try {
            const { data } = await axios.put(`${API_URL}/cart/increase/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            console.log("Error increasing quantity:", err);
            throw err;
        }
    };

    const removeItem = async (userId: string, productId: string) => {
        try {
            const { data } = await axios.delete(`${API_URL}/cart/remove/${userId}/${productId}`);
            setCart(data);
        } catch (err) {
            console.log("Error removing item:", err);
            throw err;
        }
    };

    const placeOrder = async (userId: string) => {
        try {
            const { data } = await axios.post(`${API_URL}/orders/place`, {
                ...cart, deliveryAddress
            });
            // setCart(data);
            console.log({ data });
            loadCarts();
            Toast.show({
                type: "success",
                text1: "Success",
                text2: data.message,
            })

        } catch (err) {
            console.log("Error removing item:", err);
            throw err;
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCarts();
        }, [])
    );

    useEffect(() => {
        loadCarts();
    }, []);

    if (!cart || (cart.items && cart.items.length === 0)) {
        return (
            <View style={styles.center}>
                <Text>Your cart is empty</Text>
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

                                <Text style={styles.price}>
                                    ₹{(item.foodId?.price || 0) * item.quantity}
                                </Text>
                            </View>

                            <View style={styles.bottomRow}>
                                <View style={styles.stepper}>
                                    <TouchableOpacity
                                        onPress={() => decreaseQty(userId, item.foodId._id)}
                                    >
                                        <Ionicons
                                            name="remove-circle-outline"
                                            size={20}
                                            color="#FF9800"
                                        />
                                    </TouchableOpacity>

                                    <Text style={styles.qtyText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        onPress={() => increaseQty(userId, item.foodId._id)}
                                    >
                                        <Ionicons
                                            name="add-circle-outline"
                                            size={20}
                                            color="#4CAF50"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => removeItem(userId, item.foodId._id)}
                                >
                                    <Ionicons name="trash-outline" size={22} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />

            {cart && cart.items && (
                <View style={styles.checkoutBar}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>
                            ₹{cart.items.reduce(
                                (sum: number, item: any) => sum + (item.foodId ? item.foodId.price : 0) * item.quantity, 0
                            )}
                        </Text>
                    </View>

                    <View style={styles.orderButton}>
                        <Button title="Place Order" onPress={() => placeOrder(userId)} />
                    </View>
                </View>
            )}
        </View>
    )
}
