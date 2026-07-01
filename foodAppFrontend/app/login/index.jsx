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
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import Toast from "react-native-toast-message";


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const LoginScreen = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!phone || !password) {
            Toast.show({ type: "error", text1: "All fields are required" });
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/users/login`,
                { phone, password, },
            );

            if (response.status === 200) {
                Toast.show({ type: "success", text1: response.data.message });
                await storage.setItem('userId', response.data.user.id);
                await storage.setItem('phone', response.data.user.phone);
                await storage.setItem('token', response.data.token);
                router.replace('/(tabs)/home');
            }

        } catch (error) {
            if (error.response) {
                Toast.show({ type: "error", text1: error.response.data.message });
            } else {
                Toast.show({ type: "error", text1: "Server not reachable" });
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

            <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={{ marginTop: 15, color: "#ee0000", textAlign: "center" }}>
                    Dont have an account? Signup.
                </Text>
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
