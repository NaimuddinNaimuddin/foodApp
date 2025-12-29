import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

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
                // renderItem={({ item }) => (
                //     <View style={styles.item}>
                //         <Text style={styles.name}>{item.foodId.name}</Text>
                //         <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                //             <TouchableOpacity onPress={() => decreaseQty(userId, item.foodId._id)} >
                //                 <Ionicons
                //                     name="remove-circle-outline"
                //                     size={26}
                //                     color="#FF9800"
                //                 />
                //             </TouchableOpacity>

                //             <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                //                 Qty: {item.quantity}
                //             </Text>

                //             <TouchableOpacity
                //                 onPress={() => increaseQty(userId, item.foodId._id)}
                //             >
                //                 <Ionicons
                //                     name="add-circle-outline"
                //                     size={26}
                //                     color="#4CAF50"
                //                 />
                //             </TouchableOpacity>

                //             <TouchableOpacity
                //                 onPress={() => removeItem(userId, item.foodId._id)}
                //                 style={{ marginLeft: 10 }}
                //             >
                //                 <Ionicons
                //                     name="trash-outline"
                //                     size={24}
                //                     color="#F44336"
                //                 />
                //             </TouchableOpacity>
                //         </View>
                //         <Text>₹{item.foodId.price * item.quantity}</Text>
                //     </View>
                // )}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <View style={styles.topRow}>
                            <Text style={styles.foodName} numberOfLines={1}>
                                {item.foodId.name}
                            </Text>

                            <Text style={styles.price}>
                                ₹{item.foodId.price * item.quantity}
                            </Text>
                        </View>

                        <View style={styles.bottomRow}>
                            <View style={styles.stepper}>
                                <TouchableOpacity
                                    onPress={() => decreaseQty(userId, item.foodId._id)}
                                >
                                    <Ionicons name="remove-circle-outline" size={20} color="#FF9800" />
                                </TouchableOpacity>

                                <Text style={styles.qtyText}>{item.quantity}</Text>

                                <TouchableOpacity
                                    onPress={() => increaseQty(userId, item.foodId._id)}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => removeItem(userId, item.foodId._id)}
                            >
                                <Text style={styles.removeText}>
                                    <Ionicons
                                        name="trash-outline"
                                        size={24}
                                        color="#F44336"
                                    />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            />

            {cart && cart.items &&
                <Text style={styles.total}>
                    Total: ₹
                    {cart.items.reduce(
                        (sum: number, item: any) => sum + item.foodId.price * item.quantity,
                        0
                    )}
                </Text>
            }

            <Button title="Place Order" onPress={() => placeOrder(userId)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    name: {
        fontSize: 16,
        fontWeight: "bold"
    },
    total: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    cartItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    foodName: {
        fontSize: 15,
        fontWeight: "500",
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 15,
        fontWeight: "600",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 8,
        height: 32,
    },
    qtyText: {
        marginHorizontal: 10,
        fontWeight: "600",
    },
    removeText: {
        color: "#E23744",
        fontSize: 12,
        fontWeight: "600",
    },
});

