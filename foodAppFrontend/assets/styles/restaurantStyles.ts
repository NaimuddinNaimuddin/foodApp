import { StyleSheet } from "react-native";

export const restaurantStyles = StyleSheet.create({
    categorySection: {
        marginBottom: 10,
    },

    categoryTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginHorizontal: 12,
        marginBottom: 2,
    },

    card: {
        width: 108,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginLeft: 10,
        overflow: "hidden",
        elevation: 2,
    },

    image: {
        width: "100%",
        aspectRatio: 1,
        resizeMode: "cover",
    },

    info: {
        padding: 6,
    },

    foodName: {
        fontSize: 13,
        fontWeight: "600",
    },

    qty: {
        fontSize: 11,
        color: "#666",
        marginTop: 2,
    },

    desc: {
        fontSize: 11,
        color: "#888",
        marginTop: 2,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    price: {
        fontSize: 14,
        fontWeight: "700",
    },

    mrp: {
        fontSize: 11,
        color: "#999",
        textDecorationLine: "line-through",
        marginLeft: 6,
    },

    addBtn: {
        marginTop: 8,
        backgroundColor: "#0A8F3D",
        borderRadius: 6,
        paddingVertical: 6,
        alignItems: "center",
        height:30,
    },

    addText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
});