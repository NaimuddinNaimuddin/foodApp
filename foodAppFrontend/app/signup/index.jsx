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

const SignupScreen = () => {
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        if (!phone || !password) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/users/signup`,
                { phone, password }
            );
            console.log({ data })
            Alert.alert("Success");
        } catch (error) {
            Alert.alert("Error", "Server not reachable");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;

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
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});
