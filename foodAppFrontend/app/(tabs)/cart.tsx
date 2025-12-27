import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CartScreen() {
    const [cart, setCart] = useState([] as any);
    const userId = "user123";

    const loadCarts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/restaurants/cart/${userId}`);
            setCart(data as []);
        } catch (err: any) {
            console.error("Error loading restaurants:", err.message);
        }
    }

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
                keyExtractor={(item) => item.foodId._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.foodId.name}</Text>
                        <Text>Qty: {item.quantity}</Text>
                        <Text>₹{item.foodId.price * item.quantity}</Text>
                    </View>
                )}
            />

            <Text style={styles.total}>
                Total: ₹
                {cart && cart.items && cart.items.reduce(
                    (sum: number, item: any) => sum + item.foodId.price * item.quantity,
                    0
                )}
            </Text>
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
    }
});
