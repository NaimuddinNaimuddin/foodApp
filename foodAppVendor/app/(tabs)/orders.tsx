import { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Alert,
} from "react-native";
import axios from "axios";
import { Order } from "@/assets/types/orders";
import { storage } from "@/lib/storage";
import { styles } from "@/assets/styles/orderStyles";
import OrderCard from "@/lib/components/OrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectSkeleton } from "@/lib/components/Skeletion";
import Toast from "react-native-toast-message";
import { useOrderSSE } from "@/lib/hooks/useOrderSSE";
import { usePathname } from "expo-router";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function OrdersScreen() {
    const pathname = usePathname();
    const [orders, setOrders] = useState([] as Order[]);
    const [loading, setLoading] = useState(false);
    const [statusloading, setstatusloading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        fetchOrders(controller.signal);
        return () => {
            controller.abort();
        };
    }, [pathname]);

    useOrderSSE({
        onNewOrder: useCallback((order) => {
            setOrders((prev) => {
                return [order, ...prev];
            });
            Toast.show({ type: "success", text1: "New Order! 🛎️" });
        }, [])
    });

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
            Toast.show({ type: "error", text1: err?.response?.data?.message || 'Server Err.' });
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    };

    const changeOrderStatus = async (orderId: string, status: string) => {
        try {
            setstatusloading(true);
            const response = await axios.patch(
                `${API_BASE_URL}/vendor/order-status`,
                { orderId, status }
            );

            if (response.status == 200 && response.data.message) {
                Toast.show({
                    type: "success",
                    text1: response.data.message,
                });
                setOrders((prev: any) => prev.map((order: Order) =>
                    order._id === orderId ? { ...order, status } : order
                ));
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: error.response?.data?.message || "Something went wrong",
            });
        } finally {
            setstatusloading(false);
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
            renderItem={({ item }) => <OrderCard statusloading={statusloading} changeOrderStatus={changeOrderStatus} order={item} />}
        />
    );
}
