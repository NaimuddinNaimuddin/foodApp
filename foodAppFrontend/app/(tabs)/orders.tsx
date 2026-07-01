import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Order } from "@/assets/types/orders";
import { useFocusEffect } from "@react-navigation/native";
import { storage } from "@/lib/storage";
import { styles } from "@/assets/styles/orderStyles";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const fetchOrders = async () => {
    try {
      const USER_ID = await storage.getItem('userId');
      if (!USER_ID) return;
      const res = await axios.get(`${API_BASE_URL}/orders/${USER_ID}`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>
          Order •{" "}
          {new Date(order.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}

        </Text>

        <Text style={styles.status}>Status: {order.status}</Text>
        <Text style={styles.address}>📍 {order.deliveryAddress}</Text>

        <View style={styles.divider} />

        {order.items.map((item: any) => (
          <View key={item._id} style={styles.itemRow}>
            <View>
              <Text style={styles.foodName}>{item && item.name}</Text>
              <Text style={styles.restaurant}>
                {item && item.foodId && item.foodId.restaurant_id && item.foodId.restaurant_id.name}
              </Text>
            </View>

            <Text style={styles.price}>
              ₹{item && item.price} × {item.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.total}>Total: ₹{order.totalAmount}</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
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
