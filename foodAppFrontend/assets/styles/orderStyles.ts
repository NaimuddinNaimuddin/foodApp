import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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