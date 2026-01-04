import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Order } from "@/types/orders";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const USER_ID = "64a3f7c6b9c12345abcde678"; // replace with auth userId

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
          Order • {new Date(order.createdAt).toDateString()}
        </Text>

        <Text style={styles.status}>Status: {order.status}</Text>
        <Text style={styles.address}>📍 {order.deliveryAddress}</Text>

        <View style={styles.divider} />

        {order.items.map((item: any) => (
          <View key={item._id} style={styles.itemRow}>
            <View>
              <Text style={styles.foodName}>{item && item.foodId && item.foodId.name}</Text>
              <Text style={styles.restaurant}>
                {item && item.foodId && item.foodId.restaurant && item.foodId.restaurant.name}
              </Text>
            </View>

            <Text style={styles.price}>
              ₹{item.foodId ? item.foodId.price : 0} × {item.quantity}
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

  return (
    <FlatList
      data={orders}
      keyExtractor={(item: Order) => item._id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => <OrderCard order={item} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  orderId: {
    fontWeight: "bold",
    fontSize: 14,
  },
  status: {
    color: "#4CAF50",
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  foodName: {
    fontWeight: "600",
  },
  restaurant: {
    fontSize: 12,
    color: "#777",
  },
  price: {
    fontWeight: "600",
  },
  total: {
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 6,
  },
});
