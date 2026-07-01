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
    tracker: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 12,
    },
    stepContainer: {
        alignItems: "center",
        width: 60,
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#ddd",
    },
    activeCircle: {
        backgroundColor: "#2E7D32",
    },
    line: {
        flex: 1,
        height: 3,
        backgroundColor: "#ddd",
        marginTop: 8,
    },
    activeLine: {
        backgroundColor: "#2E7D32",
    },
    stepText: {
        marginTop: 6,
        fontSize: 11,
        textAlign: "center",
        color: "#999",
    },
    activeStepText: {
        color: "#2E7D32",
        fontWeight: "600",
    },
    currentStatus: {
        color: "#2E7D32",
        fontWeight: "600",
        marginBottom: 8,
    },
});