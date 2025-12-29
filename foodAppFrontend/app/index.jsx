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
import { signupStyles as styles } from "../assets/styles/signupStyles";
import { useRouter } from "expo-router";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const SignupScreen = () => {
    const router = useRouter();
    const [phone, setPhone] = useState("");
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

            <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={{ marginTop: 15, color: "#ee0000", textAlign: "center" }}>
                    Already have an account? Log in
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;
