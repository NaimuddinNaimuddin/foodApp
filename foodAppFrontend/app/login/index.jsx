import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const LoginScreen = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/users/login`,
                {
                    phone,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            Alert.alert("Success", response.data.message);
            // Navigate to Home screen here

        } catch (error) {
            if (error.response) {
                Alert.alert("Error", error.response.data.message);
            } else {
                Alert.alert("Error", "Server not reachable");
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
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
});
