import { StyleSheet } from "react-native";


export const restaurantStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
    },

    sidebar: {
        width: 90,
        backgroundColor: "#fff",
        borderRightWidth: 1,
        borderRightColor: "#e5e5e5",
    },

    content: {
        flex: 1,
        paddingHorizontal: 10,
    },

    tab: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderLeftWidth: 4,
        borderLeftColor: "transparent",
        backgroundColor: "#fff",
    },

    activeTab: {
        backgroundColor: "#fff",
        borderLeftColor: "#ff5722",
    },

    tabText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },

    activeTabText: {
        color: "#ff5722",
        fontWeight: "800",
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    image: {
        width: 90,
        height: 90,
        borderRadius: 10,
    },

    info: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },

    foodName: {
        fontSize: 16,
        fontWeight: "700",
    },

    qty: {
        color: "#666",
        fontSize: 13,
    },

    desc: {
        color: "#888",
        fontSize: 12,
        marginVertical: 4,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    price: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },

    mrp: {
        textDecorationLine: "line-through",
        color: "#999",
    },

    addBtn: {
        marginTop: 8,
        alignSelf: "flex-start",
        paddingHorizontal: 18,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ff5722",
    },

    addText: {
        color: "#ff5722",
        fontWeight: "700",
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
    },

    listContent: {
        paddingVertical: 10,
    },

    row: {
        justifyContent: "space-between",
    },

    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#eee",
        elevation: 2,
    },

    image: {
        width: "100%",
        height: 120,
    },

    info: {
        padding: 10,
    },

    foodName: {
        fontSize: 15,
        fontWeight: "700",
    },

    qty: {
        fontSize: 12,
        color: "#666",
        marginTop: 3,
    },

    desc: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
        minHeight: 32,
    },

    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    price: {
        fontSize: 16,
        fontWeight: "700",
        color: "#000",
    },

    mrp: {
        marginLeft: 8,
        fontSize: 13,
        color: "#999",
        textDecorationLine: "line-through",
    },

    addBtn: {
        marginTop: 10,
        backgroundColor: "#ff5722",
        borderRadius: 8,
        paddingVertical: 8,
        alignItems: "center",
    },

    addText: {
        color: "#fff",
        fontWeight: "700",
    },
});