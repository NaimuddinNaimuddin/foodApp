import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Image,
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
    const { setUser } = useUser();

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
            <Image
                source={require('@/assets/images/splash-icon.png')}
                style={styles.logo}
            />
            {/* <Text style={styles.title}>Login Here</Text> */}

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                maxLength={15}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                maxLength={15}
            />

            <TouchableOpacity disabled={loading} style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>
                    {loading ?
                        <ActivityIndicator size={"small"} color={"#fff"} />
                        : "Login"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/login/forget")}>
                <Text style={{ fontSize: 16, marginTop: 15, color: "#00dd00", textDecorationLine: "underline", textAlign: "center" }}>
                    Forget Password? Reset Password Here.
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/")}>
                <Text style={{ fontSize: 16, marginTop: 15, color: "#ee0000", textDecorationLine: "underline", textAlign: "center" }}>
                    Click Here To Register / Signup.
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
