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
        width: 128,
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
        height: 30,
    },

    addText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 12,
    },
    checkoutButton: {
        height: 36,
        backgroundColor: '#0a8f3d',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
    },

    checkoutText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 600,
    },

    productImage: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },

    imageModal: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    fullImage: {
        width: '95%',
        height: '80%',
    },

    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#555",
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },

    closeText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '300',
        lineHeight: 34,
    },
});