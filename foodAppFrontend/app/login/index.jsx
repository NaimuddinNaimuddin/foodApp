import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import Toast from "react-native-toast-message";
import { styles } from "@/assets/styles/loginStyles";
import { useUser } from "../../context/userContext";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const LoginScreen = () => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useUser();

    const handleLogin = async () => {
        if (!phone) {
            Toast.show({ type: "error", text1: "Please Enter Phone Number." });
            return;
        }
        if (!password) {
            Toast.show({ type: "error", text1: "Please Enter Password." });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/users/login`,
                { phone, password, },
            );

            if (response.status === 200 && response.data) {
                await storage.setItem('token', response.data?.token);
                setUser(response.data.user);
                router.replace('/(tabs)/home');
            }

        } catch (error) {
            if (error && error.response && error.response.data) {
                Toast.show({ type: "error", text1: error.response.data?.message });
            } else {
                Toast.show({ type: "error", text1: "Server not Reachable." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                maxLength={10}
            />

            <TouchableOpacity disabled={loading} style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>
                    {loading ?
                        <ActivityIndicator size={"small"} color={"#fff"} />
                        : "Login"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/login/forget")}>
                <Text style={{ marginTop: 15, color: "#00ff00", textAlign: "center" }}>
                    Forget Password? Click to reset.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/")}>
                <Text style={{ marginTop: 15, color: "#ee0000", textAlign: "center" }}>
                    Dont have an account? Signup.
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
