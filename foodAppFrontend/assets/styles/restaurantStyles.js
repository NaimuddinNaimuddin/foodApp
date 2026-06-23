import { StyleSheet } from "react-native";


export const restaurantStyles = StyleSheet.create({
    tabContainer: {
        paddingVertical: 10,
    },

    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 10,
    },

    activeTab: {
        backgroundColor: "#E23744",
        borderColor: "#E23744",
    },

    tabText: {
        fontSize: 14,
        color: "#555",
        fontWeight: "500",
    },

    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },

    container: { padding: 16 },

    categorySection: {
        marginBottom: 20,
    },

    categoryTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
        color: "#333",
    },

    card: {
        flexDirection: "row",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },

    image: {
        width: 110,
        height: 110,
        borderRadius: 8,
        backgroundColor: "#f2f2f2",
    },

    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },

    foodName: {
        fontSize: 15,
        fontWeight: "500",
    },

    qty: {
        fontSize: 10,
        color: "#666",
        marginTop: 1,
    },

    desc: {
        fontSize: 12,
        color: "#777",
        marginTop: 3,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#000",
        marginRight: 8,
    },

    mrp: {
        fontSize: 13,
        color: "#999",
        textDecorationLine: "line-through",
    },

    addBtn: {
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: "#E23744",
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 5,
        marginTop: 6,
    },

    addText: {
        color: "#E23744",
        fontWeight: "700",
        fontSize: 13,
    },

    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#888",
    },

    errorText: {
        textAlign: "center",
        marginTop: 20,
        color: "red",
    },
});