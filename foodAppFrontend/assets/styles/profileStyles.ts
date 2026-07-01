import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    heading: {
        fontSize: 24,
        fontWeight: "700",
        margin: 20,
    },
    label: {
        marginHorizontal: 20,
        marginBottom: 8,
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
    },
    input: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 18,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    addressInput: {
        height: 100,
        textAlignVertical: "top",
    },
    option: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#eee",
    },
    optionText: {
        fontSize: 16,
        fontWeight: "500",
    },
    logoutBtn: {
        backgroundColor: "#E53935",
        margin: 20,
        padding: 15,
        borderRadius: 10,
    },
    logoutText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },
});