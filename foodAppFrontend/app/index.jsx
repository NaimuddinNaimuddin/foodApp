import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    ActivityIndicator,
    Linking,
} from "react-native";
import axios from "axios";
import { signupStyles as styles } from "../assets/styles/signupStyles";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Checkbox from "expo-checkbox";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const SignupScreen = () => {
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!phone) {
            Toast.show({ type: "error", text1: "Please Enter Phone Number." });
            return;
        }
        if (!password) {
            Toast.show({ type: "error", text1: "Please Enter Password." });
            return;
        }
        if (!accepted) {
            Toast.show({ type: "error", text1: "Please Accept", text2: "Terms & Conditions, Return & Refund Policy and Privacy Policy." });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_BASE_URL}/users/signup`,
                { phone, password }
            );
            if (response && response.status == 201) {
                Toast.show({ type: "success", text1: response?.data?.message });
                router.replace('/login');
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
            <Text style={styles.title}>Signup</Text>

            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={phone}
                onChangeText={setPhone}
                maxLength={15}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={15}
            />
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12, marginBottom: 12 }}>
                <Pressable
                    onPress={() => setAccepted(!accepted)}
                    style={{
                        width: 22,
                        height: 22,
                        borderWidth: 2,
                        borderColor: "#16A34A",
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 4,
                    }}
                >
                    {accepted && (
                        <Text style={{ color: "#16A34A", fontWeight: "bold" }}>✓</Text>
                    )}
                </Pressable>
                <Text style={styles.text}>
                    {" I agree to the "}
                    <Text
                        style={styles.link}
                        onPress={() => Linking.openURL(`${API_BASE_URL}/terms`)}
                    >
                        Terms & Conditions
                    </Text>
                    {", "}
                    <Text
                        style={styles.link}
                        onPress={() => Linking.openURL(`${API_BASE_URL}/privacy-policy`)}
                    >
                        Privacy Policy
                    </Text>
                    {" and "}
                    <Text
                        style={styles.link}
                        onPress={() => Linking.openURL(`${API_BASE_URL}/refund-policy`)}
                    >
                        Return & Refund Policy
                    </Text>
                    {"."}
                </Text>
            </View>

            <TouchableOpacity disabled={loading} style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>
                    {
                        loading ?
                            <ActivityIndicator size={"small"} color={"#FFF"} />
                            : "Create Account"
                    }
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/login")}>
                <Text style={{ marginTop: 15, color: "#ee0000", textAlign: "center" }}>
                    Already have an account? Log in
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;
