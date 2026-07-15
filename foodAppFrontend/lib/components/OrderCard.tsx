import { View, Text } from "react-native";
import { styles } from "@/assets/styles/orderStyles";
import { Order } from "@/assets/types/orders";
import OrderTracker from "./OrderTracker";
import { OrderStatus } from "../constant";

export default function OrderCard({ order }: { order: Order }) {
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
            <Text style={styles.address}>📍 {order?.deliveryAddress}</Text>
            <Text style={styles.address}>📞 {(order?.deliveryPhone)}</Text>
            {order.status === OrderStatus.CANCELLED ?
                (<Text style={styles.badge}> {OrderStatus.CANCELLED} </Text>)
                : (<OrderTracker status={order.status} />)}

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
        </View>
    );
};