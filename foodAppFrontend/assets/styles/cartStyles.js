import { StyleSheet } from "react-native";

export const cartStyles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingHorizontal: 12,
        paddingTop: 10,
    },
    cartItem: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    foodImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: "#E0E0E0",
    },
    itemContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    foodName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginRight: 8,
    },
    price: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2E7D32",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    stepper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    qtyText: {
        marginHorizontal: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    total: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "right",
        marginVertical: 14,
    },
    checkoutBar: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        // borderTopRightRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 10,
        marginHorizontal: 15,
        marginVertical: 10,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    totalLabel: {
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
    },

    totalAmount: {
        fontSize: 20,
        fontWeight: "700",
        color: "#2E7D32",
    },

    orderButton: {
        borderRadius: 10,
        overflow: "hidden",
    },
});
