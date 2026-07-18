import { StyleSheet } from "react-native";

export const signupStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 50,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    text: {
        flex: 1,
        marginLeft: 5,
        color: "#444",
        lineHeight: 22,
        fontSize: 14,
    },
    link: {
        color: "#0A84FF",
        fontWeight: "600",
    },
});
