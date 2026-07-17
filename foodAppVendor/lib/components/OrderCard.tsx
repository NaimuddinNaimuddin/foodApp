import { View, Text, TouchableOpacity, Linking, TextInput } from "react-native";
import { styles } from "@/assets/styles/orderStyles";
import { Order } from "@/assets/types/orders";
import OrderTracker from "./OrderTracker";
import { OrderStatus } from "../constant";
import { getOrderShareText } from "../orderShare";
import { useState } from "react";

export default function OrderCard({ order, changeOrderStatus, statusloading }: { order: Order, changeOrderStatus: any, statusloading: boolean }) {
    const [status_reason, setstatus_reason] = useState(order.status_reason || '');
    const handlePreparing = async (order: Order) => {
        await changeOrderStatus(order._id, OrderStatus.ON_THE_WAY, status_reason);
        const message = getOrderShareText(order);
        // const url = `whatsapp://send?phone=${919548875191}&text=${encodeURIComponent(message)}`;
        const url = `https://wa.me/${919548875191}?text=${encodeURIComponent(message)}`;
        await Linking.openURL(url);
    };

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
            <Text style={styles.address}>📍 {order?.deliveryAddress} </Text>
            <Text style={styles.address}>📞 {order?.deliveryPhone} </Text>
            {(order.status === OrderStatus.CANCELLED)
                ? <Text style={styles.badge}> {OrderStatus.CANCELLED} </Text>
                : <OrderTracker status={order.status} />
            }

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
            <Text style={styles.total}>Total (Delivery Charges Added):  ₹{order.totalAmount}</Text>

            <TextInput
                style={styles.input}
                placeholder="Reason (Optional)"
                value={status_reason}
                onChangeText={setstatus_reason}
                maxLength={150}
            />

            <View style={styles.buttonRow}>
                {(order.status === OrderStatus.PLACED || order.status === OrderStatus.CANCELLED) && <TouchableOpacity
                    disabled={statusloading}
                    style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
                    onPress={() => changeOrderStatus(order._id, OrderStatus.PREPARING, status_reason)}
                >
                    <Text style={styles.buttonText}>{OrderStatus.PREPARING}</Text>
                </TouchableOpacity>}

                {(order.status === OrderStatus.PREPARING) && <TouchableOpacity
                    disabled={statusloading}
                    style={[styles.actionButton, { backgroundColor: "#FF9800" }]}
                    onPress={() => handlePreparing(order)}
                >
                    <Text style={styles.buttonText}>{OrderStatus.ON_THE_WAY}</Text>
                </TouchableOpacity>}

                {(order.status === OrderStatus.ON_THE_WAY) && <TouchableOpacity
                    disabled={statusloading}
                    style={[styles.actionButton, { backgroundColor: "#36b1f4" }]}
                    onPress={() => changeOrderStatus(order._id, OrderStatus.DELIVERED, status_reason)}
                >
                    <Text style={styles.buttonText}>{OrderStatus.DELIVERED}</Text>
                </TouchableOpacity>}

                {(order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED) && <TouchableOpacity
                    disabled={statusloading}
                    style={[styles.actionButton, { backgroundColor: "#F44336" }]}

                    onPress={() => changeOrderStatus(order._id, OrderStatus.CANCELLED, status_reason)}
                >
                    <Text style={styles.buttonText}>{OrderStatus.CANCELLED}</Text>
                </TouchableOpacity>}
            </View>
        </View>
    );
};