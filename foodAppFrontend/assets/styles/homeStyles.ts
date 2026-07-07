import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
        width: "32%",
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
    },

    image: {
        width: "100%",
        height: 100,
        resizeMode: "cover",
    },

    details: {
        padding: 6,
    },

    category: {
        fontSize: 12,
        textAlign: "center",
    },
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#fff",
    },

    searchBar: {
        backgroundColor: "#ffffff",
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e5e5",
    },

    restaurantName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
    },

    locationText: {
        marginTop: 6,
        fontSize: 13,
        color: "#777",
        textTransform: "capitalize",
    },

    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 14,
        color: "#999",
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    rating: {
        fontSize: 14,
        color: "#FFEB3B",
        marginRight: 20,
    },
    status: {
        fontSize: 12,
        color: "#00dd00",
        textTransform: "capitalize"
    },
    headerContainer: {
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    label: {
        fontSize: 12,
        color: "#777",
        marginBottom: 4,
    },
    selector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111",
    },
    arrow: {
        fontSize: 18,
        color: "#111",
    },
    dropdown: {
        marginTop: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
        elevation: 4,
        marginBottom: 15,
    },
    wrapper: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
    },
    guestText: {
        color: "#00b37a",
        fontWeight: "800",
    },

    subText: {
        fontSize: 13,
        color: "#777",
        marginTop: 2,
        marginBottom: 10,
    },

    pickerContainer: {
        borderRadius: 12,
        backgroundColor: "#f7f7f7",
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    picker: {
        height: 45,
        color: "#111",
    },
});