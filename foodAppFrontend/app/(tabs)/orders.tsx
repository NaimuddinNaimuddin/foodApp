import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
} from "react-native";
import axios from "axios";
import { Order } from "@/assets/types/orders";
import { useFocusEffect } from "@react-navigation/native";
import { styles } from "@/assets/styles/orderStyles";
import OrderCard from "@/lib/components/OrderCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectSkeleton } from "@/lib/components/Skeletion";
import { useUser } from "@/context/userContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function OrdersScreen() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const controller = new AbortController();
      fetchOrders(controller.signal);
      return () => {
        controller.abort();
      };
    }, [user?.area_id])
  );

  const fetchOrders = async (signal: any) => {
    try {
      setLoading(true);
      const userId = user?.id;
      const areaId = user?.area_id;
      if (!userId || !areaId) return;

      const res = await axios.get(
        `${API_BASE_URL}/orders/${userId}/${areaId}`, { signal }
      );

      setOrders(res.data);
    } catch (err: any) {
      if (err.code === "ERR_CANCELED") {
        return;
      }

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
