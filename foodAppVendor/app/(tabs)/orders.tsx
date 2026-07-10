import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Alert,
} from "react-native";
import axios from "axios";
import { Order } from "@/assets/types/orders";
// import { useFocusEffect } from "@react-navigation/native";
import { storage } from "@/lib/storage";
import { styles } from "@/assets/styles/orderStyles";
import OrderCard from "@/lib/components/OrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectSkeleton } from "@/lib/components/Skeletion";
import Toast from "react-native-toast-message";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function OrdersScreen() {
    const [orders, setOrders] = useState([] as Order[]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetchOrders(controller.signal);
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let eventSource: EventSource | null = null;

        const connectSSE = async () => {
            const areaId = await storage.getItem("area_id");
            if (!areaId) return;

            eventSource = new EventSource(`${API_BASE_URL}/stream/orders/${areaId}`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "new_order" && data.order) {
                    Toast.show({ type: 'success', text1: 'New Order.', visibilityTime: 10000 });
                    setOrders((prev) => [data.order, ...prev]);
                }
            };

            eventSource.onerror = (err) => {
                Toast.show({ type: 'error', text1: 'Live Connection Error.' });
                eventSource?.close();
            };
        };

        connectSSE();
        return () => {
            eventSource?.close();
        };
    }, []);

    const fetchOrders = async (signal: any) => {
        try {
            setLoading(true);
            const AREA_ID = await storage.getItem("area_id");
            if (!AREA_ID) return;

            const res = await axios.get(
                `${API_BASE_URL}/vendor/orders/${AREA_ID}`, { signal }
            );

            setOrders(res.data);
        } catch (err: any) {
            if (err.code === "ERR_CANCELED") {
                return;
            }
            Alert.alert(err?.response?.data?.message || 'Server Err.');
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <SelectSkeleton width={'100%'} height={180} style={{
                    marginTop: 12,
                    borderRadius: 12,
                }} />
                <SelectSkeleton width={'100%'} height={180} style={{
                    marginTop: 12,
                    borderRadius: 12,
                }} />
            </SafeAreaView>
        );
    }
    if (!orders.length) {
        return (
            <View style={styles.center}>
                <Text>No Orders Today.</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={orders}
            keyExtractor={(item: Order) => item._id}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => <OrderCard order={item} />}
        />
    );
}
