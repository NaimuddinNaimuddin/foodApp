import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#009688",
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#244B36',
        marginBottom: 8,
    },
});